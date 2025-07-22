import { _decorator, Component, find, Layers, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { AutoComponent } from '../../Base/AutoComponent';
import { Utils } from '../../Utils/Utils';
import { TypewriterEffect } from '../../FX/TypewriterEffect';
const { ccclass, property } = _decorator;

@ccclass('HintTool')
export class HintTool extends AutoComponent {

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    titleHint: Node = null;

    @property({ type: Node })
    hammerTool: Node = null;

    LoadHammer() {
        if (this.hammerTool) return;
        this.hammerTool = find('Canvas/IngameUIManager/tools/Hammer');
    }

    protected LoadComponent(): void {
        this.LoadHammer();
    }

    async Show() {
        await this.shadow.ShowFxShadow();

        this.titleHint.active = true;

        let text = 'When you level up, you will receive 1 item upgrade point which is added directly to the item from left to right.'

        this.titleHint.getComponent(TypewriterEffect).playEffect(text);

        Utils.getInstance().setCamLayer(this.hammerTool, Layers.Enum.PROFILER);

        this.hammerTool.getChildByPath('tool/block').active = true;
    }

    async Hide() {
        await this.shadow.HideFXShadow();

        this.titleHint.active = false;

        Utils.getInstance().setCamLayer(this.hammerTool, Layers.Enum.DEFAULT);

        this.hammerTool.getChildByPath('tool/block').active = false;
    }

}


