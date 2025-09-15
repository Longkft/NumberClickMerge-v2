import { _decorator, Component, Node, Sprite } from 'cc';
import { EventBus } from '../../../Utils/EventBus';
import { EventGame } from '../../../Enum/EEvent';
import { GameState } from '../../../Enum/Enum';
import { IconManager } from '../../../Manager/IconManager';
import { GameManager } from '../../../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UiSetting')
export class UiSetting extends Component {

    @property({ type: Sprite })
    iconSettingGame: Sprite = null;
    @property({ type: Sprite })
    iconSetting: Sprite = null;

    protected onLoad(): void {
        EventBus.on(EventGame.UPDATE_ICON_SETTING, this.SetIcon, this);
    }

    UnRegisterEvent() {
        EventBus.off(EventGame.UPDATE_ICON_SETTING, this.SetIcon);
    }

    SetIcon() {

        this.iconSetting.spriteFrame = IconManager.getInstance().getCurrentIcon();
        this.iconSetting.node.active = true;

        switch (GameManager.getInstance()._currentState) {
            case GameState.MainMenu: {
                this.iconSettingGame.node.active = false;
            }
                break;
            case GameState.Gameplay: {
                this.iconSettingGame.node.active = true;
            }
                break;
        }
    }
}


