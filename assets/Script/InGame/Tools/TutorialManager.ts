import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
import { BaseSingleton } from '../../Base/BaseSingleton';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { TypewriterEffect } from '../../FX/TypewriterEffect';
import { PopupManager } from '../../Manager/PopupManager';
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

    async Show() {

        await this.shadow.ShowFxShadow();

        await this.shadow.ShowFxBox(this.up);

        this.SetUpDown(true);

        this.scheduleOnce(() => {
            this.close.active = true;
            let uiopaCloseNode = this.close.getComponent(UIOpacity);
            tween(uiopaCloseNode).to(0.5, { opacity: 255 }).start();
        }, 2);
    }

    async HideFxUp() {

        await this.shadow.HideFxBox(this.up);

        await this.shadow.ShowFxBox(this.down);

        this.hand.active = false;
    }

    async HideFx() {

        await this.shadow.HideFxBox(this.up);

        await this.shadow.HideFXShadow();

        PopupManager.getInstance().PopupGoal.Show();
    }

    SetUpDown(up: boolean) {
        this.up.active = up;
        this.ttUp.active = up;
        this.down.active = !up;
        this.ttDown.active = !up;

        this.hand.active = true;

        if (up) {
            this.ttUp.getComponent(TypewriterEffect).playEffect(this.ttUp.getComponent(TypewriterEffect).fullText);
            return;
        }

        this.ttDown.getComponent(TypewriterEffect).playEffect(this.ttDown.getComponent(TypewriterEffect).fullText);
    }
}


