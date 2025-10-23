import { _decorator, Component, JsonAsset, log, Node, resources } from 'cc';
import { BaseSingleton } from '../../../Base/BaseSingleton';
import { HomeManager } from '../../../Manager/HomeManager';
const { ccclass, property } = _decorator;

@ccclass('QuestController')
export class QuestController extends BaseSingleton<QuestController> {

    levelQuest: number = 1;
    data: any;

    protected async onLoad() {
        super.onLoad();

        this.levelQuest = HomeManager.getInstance().levelQuest;

        await this.LoadJson();

        log(this.data);
    }

    LoadJson(): Promise<void> {
        let path = `Map/QuestLevel/lv${this.levelQuest}`;

        return new Promise((resolve, reject) => {
            resources.load(path, JsonAsset, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.data = asset.json;

                resolve();
            });
        });
    }
}


