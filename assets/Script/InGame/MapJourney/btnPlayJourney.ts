import { _decorator, Component, EventTouch, Node } from 'cc';
import { BaseTouch } from '../../Base/BaseTouch';
import { GridManager } from '../GridManager';
import { GameMode, GameState } from '../../Enum/Enum';
import { HomeManager } from '../../Manager/HomeManager';
import { GameManager } from '../../Manager/GameManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { InGameLogicManager } from '../InGameLogicManager';
const { ccclass, property } = _decorator;

@ccclass('btnPlayJourney')
export class btnPlayJourney extends BaseTouch {

    TouchStart(event: EventTouch): void {
        GridManager.getInstance().GameMode = GameMode.JOURNEY;

        HomeManager.getInstance().TouchGameMapJourney();

        InGameLogicManager.getInstance().LoadGame();

        GameManager.getInstance()._currentState = GameState.Gameplay;
        EventBus.emit(EventGame.UPDATE_ICON_SETTING);
    }
}


