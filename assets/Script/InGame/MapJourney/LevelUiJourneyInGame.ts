import { _decorator, Component, Label, Node } from 'cc';
import { HomeManager } from '../../Manager/HomeManager';
const { ccclass, property } = _decorator;

@ccclass('LevelUiJourneyInGame')
export class LevelUiJourneyInGame extends Component {

    @property(Label)
    valueLv: Label = null;

    start() {
        if (!this.valueLv) return;

        this.valueLv.string = HomeManager.getInstance().levelQuest.toString();
    }
}


