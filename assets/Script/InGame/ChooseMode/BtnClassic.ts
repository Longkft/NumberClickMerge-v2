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

@ccclass('BtnClassic')
export class BtnClassic extends BaseTouch {

    TouchStart(event: EventTouch): void {
        GridManager.getInstance().GameMode = GameMode.CLASSIC;

        HomeManager.getInstance().TouchPlayGame();

        InGameLogicManager.getInstance().LoadGame();

        GameManager.getInstance()._currentState = GameState.Gameplay;
        EventBus.emit(EventGame.UPDATE_ICON_SETTING);
    }
}


