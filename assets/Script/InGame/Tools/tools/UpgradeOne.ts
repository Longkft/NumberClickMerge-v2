import { EventGame } from "../../../Enum/EEvent";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
import { EventBus } from "../../../Utils/EventBus";
import { GridManager } from "../../GridManager";
import { InGameLogicManager } from "../../InGameLogicManager";
import { IToolStrategy } from "./IToolStrategy";

export class UpgradeOne implements IToolStrategy {
    activate(): void {
        console.log("Upgrade Tool Activated");
    }

    async execute(row: number, col: number): Promise<void> {
        const logicManager = InGameLogicManager.getInstance();
        const cell = logicManager.cells[row]?.[col];
        if (!cell) {
            ToolManager.getInstance().deactivateCurrentTool();
            return;
        }

        const gridMgr = GridManager.getInstance();
        const maxUpgradeVal = gridMgr.numberMax - 1; // Giả sử nâng cấp lên giá trị cao nhất có thể

        if (cell.cellData.value >= maxUpgradeVal) {
            cell.cellUI.PlayAnimationShake();
        } else {
            logicManager.IsProcessing = true;
            logicManager.upgradeCellAt(row, col, maxUpgradeVal);
            logicManager.triggerPostActionCheck();
            EventBus.emit(EventGame.TOOL_FINISHED, ToolType.UPGRADE);
            ToolManager.getInstance().deactivateCurrentTool();
        }
    }

    deactivate(): void {
        console.log("Upgrade Tool Deactivated");
    }

}