import { director } from "cc";
import { EventGame } from "../../../Enum/EEvent";
import { GameManager } from "../../../Manager/GameManager";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
import { EventBus } from "../../../Utils/EventBus";
import { Cell } from "../../Cell/Cell";
import { GridManager } from "../../GridManager";
import { InGameLogicManager } from "../../InGameLogicManager";
import { ToolProgress } from "../ToolProgress";
import { IToolStrategy } from "./IToolStrategy";

export class HammerTool implements IToolStrategy {
    activate(): void {

    }

    async execute(row: number, col: number, toolState: ToolProgress | null): Promise<void> {
        const logicManager = InGameLogicManager.getInstance();
        logicManager.IsProcessing = true;

        if (toolState && toolState.isUpgraded) {
            this.executeUpgraded(row, col, logicManager);
        } else {
            this.executeNormal(row, col, logicManager);
        }

        director.emit(EventGame.TOOL_FINISHED, ToolType.HAMMER);
        ToolManager.getInstance().deactivateCurrentTool();
    }

    deactivate(): void {

    }

    private async executeNormal(row: number, col: number, logicManager: InGameLogicManager) {
        const targetCell = logicManager.cells[row]?.[col];
        targetCell.cellUI.PlayAnimationShakeLoop();
        await new Promise(r => setTimeout(r, 1000));
        targetCell.cellUI.StopAnimationShake();

        logicManager.removeCellAt(row, col);
        // Kích hoạt chuỗi rơi và kiểm tra match
        logicManager.triggerFillAndMatchCheck();
    }

    private async executeUpgraded(row: number, col: number, logicManager: InGameLogicManager) {
        const coordsToDestroy = [
            { r: row, c: col },         // Trung tâm
            { r: row - 1, c: col },     // Trên
            { r: row + 1, c: col },     // Dưới
            { r: row, c: col - 1 },     // Trái
            { r: row, c: col + 1 },     // Phải
        ];

        const gridConfig = GameManager.getInstance().dataGame.json;
        const cellsToDestroy: Cell[] = [];

        for (const pos of coordsToDestroy) {
            // Kiểm tra xem tọa độ có nằm trong lưới không
            if (pos.r >= 0 && pos.r < gridConfig["row"] && pos.c >= 0 && pos.c < gridConfig["col"]) {
                const targetCell = logicManager.cells[pos.r]?.[pos.c];
                if (targetCell) {
                    cellsToDestroy.push(targetCell);
                }
            }
        }

        if (cellsToDestroy.length === 0) return;

        // Chạy animation cho TẤT CẢ các cell cùng một lúc
        cellsToDestroy.forEach(cell => {
            cell.cellUI.PlayAnimationShakeLoop();
        });

        // Chờ 1 giây
        await new Promise(r => setTimeout(r, 1000));

        // 5. Dừng animation và xóa TẤT CẢ các cell
        cellsToDestroy.forEach(cell => {
            cell.cellUI.StopAnimationShake();
            logicManager.removeCellAt(cell.cellData.row, cell.cellData.col);
        });

        logicManager.triggerFillAndMatchCheck();
    }
}