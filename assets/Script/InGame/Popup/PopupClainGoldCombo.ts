import { _decorator, Camera, Component, Label, Layers, Node, Vec2, Vec3 } from 'cc';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { FXShadow } from '../../FX/FXShadow';
const { ccclass, property } = _decorator;

@ccclass('PopupClainGoldCombo')
export class PopupClainGoldCombo extends Component {

    @property({ type: Camera })
    camLayer: Camera = null;

    @property({ type: Label })
    textCombo: Label = null;

    @property({ type: Label })
    valueGoldPlus: Label = null;

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    gold: number;

    async Show(gold: number, combo: number, call: CallableFunction) {
        const box = this.node.getChildByName('box');

        Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.PROFILER);

        this.SetValueGoldUI(gold, combo);

        await this.shadow.ShowFxShadow();
        await this.shadow.ShowFxBox(box);

        if (call) {
            call();
        }
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

    SetValueGoldUI(gold: number, Combo: number = 3) {
        this.textCombo.string = `Combo x${Combo}`;
        this.valueGoldPlus.string = `+ ${gold}`;
    }

    ads(call: CallableFunction) {
        if (call) {
            call();
        }
    }
}


