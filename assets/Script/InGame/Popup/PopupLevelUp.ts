import { _decorator, Component, Label, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { LevelController } from '../head/Level/LevelController';
import { ToolManager } from '../../Manager/ToolManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
const { ccclass, property } = _decorator;

@ccclass('PopupLevelUp')
export class PopupLevelUp extends Component {

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    @property({ type: Label })
    labelLv: Label = null;

    async show(lvUp: number) {
        await this.shadow.ShowFxShadow();
        await this.shadow.ShowFxBox(this.box);

        this.labelLv.string = lvUp.toString();
    }

    async Hide() {
        await this.shadow.HideFxBox(this.box)
        await this.shadow.HideFXShadow();
    }

    async BtnContinute() {
        await this.Hide();

        EventBus.emit(EventGame.TOOL_UPGRADEUITOOLUP, ToolManager.getInstance().chooseTool);
    }
}


