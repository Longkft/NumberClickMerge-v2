import { _decorator, Component, director, Label, Layers, Node } from 'cc';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { FXShadow } from '../../FX/FXShadow';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { InGameUIManager } from '../InGameUIManager';
import { FXTween } from '../../FX/FXTween';
import { PopupNoAds } from './PopupNoAds';
// import { FbSdk } from '../../FbSdk';
const { ccclass, property } = _decorator;

@ccclass('PopupAdsGold')
export class PopupAdsGold extends Component {

    @property({ type: Label })
    valueGoldPlus: Label = null;

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    gold: number;

    Show(gold: number = 100) {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        const box = this.node.getChildByName('box');

        Utils.getInstance().setCamLayer(MoneyController.getInstance().node, 1 << Utils.getInstance().layerMaxIndex);

        this.SetValueGoldUI(gold);

        let time = this.shadow.time;
        this.shadow.ShowFxShadow();
        this.scheduleOnce(() => {
            this.shadow.ShowFxBox(box);
        }, time)
    }

    isNoAds: boolean = false;
    Hide() {
        this.ads(() => {

            // if (!this.isNoAds) {

            //     this.hidePopup();

            //     PopupNoAds.getInstance().show();

            //     FXTween.getInstance().FxTween(PopupNoAds.getInstance().node);

            //     return;
            // }

            this.gold = 1 * 100;
            director.emit(EventGame.UPDATE_COIN_UI, this.gold);

            Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.DEFAULT);

            this.hidePopup();
        });

        MoneyController.getInstance().RegisEventAddCoin();
    }

    SetValueGoldUI(gold: number) {
        this.valueGoldPlus.string = `${gold}`;
    }

    ads(call: CallableFunction) {
        if (typeof call === 'function') {
            // FbSdk.getInstance().showRewardAd((isAds) => {
            //     if (isAds == true) {
            //         call();
            //     }
            //     else {
            this.hidePopup(() => {
                PopupNoAds.getInstance().show();
                FXTween.getInstance().FxTween(PopupNoAds.getInstance().node);
            });
            return;
            //     }
            // })

        }
    }

    hidePopup(call?: CallableFunction) {
        const box = this.node.getChildByName('box');
        let time = this.shadow.time;
        this.shadow.HideFxBox(box);
        this.scheduleOnce(() => {
            this.shadow.HideFXShadow();
            if (call) {
                this.scheduleOnce(() => {
                    call;
                }, time)
            }
        }, time)
    }
}


