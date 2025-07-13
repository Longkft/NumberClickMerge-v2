import { _decorator, Component, Label, Layers, Node } from 'cc';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { FXShadow } from '../../FX/FXShadow';
const { ccclass, property } = _decorator;

@ccclass('PopupAdsGold')
export class PopupAdsGold extends Component {

    @property({ type: Label })
    valueGoldPlus: Label = null;

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    gold: number;

    async Show(gold: number = 100) {
        const box = this.node.getChildByName('box');

        Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.PROFILER);

        this.SetValueGoldUI(gold);

        await this.shadow.ShowFxShadow();
        await this.shadow.ShowFxBox(box);
    }

    async Hide() {
        this.ads(async () => {
            const box = this.node.getChildByName('box');

            MoneyController.getInstance().UpdateUiCoin(this.gold);

            Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.DEFAULT);

            await this.shadow.HideFxBox(box);
            await this.shadow.HideFXShadow();
        });
    }

    SetValueGoldUI(gold: number) {
        this.valueGoldPlus.string = `+ ${gold}`;
    }

    ads(call: CallableFunction) {
        if (typeof call === 'function') {
            call();
        }
    }
}


