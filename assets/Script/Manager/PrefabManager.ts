import { _decorator, Camera, Component, Node, Prefab } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('PrefabManager')
export class PrefabManager extends BaseSingleton<PrefabManager> {
    @property({ type: Prefab, group: { name: "INGAME" } })
    cellPrefab: Prefab = null

    @property({ type: Prefab, group: { name: "INGAME" } })
    cellContainPrefab: Prefab = null

    @property({ type: Prefab, group: { name: "INGAME" } })
    cameraItem: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupUnlockMax: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupUnlockMin: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupGold: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupClainGoldCombo: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupOutOfMove: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupSettingScene: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupLose: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupAdsGold: Prefab = null

    @property({ type: Prefab, group: { name: "POPUP" } })
    popupAdsHeat: Prefab = null

}


