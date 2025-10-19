import { _decorator, CCInteger, Color, Component, director, Enum, Label, log, Node, Sprite, SpriteFrame } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
import { ToolManager, ToolType } from '../../Manager/ToolManager';
import { ToolProgress } from './ToolProgress';
import { InGameLogicManager } from '../InGameLogicManager';
import { Config } from '../../Config';

const { ccclass, property } = _decorator;

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

    @property({ type: Label })
    red: Label = null;

    @property(CCInteger)
    coin: number = 0;

    protected start(): void {
        this.txtCoin.string = this.coin.toString();
        this.RegisterEvent();
        this.UpgradeUiToolUp(this.type); // cập nhật ui tool up
    }

    protected onDestroy(): void {
        this.DestroyEvent();
    }

    RegisterEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.OnClick, this);
        director.on(EventGame.TOOL_FINISHED, this.onToolFinished, this);
        director.on(EventGame.TOOL_UPGRADEUITOOLUP, this.UpgradeUiToolUp, this);
        director.on(EventGame.TOOL_DEACTIVATED, this.onToolDeactivated, this);
    }

    DestroyEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.OnClick, this);
        director.off(EventGame.TOOL_FINISHED, this.onToolFinished);
        director.off(EventGame.TOOL_UPGRADEUITOOLUP, this.UpgradeUiToolUp);
        director.off(EventGame.TOOL_DEACTIVATED, this.onToolDeactivated, this);
    }

    protected lateUpdate(dt: number): void {
        let coinGame = MoneyController.getInstance().GoldCurrent;
        if (coinGame < this.coin) {
            this.red.color = Color.RED;
            this.DestroyEvent();
        } else {
            this.red.color = Color.WHITE;
            this.RegisterEvent();
        }
    }

    /**
     * Hàm xử lý click duy nhất cho tất cả các tool
     */
    private OnClick() {
        console.log(ToolManager.getInstance().isClick, InGameLogicManager.getInstance().IsProcessing)
        if (InGameLogicManager.getInstance().isRunning) {
            return;
        }

        if (InGameLogicManager.getInstance().IsProcessing) {
            return;
        }

        // Nếu đang bấm tool khác rồi thì không cho bấm nữa
        if (ToolManager.getInstance().isClick) {
            return;
        }

        if (!this.CheckCoinUseToolGame()) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }
        if (this.type == ToolType.REMOVE_MIN) {
            InGameLogicManager.getInstance().isRunning = true
        }

        ToolManager.getInstance().isClick = true;

        InGameLogicManager.getInstance().consecutiveMerges = 0; // reset combo

        InGameLogicManager.getInstance().resetHintTimer(); // reset hint time

        // Hiển thị hiệu ứng và BÁO CHO TOOLMANAGER
        this.ShowFxShadow();

        director.emit(EventGame.UPDATE_COIN_UI, -this.coin);

        ToolManager.getInstance().activateTool(this.type);
    }

    /**
     * Được gọi khi tool thực thi xong
     */
    private async onToolFinished(finishedToolType: ToolType) {
        // KIỂM TRA: nếu tool vừa hoàn thành không phải là tool này, thì bỏ qua
        if (this.type !== finishedToolType) {
            return;
        }

        // Nếu đúng là tool này, thì mới ẩn hiệu ứng
        await this.HideFxShadow();
    }

    private CheckCoinUseToolGame(): boolean {
        let coinData = MoneyController.getInstance().GoldCurrent;
        return coinData >= this.coin;
    }

    private async ShowFxShadow() {
        const shadowCpn = this.shadow.getComponent(FXShadow);

        const isUpgrade = this.CheckIsToolUpgrade();

        this.ShowUITitleHint(isUpgrade);

        await shadowCpn.ShowFxShadow();
        await shadowCpn.ShowFxGuide(this.guide.parent);
        this.guide.active = true;
    }

    ShowUITitleHint(isUpgrade: boolean) {
        const titleDontUpgrade = this.guide.getChildByName('titleHint');
        const titleUpgrade = this.guide.getChildByName('titleHint-001');

        titleDontUpgrade.active = !isUpgrade;
        titleUpgrade.active = isUpgrade;
    }

    private async HideFxShadow() {
        const shadowCpn = this.shadow.getComponent(FXShadow);
        await shadowCpn.HideFxGuide(this.guide.parent);
        this.guide.active = true;
        await shadowCpn.HideFXShadow();

        // ToolManager.getInstance().isClick = false;
    }

    private async onToolDeactivated() {
        // Kiểm tra xem tool bị hủy có phải là tool này không
        log(11111)
        // Nếu đúng, GỌI HÀM HideFxShadow()
        // await this.awaitTime(0.5);
        await this.HideFxShadow();
    }

    async awaitTime(time: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, time * 1000)
        })
    }

    private updateProgressBarFromToolState(toolState: ToolProgress | null) {
        if (!this.bar || !toolState) {
            return;
        }
        const point = Config.numberPointUpLv;
        const fillAmount = toolState.points / point;
        this.bar.fillRange = fillAmount;
    }


    UpgradeUiToolUp(finishedToolType: ToolType) {
        if (this.type !== finishedToolType) return;
        const toolState = ToolManager.getInstance().getToolState(this.type);
        this.updateProgressBarFromToolState(toolState);
        const point = Config.numberPointUpLv;
        if (toolState.isUpgraded || toolState.points == point) {
            toolState.isUpgraded = true;
            this.bgUpTool.active = true;
        }
    }

    CheckIsToolUpgrade() {
        // 1. Gọi hàm getToolState() với type của chính tool này
        const toolState: ToolProgress | null = ToolManager.getInstance().getToolState(this.type);

        // 2. Kiểm tra kết quả trả về
        if (toolState && toolState.isUpgraded) {
            return true;
        }

        return false;
    }
}