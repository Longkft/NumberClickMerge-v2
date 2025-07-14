import { _decorator, CCInteger, Component, Enum, Label, log, Node } from 'cc';
import { InGameLogicManager } from '../InGameLogicManager';
import { FXShadow } from '../../FX/FXShadow';
import { ECLICK_MODE } from '../../Enum/ECell';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { DataManager } from '../../Manager/DataManager';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
const { ccclass, property } = _decorator;

export enum TYPE_TOOL {
    HAMMER = 0,
    SWAP = 1,
    DESTROY = 2,
    UPGRADE = 3
}

Enum(TYPE_TOOL)

@ccclass('Ingame_Tool')
export class Ingame_Tool extends Component {
    @property({ type: TYPE_TOOL })
    type: TYPE_TOOL = TYPE_TOOL.HAMMER

    @property(Label)
    txtCoin: Label = null

    @property({ type: Node })
    shadow: Node = null;

    @property({ type: Node })
    guide: Node = null;

    @property(CCInteger)
    coin: number = 0;

    isClick: boolean = false;

    private firstSwapCell: { row: number, col: number } = null;

    protected start(): void {
        this.txtCoin.string = this.coin.toString();

        this.RegisterEvent();

        EventBus.on(EventGame.TOOL_FINISHED, this.HideFxShadow, this);
    }

    onDestroy() {
        EventBus.off(EventGame.TOOL_FINISHED, this.HideFxShadow);
    }

    RecordTool: Record<TYPE_TOOL, CallableFunction> = {
        [TYPE_TOOL.HAMMER]: this.OnHammer.bind(this),
        [TYPE_TOOL.SWAP]: this.OnSwap.bind(this),
        [TYPE_TOOL.DESTROY]: this.OnDestroyCell.bind(this),
        [TYPE_TOOL.UPGRADE]: this.OnUpGrade.bind(this),
    }

    RegisterEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.OnClick, this);
    }

    DestriyEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.OnClick, this);
    }

    OnClick() {
        this.RecordTool[this.type]()
    }


    //#region tool hammer
    async OnHammer() {
        let checkGoldUse = this.CheckCoinUseToolGame();

        if (!checkGoldUse) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }

        EventBus.emit(EventGame.UPDATE_COIN_UI, - this.coin);

        this.SetEclickTools(ECLICK_MODE.HAMMER);

        await this.ShowFxShadow();
    }

    //#region tool swap
    async OnSwap() {
        let checkGoldUse = this.CheckCoinUseToolGame();

        if (!checkGoldUse) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }

        EventBus.emit(EventGame.UPDATE_COIN_UI, - this.coin);

        this.ShowFxShadow();

        this.firstSwapCell = null;

        this.SetEclickTools(ECLICK_MODE.SWAP);

        // Gắn callback chọn ô
        InGameLogicManager.getInstance().EnableSwapMode(this.OnCellSelectedForSwap.bind(this));
    }

    private async OnCellSelectedForSwap(row: number, col: number) {
        if (!this.firstSwapCell) {
            this.firstSwapCell = { row, col };
            return;
        }

        const second = { row, col };
        const first = this.firstSwapCell;
        this.firstSwapCell = null;

        const cellA = InGameLogicManager.getInstance().cells[first.row][first.col];
        const cellB = InGameLogicManager.getInstance().cells[second.row][second.col];

        const isAdjacent = Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1;
        if (!isAdjacent) {
            console.warn("Hai ô không kề nhau.");

            if (cellA) cellA.cellUI.ShowEff(false);
            if (cellB) cellB.cellUI.ShowEff(false);

            return;
        }

        // Thực hiện swap
        await InGameLogicManager.getInstance().HandleSwap(first, second);

        // Tắt hiệu ứng sau khi swap xong
        if (cellA) cellA.cellUI.ShowEff(false);
        if (cellB) cellB.cellUI.ShowEff(false);

        // Tắt hiệu ứng và chế độ swap
        await this.HideFxShadow();
        InGameLogicManager.getInstance().EnableSwapMode(null);
    }


    //#region destroy cell
    async OnDestroyCell() {
        let checkGoldUse = this.CheckCoinUseToolGame();

        if (!checkGoldUse) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }

        EventBus.emit(EventGame.UPDATE_COIN_UI, - this.coin);

        await this.ShowFxShadow();

        InGameLogicManager.getInstance().removeAllMinCellsTools(); // xoá nhỏ nhất
    }

    //#region up grade
    async OnUpGrade() {
        let checkGoldUse = this.CheckCoinUseToolGame();

        if (!checkGoldUse) {
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }

        EventBus.emit(EventGame.UPDATE_COIN_UI, - this.coin);

        this.SetEclickTools(ECLICK_MODE.UPGRADE);

        await this.ShowFxShadow();
    }

    CheckCoinUseToolGame() {
        let coinData = DataManager.getInstance().Gold;
        if (coinData < this.coin) {

            return false;
        }
        return true;
    }

    async ShowFxShadow() { // hiệu ứng bóng và chặn event
        const shadowCpn = this.shadow.getComponent(FXShadow);

        await shadowCpn.ShowFxShadow();

        await shadowCpn.ShowFxGuide(this.guide.parent);
        this.guide.active = true;
    }

    async HideFxShadow() { // tắt hiệu ứng bóng và chặn event
        const shadowCpn = this.shadow.getComponent(FXShadow);

        await shadowCpn.HideFxGuide(this.guide.parent);
        this.guide.active = true;

        await shadowCpn.HideFXShadow();

        this.SetEclickNoMal(); // Đặt lại trạng thái nomal không tools
    }

    SetEclickTools(elickMode: ECLICK_MODE) {
        let CellCollection = InGameLogicManager.getInstance().cellCollection;
        CellCollection.forEach(element => {
            element.clickMode = elickMode;
        });
    }

    SetEclickNoMal() {
        let CellCollection = InGameLogicManager.getInstance().cellCollection;
        CellCollection.forEach(element => {
            element.clickMode = ECLICK_MODE.NORMAL;
        });
    }
}


