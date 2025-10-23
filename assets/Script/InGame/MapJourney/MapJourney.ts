import { _decorator, Component, Label, Node, Sprite, SpriteAtlas } from 'cc';
import { HomeManager } from '../../Manager/HomeManager';
import { LanguageManager } from '../../i18n/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('MapJourney')
export class MapJourney extends Component {

    @property(Node)
    map: Node = null;

    @property(Node)
    btnPlayJourney: Node = null;

    @property(SpriteAtlas)
    colorAtlas: SpriteAtlas = null!;

    levelMapJourney: number = 1;

    onEnable(): void {
        this.levelMapJourney = HomeManager.getInstance().levelQuest;

        this.setLabelUi();

        this.setUiJourney();
    }

    setLabelUi() {
        let lang = LanguageManager.getInstance().currentLang;

        let levelString = lang == 'en' ? 'Level' : 'Cấp độ';
        this.btnPlayJourney.getChildByName('label').getComponent(Label).string = `${levelString} ${this.levelMapJourney}`;
    }

    setUiJourney() {
        let map = this.map.children;
        let countIndexSetColor;

        for (let index = 0; index < map.length; index++) {
            const element = map[index];

            element.children[0].getComponent(Label).string = (this.levelMapJourney + index).toString();

            let countIndexSetColor = (this.levelMapJourney + index) % 10; // số màu có sẵn là 10
            const frameName = countIndexSetColor.toString();
            const spriteFrame = this.colorAtlas.getSpriteFrame(frameName);
            element.getComponent(Sprite).spriteFrame = spriteFrame;
        }
    }
}


