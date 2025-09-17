import { _decorator, CCBoolean, CCInteger, Color, Component, EventTouch, Label, log, Node, Sprite, tween } from 'cc';
import { ECELL_CLICK_EFFECT } from '../../Enum/ECell';
import { CellUI } from './CellUI';
import { GridManager } from '../GridManager';
import { BaseTouch } from '../../Base/BaseTouch';
import { TutorialManager } from '../Tools/TutorialManager';
import { PopupManager } from '../../Manager/PopupManager';
import { GameMode } from '../../Enum/Enum';
const { ccclass, property } = _decorator;

@ccclass('CellTutorial')
export class CellTutorial extends BaseTouch {

    @property(CCBoolean)
    isUp: boolean = false;

    @property(CCBoolean)
    isClick: boolean = false;

    @property(CCInteger)
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
        PopupManager.getInstance().PopupTutorial.hand.active = false;

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

    async TweenNgang() {
        let listNode;

        if (this.isUp) {
            listNode = PopupManager.getInstance().PopupTutorial.up.children.filter(child => child !== this.node);
        } else {
            listNode = PopupManager.getInstance().PopupTutorial.down.children.filter(child => child !== this.node);
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
                        this.data++;
                        this.SetUp(this.data)
                        this.UpdateUICell(this.stage);

                        PopupManager.getInstance().PopupTutorial.countTutorial++;

                        PopupManager.getInstance().PopupTutorial.fx.active = true;

                        this.scheduleOnce(async () => {
                            if (PopupManager.getInstance().PopupTutorial.countTutorial < 2 && GridManager.getInstance().GameMode == GameMode.HARD) { // mở tutorial cell down
                                await PopupManager.getInstance().PopupTutorial.HideFxUp();
                                PopupManager.getInstance().PopupTutorial.SetUpDown(false);
                                PopupManager.getInstance().PopupTutorial.fx.active = false;
                                PopupManager.getInstance().PopupTutorial.countTutorial++
                                return;
                            }

                            PopupManager.getInstance().PopupTutorial.node.destroy();
                            PopupManager.getInstance().PopupTutorial = null
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


