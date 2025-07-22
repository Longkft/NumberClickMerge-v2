import { _decorator, CCInteger, Component, Enum, Label, log, Node, Sprite, SpriteFrame } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
import { ToolManager, ToolType } from '../../Manager/ToolManager';
import { ToolProgress } from './ToolProgress';

const { ccclass, property } = _decorator;

// Đổi tên Enum để khớp với ToolManager
export { ToolType as TYPE_TOOL };
Enum(ToolType);

@ccclass('Ingame_Tool')
export class Ingame_Tool extends Component {
    @property({ type: ToolType })
    type: ToolType = ToolType.HAMMER;

    @property(Label)
    txtCoin: Label = null;

    @property({ type: Node })
    shadow: Node = null;

    @property({ type: Node })
    guide: Node = null;

    @property({ type: Sprite })
    bar: Sprite = null;

    @property({ type: Node })
    bgUpTool: Node = null;

    @property(CCInteger)
    coin: number = 0;

    protected start(): void {
        this.txtCoin.string = this.coin.toString();
        this.node.on(Node.EventType.TOUCH_START, this.OnClick, this);
        EventBus.on(EventGame.TOOL_FINISHED, this.onToolFinished, this);
        EventBus.on(EventGame.TOOL_UPGRADEUITOOLUP, this.UpgradeUiToolUp, this);

        this.UpgradeUiToolUp(this.type); // cập nhật ui tool up
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.OnClick, this);
        EventBus.off(EventGame.TOOL_FINISHED, this.onToolFinished);
        EventBus.off(EventGame.TOOL_UPGRADEUITOOLUP, this.UpgradeUiToolUp);
    }

    /**
     * Hàm xử lý click duy nhất cho tất cả các tool
     */
    private OnClick() {
        if (!this.CheckCoinUseToolGame()) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }

        // Hiển thị hiệu ứng và BÁO CHO TOOLMANAGER
        this.ShowFxShadow();
        ToolManager.getInstance().activateTool(this.type);
    }

    /**
     * Được gọi khi tool thực thi xong
     */
    private onToolFinished(finishedToolType: ToolType) {
        // KIỂM TRA: nếu tool vừa hoàn thành không phải là tool này, thì bỏ qua
        if (this.type !== finishedToolType) {
            return;
        }

        // Nếu đúng là tool này, thì mới thực hiện trừ tiền và ẩn hiệu ứng
        log(`Tool ${ToolType[this.type]} đã dùng xong, trừ ${this.coin} coin`);
        EventBus.emit(EventGame.UPDATE_COIN_UI, -this.coin);
        this.HideFxShadow();
    }

    private CheckCoinUseToolGame(): boolean {
        let coinData = MoneyController.getInstance().GoldCurrent;
        return coinData >= this.coin;
    }

    private async ShowFxShadow() {
        const shadowCpn = this.shadow.getComponent(FXShadow);
        await shadowCpn.ShowFxShadow();
        await shadowCpn.ShowFxGuide(this.guide.parent);
        this.guide.active = true;
    }

    private async HideFxShadow() {
        const shadowCpn = this.shadow.getComponent(FXShadow);
        await shadowCpn.HideFxGuide(this.guide.parent);
        this.guide.active = true;
        await shadowCpn.HideFXShadow();
    }

    private updateProgressBarFromToolState(toolState: ToolProgress | null) {
        if (!this.bar || !toolState) {
            return;
        }

        const fillAmount = toolState.points / 5.0;
        this.bar.fillRange = fillAmount;
    }


    UpgradeUiToolUp(finishedToolType: ToolType) {
        if (this.type !== finishedToolType) return;

        const toolState = ToolManager.getInstance().getToolState(this.type);
        this.updateProgressBarFromToolState(toolState);

        log('toolState: ', toolState);

        if (toolState.isUpgraded || toolState.points == 5) {
            toolState.isUpgraded = true;
            this.bgUpTool.active = true;
        }
    }
}