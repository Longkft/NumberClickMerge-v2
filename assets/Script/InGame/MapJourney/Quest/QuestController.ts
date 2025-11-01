import { _decorator, Component, instantiate, JsonAsset, log, Node, resources } from 'cc';
import { BaseSingleton } from '../../../Base/BaseSingleton';
import { HomeManager } from '../../../Manager/HomeManager';
import { LevelConfig } from '../../../LevelConfig';
import { PrefabManager } from '../../../Manager/PrefabManager';
import { CellUIQuest } from '../../Cell/CellUIQuest';
const { ccclass, property } = _decorator;

@ccclass('QuestController')
export class QuestController extends BaseSingleton<QuestController> {

    levelQuest: number = 1;
    data: any;

    listCellQuest: Array<{ key: number; value: number }> = [];

    protected onLoad() {
        super.onLoad();

        this.levelQuest = HomeManager.getInstance().levelQuest;

        this.LoadData();

        log(this.data);
    }

    LoadData() {
        this.node.removeAllChildren();

        this.data = HomeManager.getInstance().dataLevelQuest;
        const dataCell: Record<string, number> = this.data.number;
        const pairs: Array<{ key: number; value: number }> = [];

        log('this.data: ', this.data)
        for (const keyAsString in dataCell) {
            const hasOwn: boolean = Object.prototype.hasOwnProperty.call(dataCell, keyAsString);
            if (!hasOwn) continue;

            const keyAsNumber: number = Number(keyAsString);
            const value: number = dataCell[keyAsString];

            pairs.push({ key: keyAsNumber, value: value });
        }

        this.listCellQuest = pairs;

        log('key: ', pairs[0].key, 'value: ', pairs[0].value)

        pairs.forEach(data => {
            const cell = instantiate(PrefabManager.getInstance().cellJourneyPrefab);
            cell.getComponent(CellUIQuest).SetUp(data);

            this.node.addChild(cell);
        });
    }
}


