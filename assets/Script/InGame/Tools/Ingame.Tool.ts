// FILE: src/UI/Ingame_Tool.ts

import { _decorator, CCInteger, Component, Enum, Label, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
import { ToolManager, ToolType } from '../../Manager/ToolManager';

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

    @property(CCInteger)
    coin: number = 0;

    protected start(): void {
        this.txtCoin.string = this.coin.toString();
        this.node.on(Node.EventType.TOUCH_START, this.OnClick, this);
        EventBus.on(EventGame.TOOL_FINISHED, this.onToolFinished, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.OnClick, this);
        EventBus.off(EventGame.TOOL_FINISHED, this.onToolFinished);
    }

    /**
     * Hàm xử lý click duy nhất cho tất cả các tool
     */
    private OnClick() {
        // 1. Kiểm tra tiền
        if (!this.CheckCoinUseToolGame()) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }

        // 2. Trừ tiền (ToolManager sẽ quyết định tool có được dùng hay không)
        // EventBus.emit(EventGame.UPDATE_COIN_UI, -this.coin); // Tạm thời có thể để ToolManager xử lý việc này sau khi dùng thành công

        // 3. Hiển thị hiệu ứng và BÁO CHO TOOLMANAGER
        this.ShowFxShadow();
        ToolManager.getInstance().activateTool(this.type);
    }

    /**
     * Được gọi khi tool thực thi xong
     */
    private onToolFinished() {
        // Chỉ trừ tiền khi tool dùng thành công
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
        this.guide.active = true; // Có vẻ logic này cần xem lại, nhưng giữ nguyên
        await shadowCpn.HideFXShadow();
    }
}