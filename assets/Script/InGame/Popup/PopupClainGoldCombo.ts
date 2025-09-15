import { _decorator, Camera, Component, director, find, Label, Layers, Node, Vec2, Vec3 } from 'cc';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { FXShadow } from '../../FX/FXShadow';
import { AutoComponent } from '../../Base/AutoComponent';
import { PopupManager } from '../../Manager/PopupManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { InGameUIManager } from '../InGameUIManager';
import { FXTween } from '../../FX/FXTween';
// import { FbSdk } from '../../FbSdk';
const { ccclass, property } = _decorator;

@ccclass('PopupClainGoldCombo')
export class PopupClainGoldCombo extends AutoComponent {

    @property({ type: Camera })
    camLayer: Camera = null;

    @property({ type: Label })
    textCombo: Label = null;

    @property({ type: Label })
    valueGoldPlus: Label = null;

    @property({ type: Node })
    effNode: Node = null;

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    gold: number;

    LoadCamera() {
        if (this.camLayer) return;
        this.camLayer = PopupManager.getInstance().cameraItem.getComponent(Camera);
    }

    protected LoadComponent(): void {
        this.LoadCamera();
    }

    async Show(gold: number, combo: number, call: CallableFunction) {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        const box = this.node.getChildByName('box');

        Utils.getInstance().setCamLayer(MoneyController.getInstance().node, 1 << Utils.getInstance().layerMaxIndex);

        this.SetValueGoldUI(gold, combo);

        await this.shadow.ShowFxShadow();
        await this.shadow.ShowFxBox(box);

        this.effNode.active = true;

        if (typeof call === 'function') {
            call();
        }
    }

    isNoAds: boolean = false;
    async Hide() { // claim
        this.ads(async () => {

            // if (!this.isNoAds) {

            //     let errAds = InGameUIManager.getInstance().errAds;
            //     errAds.active = true;

            //     FXTween.getInstance().FxTween(errAds)

            //     return;
            // }

            const box = this.node.getChildByName('box');

            director.emit(EventGame.UPDATE_COIN_UI, this.gold);

            Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.DEFAULT);

            await this.shadow.HideFxBox(box);
            await this.shadow.HideFXShadow();
        });
    }

    SetValueGoldUI(gold: number, Combo: number = 3) {
        this.textCombo.string = `X${Combo}`;
        this.valueGoldPlus.string = `+ ${gold}`;
    }

    ads(call: CallableFunction) {
        if (typeof call === 'function') {
            // FbSdk.getInstance().showInterstitial(call, call)
            call();
        }
    }
}


