import { _decorator, Component, director, Label, log, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { LevelController } from '../head/Level/LevelController';
import { ToolManager } from '../../Manager/ToolManager';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { PopupManager } from '../../Manager/PopupManager';
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

        if (ToolManager.getInstance().isShowHint) {
            log(11111)
            ToolManager.getInstance().isShowHint = false;
            PopupManager.getInstance().PopupHintTool.Show();
        }

        director.emit(EventGame.TOOL_UPGRADEUITOOLUP, ToolManager.getInstance().chooseTool);
    }
}


