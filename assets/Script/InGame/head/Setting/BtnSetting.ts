import { _decorator, Component, EventTouch, log, Node, tween, UIOpacity } from 'cc';
import { BaseTouch } from '../../../Base/BaseTouch';
import { PopupManager } from '../../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('BtnSetting')
export class BtnSetting extends BaseTouch {

    TouchStart(event: EventTouch): void {
        PopupManager.getInstance().SettingScene.Show();
    }
}


