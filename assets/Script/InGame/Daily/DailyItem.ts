import { _decorator, Component, Label, Node } from 'cc';
import { FXBtnPlay } from '../../FX/FXBtnPlay';
const { ccclass, property } = _decorator;

@ccclass('DailyItem')
export class DailyItem extends Component {

    @property({ type: Node })
    hide: Node = null;

    @property({ type: FXBtnPlay })
    fxBtn: FXBtnPlay = null;

    @property({ type: Label })
    nameDaily: Label = null;

    @property({ type: Label })
    goldUI: Label = null;

    gold: number = 0;

    setUp(name: string, gold: number) {
        this.nameDaily.string = `Day ${name}`;
        this.goldUI.string = gold.toString();
        this.gold = gold;
    }

    ActiveNodeHide(status: boolean = false) {
        this.hide.active = status;
    }

    ActiveFxButton(status: boolean = true) {
        this.fxBtn.enabled = status;
    }
}


