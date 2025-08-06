import { _decorator, Component, Layers, log, Node } from 'cc';
import { MoneyUi } from './MoneyUi';
import { EventBus } from '../../../Utils/EventBus';
import { EventGame } from '../../../Enum/EEvent';
import { DataManager } from '../../../Manager/DataManager';
import { BaseSingleton } from '../../../Base/BaseSingleton';
import { Utils } from '../../../Utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('MoneyController')
export class MoneyController extends BaseSingleton<MoneyController> {

    @property({ type: MoneyUi })
    moneyUi: MoneyUi = null;

    @property({ type: Node })
    coinUi: Node = null;


    GoldCurrent: number = 0

    protected async onLoad() {
        await this.LoadGoldCurrent()
        this.updateGold();
        this.RegisterEvent();
    }

    async LoadGoldCurrent() {
        this.GoldCurrent = await DataManager.getInstance().GetGold()
    }

    onDestroy() {
        this.UnRegisterEvent();
    }

    RegisterEvent() {
        EventBus.on(EventGame.UPDATE_COIN_UI, this.UpdateUiCoin, this)
    }

    UnRegisterEvent() {
        EventBus.off(EventGame.UPDATE_COIN_UI, this.UpdateUiCoin)
    }

    UpdateUiCoin(gold: number) {
        // Cộng điểm vào Gold
        const previousGold = this.GoldCurrent;
        const updatedGold = previousGold + gold;
        this.GoldCurrent = updatedGold
        // Gọi hàm tween tăng điểm mượt mà
        this.moneyUi.AnimationMoneyChange(previousGold, updatedGold, this.moneyUi.gold);

        Utils.getInstance().setCamLayer(this.node, 1 << Utils.getInstance().layerMaxIndex);
    }

    public updateGold() {
        let gold = this.GoldCurrent;
        if (gold) {
            this.moneyUi.SetCoin(gold);
            return;
        }

        gold = 0;
        this.moneyUi.SetCoin(gold);
    }


    public SaveGold() {
        DataManager.getInstance().SetGold(this.GoldCurrent)
    }
}


