import { _decorator, Camera, Component, find, Label, Layers, log, Node } from 'cc';
import { GridManager } from '../GridManager';
import { InGameLogicManager } from '../InGameLogicManager';
import { FXShadow } from '../../FX/FXShadow';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { AutoComponent } from '../../Base/AutoComponent';
import { PrefabManager } from '../../Manager/PrefabManager';
import { PopupManager } from '../../Manager/PopupManager';
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
        this.LoadEffGold();
    }

    async Show(gold: number) {
        this.node.children.forEach(element => {
            element.active = false;
        });

        Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.PROFILER);

        this.SetValueGoldUI(gold);

        await this.ShowFx();

        this.node.children.forEach(element => {
            element.active = true;
        });
    }

    async Hide() {
        this.ads(async () => {
            MoneyController.getInstance().UpdateUiCoin(this.gold);

            Utils.getInstance().setCamLayer(MoneyController.getInstance().node, Layers.Enum.DEFAULT);

            await this.HideFx();

            GridManager.getInstance().CheckUpDateMinCurrent();
            InGameLogicManager.getInstance().UpdateAllFrames();

            this.node.children.forEach(element => {
                element.active = true;
            });
        })
    }

    async ShowFx() {
        await this.shadow.ShowFxShadow();
    }

    async HideFx() {
        this.shadow.HideFXShadow();
    }

    SetValueGoldUI(gold: number) {
        this.valueGoldPlus.string = gold.toString();
    }

    ads(call: CallableFunction) {
        if (typeof call === 'function') {
            call();
        }
    }
}


