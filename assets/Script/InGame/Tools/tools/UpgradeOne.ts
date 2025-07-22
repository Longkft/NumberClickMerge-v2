import { EventGame } from "../../../Enum/EEvent";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
import { EventBus } from "../../../Utils/EventBus";
import { GridManager } from "../../GridManager";
import { InGameLogicManager } from "../../InGameLogicManager";
import { ToolProgress } from "../ToolProgress";
import { IToolStrategy } from "./IToolStrategy";

export class UpgradeOne implements IToolStrategy {
    activate(): void {
        console.log("Upgrade Tool Activated");
    }

    async execute(row: number, col: number, toolState: ToolProgress | null): Promise<void> {
        const logicManager = InGameLogicManager.getInstance();
        const gridManager = GridManager.getInstance();
        const maxUpgradeVal = gridManager.numberMax - 1; // Giả sử nâng cấp lên giá trị cao nhất có thể


        const cell = logicManager.cells[row]?.[col];
        if (!cell) {
            ToolManager.getInstance().deactivateCurrentTool();
            return;
        }

        if (cell.cellData.value >= maxUpgradeVal) {
            cell.cellUI.PlayAnimationShake();
        } else {
            // logicManager.IsProcessing = true;
            // logicManager.upgradeCellAt(row, col, maxUpgradeVal);
            // logicManager.triggerPostActionCheck();
            // EventBus.emit(EventGame.TOOL_FINISHED, ToolType.UPGRADE);
            // ToolManager.getInstance().deactivateCurrentTool();

            if (toolState && toolState.isUpgraded) {
                console.log("Executing UPGRADED Upgrade (All matching cells)!");
                this.executeUpgraded(row, col, logicManager, gridManager, maxUpgradeVal);
            } else {
                console.log("Executing normal Upgrade (One cell).");
                this.executeNormal(row, col, logicManager, maxUpgradeVal);
            }

            EventBus.emit(EventGame.TOOL_FINISHED, ToolType.UPGRADE);
            ToolManager.getInstance().deactivateCurrentTool();
        }
    }

    private executeNormal(row: number, col: number, logicManager: InGameLogicManager, newValue: number) {
        logicManager.IsProcessing = true;
        logicManager.upgradeCellAt(row, col, newValue);
        logicManager.triggerPostActionCheck();
    }

    private async executeUpgraded(row: number, col: number, logicManager: InGameLogicManager, gridManager: GridManager, newValue: number) {
        const grid = gridManager.grid;
        const targetValue = grid[row][col].value;

        const cellsToUpgrade: { r: number, c: number }[] = [];

        // 1. Quét toàn bộ bàn cờ để tìm các ô có cùng giá trị
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].value === targetValue) {
                    cellsToUpgrade.push({ r: i, c: j });
                }
            }
        }

        // Chạy animation cho TẤT CẢ các cell cùng một lúc
        cellsToUpgrade.forEach(datacell => {
            logicManager.cells[datacell.r][datacell.c].cellUI.PlayAnimationShakeLoop();
        });

        // Chờ 1 giây
        await new Promise(r => setTimeout(r, 1000));

        // 2. Nâng cấp tất cả các ô đã tìm thấy
        for (const pos of cellsToUpgrade) {
            logicManager.cells[pos.r][pos.c].cellUI.StopAnimationShake();
            logicManager.upgradeCellAt(pos.r, pos.c, newValue);
        }

        // 3. Kích hoạt kiểm tra match chỉ một lần sau khi đã nâng cấp hết
        logicManager.triggerPostActionCheck();
    }

    deactivate(): void {
        console.log("Upgrade Tool Deactivated");
    }

}