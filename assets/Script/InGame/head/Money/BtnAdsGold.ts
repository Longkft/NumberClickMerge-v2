import { _decorator, Component, EventTouch, Node } from 'cc';
import { BaseTouch } from '../../../Base/BaseTouch';
import { PopupManager } from '../../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('BtnAdsGold')
export class BtnAdsGold extends BaseTouch {

    TouchStart(event: EventTouch): void {
        let gold = 1 * 100;

        PopupManager.getInstance().PopupAdsGold.Show(gold);
        PopupManager.getInstance().PopupAdsGold.gold = gold;

        this.UnRegisterButton();
    }
}


