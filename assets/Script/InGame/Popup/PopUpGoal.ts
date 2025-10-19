import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { CellPopupMax, CellPopupState } from '../Cell/CellPopupMax';
import { GridManager } from '../GridManager';
import { PopupManager } from '../../Manager/PopupManager';
import { Utils } from '../../Utils/Utils';
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

    Show() {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        let time = this.shadow.time;
        this.shadow.ShowFxShadow();

        this.scheduleOnce(() => {
            this.init();

            this.shadow.ShowFxBox(this.box);
        }, time)
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

    btnStart() {
        let time = this.shadow.time;
        this.shadow.HideFxBox(this.box);

        this.scheduleOnce(() => {
            this.shadow.HideFXShadow();
        }, time)
    }
}


