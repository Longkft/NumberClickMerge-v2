import { _decorator, Component, EventTouch, log, Node, tween, UIOpacity } from 'cc';
import { BaseTouch } from '../../../Base/BaseTouch';
import { PopupManager } from '../../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('BtnSetting')
export class BtnSetting extends BaseTouch {
    @property({ type: Node })
    settingScene: Node = null;

    TouchStart(event: EventTouch): void {
        // this.settingScene.active = true;

        // let shadow = this.settingScene.getChildByName('shadow');
        // let box = this.settingScene.getChildByName('box');

        // let ActiveBox = () => {
        //     box.active = true;
        // }

        // this.FXShadow(shadow, ActiveBox);

        PopupManager.getInstance().SettingScene.Show();

        log(1)

    }
}


