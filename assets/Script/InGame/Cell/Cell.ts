import { _decorator, Component, director, EventTouch, Input, log, Node, randomRange } from 'cc';
import { CellModel } from './CellModel';
import { CellUI } from './CellUI';
import { ECELL_CLICK_EFFECT, ECELL_STATE, ECLICK_MODE } from '../../Enum/ECell';
import { PrefabManager } from '../../Manager/PrefabManager';
import { PoolObjectManager } from '../../Manager/PoolObjectManager';
import { InGameLogicManager } from '../InGameLogicManager';
import { InGameUIManager } from '../InGameUIManager';
import { Action } from '../../Utils/EventWrapper';
import { GridManager } from '../GridManager';
import { Utils } from '../../Utils/Utils';
import { HeartUi } from '../Heart/HeartUi';
import { EventBus } from '../../Utils/EventBus';
import { EventGame } from '../../Enum/EEvent';
import { AudioManager } from '../../Manager/AudioManager';
import { GameMode, SFXType } from '../../Enum/Enum';
import { DataManager } from '../../Manager/DataManager';
import { PopupManager } from '../../Manager/PopupManager';
import { ToolManager } from '../../Manager/ToolManager';
import { HomeManager } from '../../Manager/HomeManager';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell {
    private clickHandler: (e: EventTouch) => void;

    public cellData: CellModel = null
    public cellUI: CellUI = null
    clickEffect: ECELL_CLICK_EFFECT = ECELL_CLICK_EFFECT.Up
    cellState: ECELL_STATE = ECELL_STATE.None

    private readonly MAX_DOWN = 6;

    constructor(cellData: CellModel) {
        this.cellData = cellData;
        // this.clickEffect = this.RandomEffectClick()
        this.clickEffect = this.returnStatusGameMode() ? ECELL_CLICK_EFFECT.Up : this.RandomEffectClick();
        this.CreateCellUI()

        // chỉ bind MỘT lần rồi lưu lại
        this.clickHandler = this.onClick.bind(this);
        this.RegisterEventClick();
    }

    returnStatusGameMode() {
        if (GridManager.getInstance().GameMode == GameMode.CLASSIC) {
            return true;
        } else if (GridManager.getInstance().GameMode == GameMode.HARD) {
            return false;
        } else if (GridManager.getInstance().GameMode == GameMode.JOURNEY && HomeManager.getInstance().isHard) {
            return false;
        }
        return true;
    }

    public CreateCellUI(): void {
        let cellNode = PoolObjectManager.getInstance().Spawn(PrefabManager.getInstance().cellPrefab, InGameUIManager.getInstance().cellNode)
        this.cellUI = cellNode.getComponent(CellUI)
        this.cellUI.UpdateUICell(this.cellData, this.clickEffect, this.cellState)
    }


    RegisterEventClick() {
        this.GetCellUI().on(Input.EventType.TOUCH_END, this.clickHandler)
    }

    RemoveEventClick() {
        this.GetCellUI().off(Input.EventType.TOUCH_END, this.clickHandler)
    }

    onClick() {

        const toolManager = ToolManager.getInstance();
        const activeTool = toolManager.getActiveTool();

        AudioManager.getInstance().playSFX(SFXType.Spawn);

        // 1. Ưu tiên kiểm tra tween chạy
        if (InGameLogicManager.getInstance().IsProcessing) {
            return;
        }

        // 2. Ưu tiên kiểm tra tool
        if (activeTool) {
            // Nếu có tool đang chạy, giao toàn bộ việc xử lý cho ToolManager
            toolManager.useActiveToolOnCell(this.cellData.row, this.cellData.col);
        } else {
            this.HandleNormalClick();
        }
    }

    HandleNormalClick() {
        console.log(InGameLogicManager.getInstance().isRunning)
        if (InGameLogicManager.getInstance().isRunning == true) return
        InGameLogicManager.getInstance().isRunning = true
        if (InGameLogicManager.getInstance().currentHeart <= 0) {
            // PopupManager.getInstance().OutOfMove.Show();
            PopupManager.getInstance().Lose.ShowFXLose();
            return;
        }

        this.UpdateCellWhenClick();

        const matched = GridManager.getInstance().findConnectedCells(this.cellData.row, this.cellData.col);
        if (!matched || matched.length < 3) {
            InGameLogicManager.getInstance().isRunning = false
            if (InGameLogicManager.getInstance().currentHeart <= 0) {
                // PopupManager.getInstance().OutOfMove.Show();
                PopupManager.getInstance().Lose.ShowFXLose();
            }
            return;
        }

        InGameLogicManager.getInstance().ClickCheckToMove(this.cellData.row, this.cellData.col, matched);
    }

    UpdateCellWhenClick() {
        if (this.clickEffect == ECELL_CLICK_EFFECT.Up) {
            if (this.cellData.value >= GridManager.getInstance().numberMax - 1) {
                this.cellUI.PlayAnimationShake()
                return;
            }
            this.cellData.value++
        }
        else {
            if (this.cellData.value == GridManager.getInstance().numberMin) {
                this.cellUI.PlayAnimationShake()
                return;
            }
            this.cellData.value--
        }

        Utils.getInstance().UpdateHeart(-1); // trừ đi 1 heart

        director.emit(EventGame.UPDATE_HEARt_UI);

        this.cellData.color = GridManager.getInstance().GetColorByValue(this.cellData.value)
        this.cellUI.UpdateUICell(this.cellData, this.clickEffect, this.cellState);
    }

    UpDateWhenMerge() {
        this.cellData.value++;
        this.cellData.color = GridManager.getInstance().GetColorByValue(this.cellData.value);
        this.cellUI.UpdateUICell(this.cellData, this.clickEffect, this.cellState);
    }

    GetCellUI() {
        return this.cellUI.node
    }

    RandomEffectClick(): ECELL_CLICK_EFFECT {

        const gridMgr = GridManager.getInstance();
        const minValue = GridManager.getInstance().numberMin;

        // ❶ Nếu ô đang ở giá trị nhỏ nhất → luôn Up
        if (this.cellData.value === minValue) return ECELL_CLICK_EFFECT.Up;

        let dataCountDown = this.GetDataCountDown();
        if (dataCountDown == this.MAX_DOWN) return ECELL_CLICK_EFFECT.Up;

        let random = randomRange(0, 1)

        return random > 0.4 ? ECELL_CLICK_EFFECT.Up : ECELL_CLICK_EFFECT.Down
    }

    GetDataCountDown() {
        let cellCollection = InGameLogicManager.getInstance().cellCollection;
        let listCellDown = cellCollection.filter(cell => cell.clickEffect == ECELL_CLICK_EFFECT.Down);

        return listCellDown.length;
    }

    Dispose() {
        this.RemoveEventClick();
        // add cellUi vào pooling
        PoolObjectManager.getInstance().RecycleObject(this.GetCellUI(), PrefabManager.getInstance().cellPrefab);
        InGameLogicManager.getInstance().cellCollection.RemoveItem(this)
    }
}


