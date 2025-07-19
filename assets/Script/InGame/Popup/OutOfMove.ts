import { _decorator, Component, log, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { Utils } from '../../Utils/Utils';
import { InGameUIManager } from '../InGameUIManager';
import { PopupManager } from '../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('OutOfMove')
export class OutOfMove extends Component {

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    async Show() {
        await this.shadow.ShowFxShadow();

        await this.shadow.ShowFxBox(this.box);
    }

    async Hide() {
        await this.shadow.HideFxBox(this.box);

        await this.shadow.HideFXShadow();


    }

    async BtnUseGold() {
        let gold = await DataManager.getInstance().GetGold();
        log('gold: ', gold)
        if (gold === null) return;
        log(1)
        let goldAfter = Number(gold) - 200;
        if (goldAfter < 0) {
            log(2)
            this.Hide();
            PopupManager.getInstance().PopupAdsGold.Show();
            return;
        }
        log(3)
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


