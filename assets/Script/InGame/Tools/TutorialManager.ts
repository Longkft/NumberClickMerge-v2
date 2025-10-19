import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
import { BaseSingleton } from '../../Base/BaseSingleton';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { TypewriterEffect } from '../../FX/TypewriterEffect';
import { PopupManager } from '../../Manager/PopupManager';
import { LanguageManager } from '../../i18n/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('TutorialManager')
export class TutorialManager extends Component {

    @property(Node)
    up: Node = null;

    @property(Node)
    down: Node = null;

    @property(Node)
    ttUp: Node = null;

    @property(Node)
    ttDown: Node = null;

    @property(FXShadow)
    shadow: FXShadow = null;

    @property(Node)
    fx: Node = null;

    @property(Node)
    close: Node = null;

    @property(Node)
    hand: Node = null;

    isUp: boolean = false;
    isFirst: boolean = false;

    countTutorial: number = 0;

    Show() {

        let time = this.shadow.time;
        this.shadow.ShowFxShadow();
        this.scheduleOnce(() => {
            this.shadow.ShowFxBox(this.up);

            this.SetUpDown(true);

            this.scheduleOnce(() => {
                this.close.active = true;
                let uiopaCloseNode = this.close.getComponent(UIOpacity);
                tween(uiopaCloseNode).to(0.5, { opacity: 255 }).start();
            }, 2);
        }, time)

    }

    HideFxUp() {
        let time = this.shadow.time;
        this.shadow.HideFxBox(this.up);
        this.scheduleOnce(() => {
            this.shadow.ShowFxBox(this.down);

            this.hand.active = false;
        }, time)

    }

    HideFx() {
        let time = this.shadow.time;
        this.shadow.HideFxBox(this.up);
        this.scheduleOnce(() => {
            this.shadow.HideFXShadow();

            this.scheduleOnce(() => {
                PopupManager.getInstance().PopupGoal.Show();
            }, time)
        }, time)

    }

    SetUpDown(up: boolean) {
        this.up.active = up;
        this.ttUp.active = up;
        this.down.active = !up;
        this.ttDown.active = !up;

        this.hand.active = true;

        let lang = LanguageManager.getInstance().currentLang;

        let text = lang == 'en' ? 'Select the middle node to increase the value.' : 'Chọn nút giữa để tăng giá trị.';
        let textDown = lang == 'en' ? 'Select the middle node to proceed with the value reduction.' : 'Chọn nút giữa để tiến hành giảm giá trị.';

        if (up) {
            this.ttUp.getComponent(TypewriterEffect).playEffect(text);
            return;
        }

        this.ttDown.getComponent(TypewriterEffect).playEffect(textDown);
    }
}


