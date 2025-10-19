import { _decorator, Component, find, Layers, Node } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { AutoComponent } from '../../Base/AutoComponent';
import { Utils } from '../../Utils/Utils';
import { TypewriterEffect } from '../../FX/TypewriterEffect';
import { InGameLogicManager } from '../InGameLogicManager';
import { LanguageManager } from '../../i18n/LanguageManager';
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
        this.hammerTool = InGameLogicManager.getInstance().node.getChildByPath('tools/Hammer');
    }

    protected LoadComponent(): void {
        this.LoadHammer();
    }

    Show() {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        let time = this.shadow.time;
        this.shadow.ShowFxShadow();

        this.scheduleOnce(() => {
            this.titleHint.active = true;

            let lang = LanguageManager.getInstance().currentLang;

            let text = lang == 'en' ? 'When you level up, you will receive 1 item upgrade point which is added directly to the item from left to right.' : 'Khi bạn lên cấp, bạn sẽ nhận được 1 điểm nâng cấp vật phẩm được cộng trực tiếp vào vật phẩm từ trái sang phải.';

            this.titleHint.getComponent(TypewriterEffect).playEffect(text);

            Utils.getInstance().setCamLayer(this.hammerTool, 1 << Utils.getInstance().layerMaxIndex);

            this.hammerTool.getChildByPath('tool/block').active = true;
        }, time);
    }

    Hide() {
        let time = this.shadow.time;
        this.shadow.HideFXShadow();

        this.scheduleOnce(() => {
            this.titleHint.active = false;

            Utils.getInstance().setCamLayer(this.hammerTool, Layers.Enum.DEFAULT);

            this.hammerTool.getChildByPath('tool/block').active = false;
        }, time);
    }

}


