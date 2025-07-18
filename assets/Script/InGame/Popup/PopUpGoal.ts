import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { CellPopupMax, CellPopupState } from '../Cell/CellPopupMax';
import { GridManager } from '../GridManager';
const { ccclass, property } = _decorator;

@ccclass('PopUpGoal')
export class PopUpGoal extends Component {

    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    @property({ type: Node })
    cellMax: Node = null;

    @property({ type: Prefab })
    cellMaxPrefab: Prefab = null;

    async Show() {
        await this.shadow.ShowFxShadow();

        this.init();

        await this.shadow.ShowFxBox(this.box);
    }

    init() {
        let numberMax = GridManager.getInstance().numberMax;

        this.CreateCell(numberMax, CellPopupState.CURRENT)
    }

    CreateCell(value, state) {
        let cell = instantiate(this.cellMaxPrefab)
        this.cellMax.addChild(cell);
        cell.getComponent(CellPopupMax).setUp(value, state)
    }

    async btnStart() {
        await this.shadow.HideFxBox(this.box);

        await this.shadow.HideFXShadow();
    }
}


