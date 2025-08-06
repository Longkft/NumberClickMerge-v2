import { _decorator, Component, EventTouch, Node } from 'cc';
import { BaseTouch } from '../../Base/BaseTouch';
import { InGameLogicManager } from '../InGameLogicManager';
import { GridManager } from '../GridManager';
import { GameMode } from '../../Enum/Enum';
import { HomeManager } from '../../Manager/HomeManager';
const { ccclass, property } = _decorator;

@ccclass('BtnClassic')
export class BtnClassic extends BaseTouch {

    TouchStart(event: EventTouch): void {
        GridManager.getInstance().GameMode = GameMode.CLASSIC;

        HomeManager.getInstance().TouchPlayGame();

        InGameLogicManager.getInstance().LoadGame();
    }
}


