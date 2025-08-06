import { _decorator, Component, log, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { Utils } from '../../Utils/Utils';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
import { InGameLogicManager } from '../InGameLogicManager';
import { InGameUIManager } from '../InGameUIManager';
import { FXTween } from '../../FX/FXTween';
import { PopupNoAds } from './PopupNoAds';
const { ccclass, property } = _decorator;

@ccclass('AdsHeat')
export class AdsHeat extends Component {
    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    isCheckLose: boolean = false;

    async Show() {
        await this.shadow.ShowFxShadow();

        await this.shadow.ShowFxBox(this.box);
    }

    async Hide() {
        await this.shadow.HideFxBox(this.box);

        await this.shadow.HideFXShadow();


    }

    BtnUseGold() {
        let gold = MoneyController.getInstance().GoldCurrent;
        if (!gold) return;
        let goldAfter = gold - 200;
        if (goldAfter < 0) return;
        this.Hide();

        Utils.getInstance().UpdateHeart(5); // reset lại heart là 5
        EventBus.emit(EventGame.UPDATE_HEARt_UI);

        EventBus.emit(EventGame.UPDATE_COIN_UI, - 200);
    }

    isNoAds: boolean = false;
    BtnAds() {
        this.Ads(() => {
            if (!this.isNoAds) {

                this.Hide();

                PopupNoAds.getInstance().show();

                FXTween.getInstance().FxTween(PopupNoAds.getInstance().node);

                return;
            }

            this.Hide();

            Utils.getInstance().ResetHeart(5); // reset lại heart là 5
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

        if (!this.isCheckLose) {

        } else {
            log('lose');
            PopupManager.getInstance().Lose.ShowFXLose();
        }
    }
}


