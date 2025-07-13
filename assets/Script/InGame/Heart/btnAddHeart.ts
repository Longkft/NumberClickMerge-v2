import { _decorator, Component, EventTouch, log, Node } from 'cc';
import { BaseTouch } from '../../Base/BaseTouch';
import { Utils } from '../../Utils/Utils';
import { PopupManager } from '../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('btnAddHeart')
export class btnAddHeart extends BaseTouch {

    TouchStart(event: EventTouch): void {
        PopupManager.getInstance().PopupAdsHeat.Show();
    }


}


