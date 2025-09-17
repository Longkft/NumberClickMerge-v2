import { _decorator, Component, director, log, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { Utils } from '../../Utils/Utils';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { PopupManager } from '../../Manager/PopupManager';
import { MoneyController } from '../head/Money/MoneyController';
import { PopupNoAds } from './PopupNoAds';
import { FXTween } from '../../FX/FXTween';
// import { FbSdk } from '../../FbSdk';
const { ccclass, property } = _decorator;

@ccclass('AdsHeat')
export class AdsHeat extends Component {
    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    isCheckLose: boolean = false;

    async Show() {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup()); // hiển thị show popup lên đầu tiên (index max trong chuỗi con cùng cha)

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
        director.emit(EventGame.UPDATE_HEARt_UI);

        director.emit(EventGame.UPDATE_COIN_UI, - 200);
    }

    BtnAds() {
        this.Ads(() => {

            this.Hide();
            Utils.getInstance().ResetHeart(5); // reset lại heart là 5
            director.emit(EventGame.UPDATE_HEARt_UI);
        });
    }

    Ads(call: CallableFunction) {
        if (typeof call === 'function') {
            // FbSdk.getInstance().showRewardAd((isAds) => {
            //     if (isAds == true) {
            //         call();
            //     }
            //     else {
            PopupNoAds.getInstance().show();
            FXTween.getInstance().FxTween(PopupNoAds.getInstance().node);
            this.Hide();
            return;
            //     }
            // })
        }
    }

    BtnClose() {
        this.Hide();

        if (!this.isCheckLose) {

        } else {
            PopupManager.getInstance().Lose.ShowFXLose();
        }
    }
}


