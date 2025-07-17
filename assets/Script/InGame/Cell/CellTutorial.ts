import { _decorator, Color, Component, EventTouch, Label, log, Node, Sprite, tween } from 'cc';
import { ECELL_CLICK_EFFECT } from '../../Enum/ECell';
import { CellUI } from './CellUI';
import { GridManager } from '../GridManager';
import { BaseTouch } from '../../Base/BaseTouch';
import { TutorialManager } from '../Tools/TutorialManager';
import { PopupManager } from '../../Manager/PopupManager';
const { ccclass, property } = _decorator;

@ccclass('CellTutorial')
export class CellTutorial extends BaseTouch {

    @property(Boolean)
    isUp: boolean = false;

    @property(Boolean)
    isClick: boolean = false;

    @property(Number)
    data: number = 2;

    @property(Label)
    index: Label = null

    @property(Sprite)
    bg: Sprite = null

    @property(Node)
    up: Node = null

    @property(Node)
    down: Node = null

    @property(Node)
    frame: Node = null

    stage: any;

    start() {
        super.start();

        if (this.isUp) {
            this.stage = ECELL_CLICK_EFFECT.Up;
        } else {
            this.stage = ECELL_CLICK_EFFECT.Down;
        }

        this.SetUp(this.data);
        this.UpdateUICell(this.stage);
    }

    TouchStart(event: EventTouch): void {
        if (!this.isClick) return;

        if (this.isUp) {
            this.data++;
        } else {
            this.data--;
        }

        this.SetUp(this.data)
        this.UpdateUICell(this.stage);
        this.isClick = false;

        this.TweenNgang();
    }

    TweenNgang() {
        let listNode;

        if (this.isUp) {
            listNode = TutorialManager.getInstance().up.children.filter(child => child !== this.node);
        } else {
            listNode = TutorialManager.getInstance().down.children.filter(child => child !== this.node);
        }

        let pos = this.node.position.clone();

        let count = 0;
        for (const node of listNode) {
            tween(node)
                .to(0.5, { position: pos })
                .call(() => {
                    count++;
                    node.destroy();
                    if (count == 2) {
                        log(1)
                        this.data++;
                        this.SetUp(this.data)
                        this.UpdateUICell(this.stage);

                        TutorialManager.getInstance().countTutorial++;

                        TutorialManager.getInstance().fx.active = true;

                        this.scheduleOnce(async () => {
                            TutorialManager.getInstance().SetUpDown(false);
                            TutorialManager.getInstance().fx.active = false;
                            if (TutorialManager.getInstance().countTutorial < 2) return;
                            let shadow = TutorialManager.getInstance().shadow;
                            await shadow.HideFXShadow();

                            PopupManager.getInstance().PopupGoal.Show();
                        }, 2)
                    }
                })
                .start();
        }
    }

    SetUp(data) {
        this.index.string = data["index"]
        let color = new Color()
        Color.fromHEX(color, data["color"])
        this.bg.color = color
    }

    UpdateUICell(clickEffect: ECELL_CLICK_EFFECT) {
        let color: Color = new Color()
        Color.fromHEX(color, GridManager.getInstance().colors[Number(this.data)])
        this.bg.color = color
        this.index.string = this.data.toString()

        if (clickEffect == ECELL_CLICK_EFFECT.Up) {
            this.up.active = false
            this.down.active = false
        }
        else {
            this.up.active = false
            this.down.active = true
        }

        if (this.data >= GridManager.getInstance().numberMax - 1 && this.data > 7) {
            this.frame.active = true;
        }
        else {
            this.frame.active = false
        }
    }
}


