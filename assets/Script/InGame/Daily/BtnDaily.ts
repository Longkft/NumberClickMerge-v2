import { _decorator, Component, EventTouch, Node } from 'cc';
import { BaseTouch } from '../../Base/BaseTouch';
import { PopupManager } from '../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('BtnDaily')
export class BtnDaily extends BaseTouch {

    TouchStart(event: EventTouch): void {
        PopupManager.getInstance().PopupDailyBonus.Show();
    }
}


