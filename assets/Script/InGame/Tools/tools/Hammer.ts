import { EventGame } from "../../../Enum/EEvent";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
import { EventBus } from "../../../Utils/EventBus";
import { GridManager } from "../../GridManager";
import { InGameLogicManager } from "../../InGameLogicManager";
import { IToolStrategy } from "./IToolStrategy ";

export class HammerTool implements IToolStrategy {
    activate(): void {
        console.log("Hammer Tool Activated");
    }

    async execute(row: number, col: number): Promise<void> {
        const logicManager = InGameLogicManager.getInstance();
        logicManager.IsProcessing = true;

        const targetCell = logicManager.cells[row]?.[col];
        if (targetCell) {
            targetCell.cellUI.PlayAnimationShakeLoop();
            await new Promise(r => setTimeout(r, 1000));
            targetCell.cellUI.StopAnimationShake();

            logicManager.removeCellAt(row, col);
            await logicManager.triggerFillAndMatchCheck();
        } else {
            // Nếu click ra ngoài hoặc ô không hợp lệ, không khóa game
            logicManager.IsProcessing = false;
        }

        EventBus.emit(EventGame.TOOL_FINISHED, ToolType.HAMMER);
        ToolManager.getInstance().deactivateCurrentTool();
    }

    deactivate(): void {
        console.log("Hammer Tool Deactivated");
    }

}