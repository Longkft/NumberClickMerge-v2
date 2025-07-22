import { EventGame } from "../../../Enum/EEvent";
import { GameManager } from "../../../Manager/GameManager";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
import { EventBus } from "../../../Utils/EventBus";
import { Cell } from "../../Cell/Cell";
import { GridManager } from "../../GridManager";
import { InGameLogicManager } from "../../InGameLogicManager";
import { ToolProgress } from "../ToolProgress";
import { IToolStrategy } from "./IToolStrategy";

export class RecycleAllMin implements IToolStrategy {
    activate(): void {
        // Tool này không cần người dùng click, nên sẽ tự thực thi ngay khi kích hoạt
        const toolState = ToolManager.getInstance().getToolState(ToolType.REMOVE_MIN);
        if (toolState && toolState.isUpgraded) {
            console.log("UPGRADED: Select a cell to clear all cells with the same value.");
        } else {
            console.log("NORMAL: Click anywhere to clear all cells with the lowest value.");
            this.execute(0, 0, toolState);
        }
    }

    async execute(row: number, col: number, toolState: ToolProgress | null): Promise<void> {
        // const logicManager = InGameLogicManager.getInstance();
        // logicManager.IsProcessing = true;

        // await logicManager.removeAllMinCellsTools();

        if (toolState && toolState.isUpgraded) {
            console.log("Executing UPGRADED Recycle (Clear by selected value)!");
            // Với tool nâng cấp, chúng ta cần row và col
            await this.executeUpgraded(row, col);
        } else {
            console.log("Executing normal Recycle (Clear lowest value).");
            // Với tool thường, không cần row và col
            await this.executeNormal();
        }

        EventBus.emit(EventGame.TOOL_FINISHED, ToolType.REMOVE_MIN);
        ToolManager.getInstance().deactivateCurrentTool();
    }

    private async executeNormal() {
        const logicManager = InGameLogicManager.getInstance();
        logicManager.IsProcessing = true;
        await logicManager.removeAllMinCellsTools();
    }

    private async executeUpgraded(row: number, col: number) {
        const inGameLogic = InGameLogicManager.getInstance();
        const grid = GridManager.getInstance().grid;

        // Lấy giá trị của ô được chọn
        const targetValue = grid[row]?.[col]?.value;

        // Nếu không chọn được ô hợp lệ hoặc giá trị không dương thì không làm gì
        if (!targetValue || targetValue <= 0) return;

        // Dùng lại hàm phụ để xóa tất cả các ô có giá trị đó
        await this.clearCellsWithValue(targetValue, inGameLogic);

        await inGameLogic.triggerFillAndMatchCheck();
    }


    // --- CÁC HÀM PHỤ (Không thay đổi) ---

    private async clearCellsWithValue(value: number, inGameLogic: InGameLogicManager): Promise<number> {
        const grid = GridManager.getInstance().grid;
        const cellsToDestroy: Cell[] = [];

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c].value === value) {
                    const cellComponent = inGameLogic.cells[r]?.[c];
                    if (cellComponent) {
                        cellsToDestroy.push(cellComponent);
                    }
                }
            }
        }

        if (cellsToDestroy.length === 0) return 0;

        cellsToDestroy.forEach(cell => cell.cellUI.PlayAnimationShakeLoop());
        await new Promise(r => setTimeout(r, 500));

        cellsToDestroy.forEach(cell => {
            cell.cellUI.StopAnimationShake();
            inGameLogic.removeCellAt(cell.cellData.row, cell.cellData.col);
        });

        return cellsToDestroy.length;
    }

    private findLowestValueOnGrid(): number {
        const grid = GridManager.getInstance().grid;
        let lowest = Infinity;
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const value = grid[r][c].value;
                if (value > 0 && value < lowest) {
                    lowest = value;
                }
            }
        }
        return lowest;
    }

    deactivate(): void {
        console.log("RemoveMin Tool Deactivated");
    }

}