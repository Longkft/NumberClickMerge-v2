import { _decorator, Color, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellUIQuest')
export class CellUIQuest extends Component {

    @property(Label)
    index: Label = null

    @property(Label)
    countCell: Label = null

    @property(Sprite)
    bg: Sprite = null

    count: Number = 0;

    SetUp(data) {
        this.index.string = data["index"]
        let color = new Color()
        Color.fromHEX(color, data["color"])
        this.bg.color = color
        this.countCell.string = this.count.toString();
    }

    UpdateUICell(dataCell: any) {
        let color: Color = new Color()
        Color.fromHEX(color, dataCell.color)
        this.bg.color = color
        this.index.string = dataCell.value.toString()


        // if (dataCell.value >= GridManager.getInstance().numberMax - 1 && dataCell.value > 7) {
        //     this.frame.active = true;
        // }
        // else {
        //     this.frame.active = false
        // }
    }
}


