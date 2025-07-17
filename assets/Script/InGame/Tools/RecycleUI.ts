import { _decorator, Color, Component, Label, log, Node, Sprite } from 'cc';
import { GridManager } from '../GridManager';
import { EventBus } from '../../Utils/EventBus';
import { DataManager } from '../../Manager/DataManager';
const { ccclass, property } = _decorator;

@ccclass('RecycleUI')
export class RecycleUI extends Component {

    @property(Sprite)
    cellBackground: Sprite = null;

    @property(Label)
    value: Label = null;

    protected async onEnable() {
        this.RegisEvent();

        const savedData = await DataManager.getInstance().LoadGameState();

        this.SetUIRecycle(savedData.numberMin);
    }

    RegisEvent() {
        EventBus.on('UIColorRecycle', this.SetUIRecycle, this);
    }

    DestroyEvent() {
        EventBus.off('UIColorRecycle', this.SetUIRecycle);
    }

    SetUIRecycle(value: number) {
        log(11111111111)
        let color: Color = new Color()
        Color.fromHEX(color, GridManager.getInstance().GetColorByValue(value))
        this.cellBackground.color = color;
        this.value.string = value.toString();
    }
}


