import { _decorator, SpriteFrame, resources, log } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { GameMode, GameState } from '../Enum/Enum';
import { EventBus } from '../Utils/EventBus';
import { EventGame } from '../Enum/EEvent';
import { GameManager } from './GameManager';
const { ccclass } = _decorator;

@ccclass('IconManager')
export class IconManager extends BaseSingleton<IconManager> {

    private _iconMap: Map<GameState, SpriteFrame> = new Map();

    protected onLoad(): void {
        super.onLoad();
        this.LazyLoadIcon();
    }

    LazyLoadIcon() {
        resources.load("Texture/iconSettingHome/spriteFrame", SpriteFrame, (err, sf) => {
            if (!err) {
                this._iconMap.set(GameState.MainMenu, sf);
            }
        });

        resources.load("Texture/iconSettingGame/spriteFrame", SpriteFrame, (err, sf) => {
            if (!err) {
                this._iconMap.set(GameState.Gameplay, sf);
            }
        });
    }

    public setState(state: GameState) {
        GameManager.getInstance()._currentState = state;
    }

    public getCurrentIcon(): SpriteFrame | null {
        return this._iconMap.get(GameManager.getInstance()._currentState) || null;
    }
}
