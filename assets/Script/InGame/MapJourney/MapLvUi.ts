import { _decorator, Component, Label, log, Node } from 'cc';
import { HomeManager } from '../../Manager/HomeManager';
import { DataManager } from '../../Manager/DataManager';
const { ccclass, property } = _decorator;

@ccclass('MapLvUi')
export class MapLvUi extends Component {

    @property(Label)
    level: Label = null;

    levelQuest: number = 1;

    async onLoad() {
        this.levelQuest = await DataManager.getInstance().GetLevelQuest();

        log(this.levelQuest)
        log(this.level)

        this.level.string = this.levelQuest.toString();
    }
}


