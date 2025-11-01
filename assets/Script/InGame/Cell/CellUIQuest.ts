import { _decorator, Color, Component, Label, log, Node, Sprite, tween, Vec3 } from 'cc';
import { GridManager } from '../GridManager';
const { ccclass, property } = _decorator;

@ccclass('CellUIQuest')
export class CellUIQuest extends Component {

    @property(Label)
    index: Label = null

    @property(Label)
    countCell: Label = null

    @property(Node)
    tick: Node = null

    @property(Sprite)
    bg: Sprite = null

    data: { key: number, value: number };
    count: number = 0;

    timeTween: number = 0.3;

    SetUp(data) {
        this.data = data;
        this.count = data.value;
        this.index.string = data.key;

        this.countCell.node.active = true;
        this.tick.active = false;

        let colors = GridManager.getInstance().colors;
        let countLengthColor = colors.length;

        let color = new Color()
        Color.fromHEX(color, colors[(Number(data.key) - 1) % countLengthColor])
        this.bg.color = color
        this.countCell.string = this.count.toString();
    }

    UpdateUICell(sub: number) {
        this.count -= sub;

        if (this.count <= 0) {
            this.countCell.node.active = false;
            this.tick.active = true;

            this.effTick(this.tick);
        } else {
            this.countCell.string = this.count.toString();
        }
    }

    effTick(tick: Node) {
        tick.setScale(new Vec3(0.3, 0.3, 0.3))
        tween(tick)
            .to(this.timeTween, { scale: new Vec3(1, 1, 1) })
            .start();
    }
}


