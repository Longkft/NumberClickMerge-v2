import { _decorator, Component, Node } from 'cc';
import { BaseSingleton } from '../../Base/BaseSingleton';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
const { ccclass, property } = _decorator;

@ccclass('TutorialManager')
export class TutorialManager extends BaseSingleton<TutorialManager> {

    @property(Node)
    up: Node = null;

    @property(Node)
    down: Node = null;

    @property(FXShadow)
    shadow: FXShadow = null;

    @property(Node)
    fx: Node = null;

    isUp: boolean = false;
    isFirst: boolean = false;

    countTutorial: number = 0;

    protected async onLoad() {
        this.isFirst = DataManager.getInstance().First;
        DataManager.getInstance().First = true;

        await this.shadow.ShowFxShadow();

        this.up.active = true;
        this.down.active = false;
    }

    SetUpDown(up: boolean) {
        this.up.active = up;
        this.down.active = !up;
    }
}


