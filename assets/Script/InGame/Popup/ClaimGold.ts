import { _decorator, Camera, Component, director, find, Label, Layers, log, Node, tween, Vec2, Vec3 } from 'cc';
import { GridManager } from '../GridManager';
import { InGameLogicManager } from '../InGameLogicManager';
import { FXShadow } from '../../FX/FXShadow';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { AutoComponent } from '../../Base/AutoComponent';
import { PrefabManager } from '../../Manager/PrefabManager';
import { PopupManager } from '../../Manager/PopupManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
// import { FbSdk } from '../../FbSdk';
const { ccclass, property } = _decorator;

@ccclass('ClaimGold')
export class ClaimGold extends AutoComponent {

    @property({ type: Camera })
    camLayer: Camera = null;

    @property({ type: Label })
    valueGoldPlus: Label = null;

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    effGold: Node = null;

    @property(Node)
    coinIcon: Node = null

    gold: number;

    LoadCamera() {
        if (this.camLayer) return;
        this.camLayer = PopupManager.getInstance().cameraItem.getComponent(Camera);
    }

    LoadEffGold() {
        if (this.effGold) return;
        this.effGold = find('Canvas/IngameUIManager/effGold');
    }

    protected LoadComponent(): void {
        this.LoadCamera();
        // this.LoadEffGold();
    }

    Show(gold: number) {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        this.node.children.forEach(element => {
            element.active = false;
        });

        Utils.getInstance().setCamLayer(MoneyController.getInstance().node, 1 << Utils.getInstance().layerMaxIndex);

        this.SetValueGoldUI(gold);

        let time = this.shadow.time;
        this.ShowFx();

        this.scheduleOnce(() => {
            this.node.children.forEach(element => {
                element.active = true;
            });

            this.coinIcon.setScale(0, 0, 0)
            tween(this.coinIcon).to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: "backOut" }).start()
            this.scheduleOnce(() => {
                this.Hide();
            }, 2);
        }, time)
    }

    Hide() {
        this.ads(() => {
            director.emit(EventGame.UPDATE_COIN_UI, this.gold);

            Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.DEFAULT);

            let time = this.shadow.time;
            this.HideFx();

            this.scheduleOnce(() => {
                InGameLogicManager.getInstance().UpdateAllFrames();

                this.node.children.forEach(element => {
                    element.active = false;
                });
            }, time)
        })
    }

    ShowFx() {
        this.shadow.ShowFxShadow();
    }

    HideFx() {
        this.shadow.HideFXShadow();
    }

    SetValueGoldUI(gold: number) {
        this.valueGoldPlus.string = gold.toString();
    }

    ads(call: CallableFunction) {
        if (typeof call === 'function') {
            // FbSdk.getInstance().showInterstitial(call, call)
            call();
        }
    }


}


