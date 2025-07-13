import { _decorator, Camera, Component, find, instantiate, Node } from 'cc';
import { PopupUnlockMax } from '../InGame/Popup/PopupUnlockMax';
import { PrefabManager } from './PrefabManager';
import { BaseSingleton } from '../Base/BaseSingleton';
import { PopupUnlockMin } from '../InGame/Popup/PopupUnlockMin';
import { ClaimGold } from '../InGame/Popup/ClaimGold';
import { PopupClainGoldCombo } from '../InGame/Popup/PopupClainGoldCombo';
import { OutOfMove } from '../InGame/Popup/OutOfMove';
import { SettingScene } from '../InGame/head/Setting/SettingScene';
import { Lose } from '../InGame/Lose/Lose';
import { PopupAdsGold } from '../InGame/Popup/PopupAdsGold';
import { AdsHeat } from '../InGame/Popup/AdsHeat';
const { ccclass, property } = _decorator;

@ccclass('PopupManager')
export class PopupManager extends BaseSingleton<PopupManager> {


    private _cameraItem: Camera = null
    private _popupUnlockMax: PopupUnlockMax = null
    private _popupUnlockMin: PopupUnlockMin = null
    private _popupGold: ClaimGold = null
    private _popupClainGoldCombo: PopupClainGoldCombo = null
    private _popupOutOfMove: OutOfMove = null
    private _popupSettingScene: SettingScene = null
    private _popupLose: Lose = null
    private _popupAdsGold: PopupAdsGold = null
    private _popupAdsheat: AdsHeat = null

    get popupUnlockMax() {
        if (this._popupUnlockMax == null) {
            this._popupUnlockMax = instantiate(PrefabManager.getInstance().popupUnlockMax).getComponent(PopupUnlockMax)
            this.node.addChild(this._popupUnlockMax.node)
        }
        return this._popupUnlockMax
    }

    ShowPopupUnlockMax() {
        this.popupUnlockMax.show()
    }

    get popupUnlockMin() {
        if (this._popupUnlockMin == null) {
            this._popupUnlockMin = instantiate(PrefabManager.getInstance().popupUnlockMin).getComponent(PopupUnlockMin)
            this.node.addChild(this._popupUnlockMin.node)
        }
        return this._popupUnlockMin
    }

    ShowPopupUnlockMin() {
        this.popupUnlockMin.show()
    }

    get PopupGold() {
        if (this._popupGold == null) {
            this._popupGold = instantiate(PrefabManager.getInstance().popupGold).getComponent(ClaimGold);
            this.node.addChild(this._popupGold.node)
        }
        return this._popupGold
    }

    ShowPopupGold(gold: number) {
        this.PopupGold.Show(gold);
    }

    get PopupClainGoldCombo() {
        if (this._popupClainGoldCombo == null) {
            this._popupClainGoldCombo = instantiate(PrefabManager.getInstance().popupClainGoldCombo).getComponent(PopupClainGoldCombo);
            this.node.addChild(this._popupClainGoldCombo.node)
        }
        return this._popupClainGoldCombo
    }

    get cameraItem() {
        if (this._cameraItem == null) {
            this._cameraItem = instantiate(PrefabManager.getInstance().cameraItem).getComponent(Camera);
            find('Canvas').addChild(this._cameraItem.node)
        }
        return this._cameraItem
    }

    get OutOfMove() {
        if (this._popupOutOfMove == null) {
            this._popupOutOfMove = instantiate(PrefabManager.getInstance().popupOutOfMove).getComponent(OutOfMove);
            this.node.addChild(this._popupOutOfMove.node)
        }
        return this._popupOutOfMove
    }

    get SettingScene() {
        if (this._popupSettingScene == null) {
            this._popupSettingScene = instantiate(PrefabManager.getInstance().popupSettingScene).getComponent(SettingScene);
            this.node.addChild(this._popupSettingScene.node)
        }
        return this._popupSettingScene
    }

    get Lose() {
        if (this._popupLose == null) {
            this._popupLose = instantiate(PrefabManager.getInstance().popupLose).getComponent(Lose);
            this.node.addChild(this._popupLose.node)
        }
        return this._popupLose
    }

    get PopupAdsGold() {
        if (this._popupAdsGold == null) {
            this._popupAdsGold = instantiate(PrefabManager.getInstance().popupAdsGold).getComponent(PopupAdsGold);
            this.node.addChild(this._popupAdsGold.node)
        }
        return this._popupAdsGold
    }

    get PopupAdsHeat() {
        if (this._popupAdsheat == null) {
            this._popupAdsheat = instantiate(PrefabManager.getInstance().popupAdsHeat).getComponent(AdsHeat);
            this.node.addChild(this._popupAdsheat.node)
        }
        return this._popupAdsheat
    }
}


