import { _decorator, Component, director, log, Node } from 'cc';
import { DataManager } from '../../Manager/DataManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { Utils } from '../../Utils/Utils';
import { InGameLogicManager } from '../InGameLogicManager';
import { GameMode } from '../../Enum/Enum';
import { GridManager } from '../GridManager';
const { ccclass, property } = _decorator;

@ccclass('HeartUi')
export class HeartUi extends Component {

    listHeart: Node[] = [];

    gameMode: GameMode = GameMode.CLASSIC;

    protected onLoad(): void {
        this.gameMode = GridManager.getInstance().GameMode;

        this.Init();
    }

    Init() {
        switch (this.gameMode) {
            case GameMode.CLASSIC: {
                Utils.getInstance().LoadHeartGameDefault();
                this.LoadListHeart();
            }
                break;

            case GameMode.JOURNEY:

                break;
        }
    }

    start() {
        this.UpdateUiheart();
        this.RegisterEvent();
    }

    RegisterEvent() {
        director.on(EventGame.UPDATE_HEARt_UI, this.UpdateUiheart, this);
    }

    UnRegisterEvent() {
        director.off(EventGame.UPDATE_HEARt_UI, this.UpdateUiheart);
    }

    LoadListHeart() {
        this.listHeart = this.node.children.filter(element => element.name === 'itemHeat');
    }

    UpdateUiheart() {
        let myHeart = InGameLogicManager.getInstance().currentHeart;
        for (let i = 0; i < myHeart; i++) {
            let heartNode = this.listHeart[i];
            let ActiveHeartNode = heartNode.getChildByName('heatActive');

            ActiveHeartNode.active = true;
        }

        for (let j = myHeart; j < this.listHeart.length; j++) {
            let heartNode = this.listHeart[j];
            let ActiveHeartNode = heartNode.getChildByName('heatActive');

            ActiveHeartNode.active = false;
        }
    }

    protected onDestroy(): void {
        this.UnRegisterEvent()
    }
}


