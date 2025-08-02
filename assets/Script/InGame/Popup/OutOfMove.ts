import { _decorator, Component, log, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { Utils } from '../../Utils/Utils';
import { InGameUIManager } from '../InGameUIManager';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
const { ccclass, property } = _decorator;

@ccclass('OutOfMove')
export class OutOfMove extends Component {

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    @property({ type: Node })
    btnGold: Node = null;

    @property({ type: Node })
    btnAds: Node = null;

    async Show() {
        let gold = MoneyController.getInstance().GoldCurrent;
        if (gold < 200) {
            this.btnGold.active = false;
            this.btnAds.active = true;
        } else {
            this.btnGold.active = true;
            this.btnAds.active = false;
        }

        await this.shadow.ShowFxShadow();

        await this.shadow.ShowFxBox(this.box);
    }

    async Hide() {
        await this.shadow.HideFxBox(this.box);

        await this.shadow.HideFXShadow();


    }

    async BtnUseGold() {
        this.Hide();

        Utils.getInstance().UpdateHeart(5); // reset lại heart là 5
        EventBus.emit(EventGame.UPDATE_HEARt_UI);

        EventBus.emit(EventGame.UPDATE_COIN_UI, - 200);
    }

    BtnAds() {
        this.Ads(() => {
            this.Hide();

            Utils.getInstance().UpdateHeart(5); // reset lại heart là 5
            EventBus.emit(EventGame.UPDATE_HEARt_UI);
        });
    }

    Ads(call: CallableFunction) {
        if (typeof call === 'function') {
            call();
        }
    }

    BtnClose() {
        this.Hide();
        PopupManager.getInstance().Lose.ShowFXLose();
    }
}


