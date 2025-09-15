import { _decorator, Component, EventTouch, Node } from 'cc';
import { BaseTouch } from '../../Base/BaseTouch';
import { InGameLogicManager } from '../InGameLogicManager';
import { GridManager } from '../GridManager';
import { GameMode, GameState } from '../../Enum/Enum';
import { HomeManager } from '../../Manager/HomeManager';
import { GameManager } from '../../Manager/GameManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
const { ccclass, property } = _decorator;

@ccclass('BtnHard')
export class BtnHard extends BaseTouch {

    TouchStart(event: EventTouch): void {
        GridManager.getInstance().GameMode = GameMode.HARD;

        HomeManager.getInstance().TouchPlayGame();

        InGameLogicManager.getInstance().LoadGame();

        GameManager.getInstance()._currentState = GameState.Gameplay;
        EventBus.emit(EventGame.UPDATE_ICON_SETTING);
    }
}


