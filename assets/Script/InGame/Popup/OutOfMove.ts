import { _decorator, Component, director, log, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { Utils } from '../../Utils/Utils';
import { InGameUIManager } from '../InGameUIManager';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
import { FXTween } from '../../FX/FXTween';
import { PopupNoAds } from './PopupNoAds';
// import { FbSdk } from '../../FbSdk';
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

    Show() {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        let gold = MoneyController.getInstance().GoldCurrent;
        if (gold < 200) {
            this.btnGold.active = false;
            this.btnAds.active = true;
        } else {
            this.btnGold.active = true;
            this.btnAds.active = false;
        }

        let time = this.shadow.time;
        this.shadow.ShowFxShadow();

        this.scheduleOnce(() => {
            this.shadow.ShowFxBox(this.box);
        }, time)
    }

    Hide() {
        let time = this.shadow.time;
        this.shadow.HideFxBox(this.box);

        this.scheduleOnce(() => {
            this.shadow.HideFXShadow();
        }, time)

    }

    BtnUseGold() {
        this.Hide();

        Utils.getInstance().UpdateHeart(5); // reset lại heart là 5
        director.emit(EventGame.UPDATE_HEARt_UI);

        director.emit(EventGame.UPDATE_COIN_UI, - 200);
    }

    isNoAds: boolean = false;
    BtnAds() {
        this.Ads(() => {
            this.Hide();

            Utils.getInstance().UpdateHeart(5); // reset lại heart là 5
            director.emit(EventGame.UPDATE_HEARt_UI);
        });
    }

    Ads(call: CallableFunction) {
        if (typeof call === 'function') {
            // call();

            // FbSdk.getInstance().showRewardAd((isAds) => {
            //     if (isAds == true) {
            //         call();
            //     }
            //     else {
            this.Hide();
            PopupNoAds.getInstance().show();
            FXTween.getInstance().FxTween(PopupNoAds.getInstance().node);
            return;
            //     }
            // })
        }
    }

    BtnClose() {
        this.Hide();
        PopupManager.getInstance().Lose.ShowFXLose();
    }
}


