import { _decorator, Component, instantiate, Node } from 'cc';
import { PopupUnlockMax } from '../InGame/Popup/PopupUnlockMax';
import { PrefabManager } from './PrefabManager';
import { BaseSingleton } from '../Base/BaseSingleton';
import { PopupUnlockMin } from '../InGame/Popup/PopupUnlockMin';
import { ClaimGold } from '../InGame/Popup/ClaimGold';
import { PopupClainGoldCombo } from '../InGame/Popup/PopupClainGoldCombo';
const { ccclass, property } = _decorator;

@ccclass('PopupManager')
export class PopupManager extends BaseSingleton<PopupManager> {


    private _popupUnlockMax: PopupUnlockMax = null
    private _popupUnlockMin: PopupUnlockMin = null
    private _popupGold: ClaimGold = null
    private _popupClainGoldCombo: PopupClainGoldCombo = null

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
}


