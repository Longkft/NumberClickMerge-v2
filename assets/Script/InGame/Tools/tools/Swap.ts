import { director, tween } from "cc";
import { InGameLogicManager } from "../../InGameLogicManager";
import { IToolStrategy } from "./IToolStrategy";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
// === IMPORT THÊM ===
import { EventBus } from "../../../Utils/EventBus";
import { EventGame } from "../../../Enum/EEvent";
import { ToolProgress } from "../ToolProgress";
import { GridManager } from "../../GridManager";

export class Swap implements IToolStrategy {
    private firstSwapCell: { row: number, col: number } | null = null;
    private logicManager: InGameLogicManager;

    constructor() {
        this.logicManager = InGameLogicManager.getInstance();
    }

    activate(): void {
        this.firstSwapCell = null;
    }

    async execute(row: number, col: number, toolState: ToolProgress | null): Promise<void> {
        if (!this.firstSwapCell) {
            // ---- Lượt click đầu tiên ----
            this.firstSwapCell = { row, col };
            this.logicManager.cells[row]?.[col]?.cellUI.PlayAnimationShakeLoop();
        } else {
            // ---- Lượt click thứ hai ----
            const secondSwapCell = { row, col };

            // Dừng hiệu ứng rung của ô đầu tiên
            this.logicManager.cells[this.firstSwapCell.row]?.[this.firstSwapCell.col]?.cellUI.StopAnimationShake();

            // KIỂM TRA TÍNH LIỀN KỀ ===
            const isAdjacent = Math.abs(this.firstSwapCell.row - secondSwapCell.row) + Math.abs(this.firstSwapCell.col - secondSwapCell.col) === 1;

            if (!isAdjacent) {
                // Báo hiệu cho người dùng biết lựa chọn không hợp lệ (ví dụ: rung nhẹ ô thứ 2)
                const secondCellUI = this.logicManager.cells[secondSwapCell.row]?.[secondSwapCell.col]?.cellUI;
                if (secondCellUI) {
                    secondCellUI.PlayAnimationShake(); // Rung nhẹ rồi tự tắt
                }

                // Reset lại trạng thái để người dùng chọn lại từ đầu, nhưng không tắt tool
                this.firstSwapCell = null;
                return; // Kết thúc hàm execute, chờ người dùng chọn lại
            }

            if (toolState && toolState.isUpgraded) {
                await this.executeUpgraded(this.firstSwapCell, secondSwapCell);
            } else {
                await this.executeNormal(this.firstSwapCell, secondSwapCell);
            }

            // === THÊM 2: GỬI TÍN HIỆU ĐỂ TẮT POPUP/SHADOW ===
            ToolManager.getInstance().deactivateCurrentTool();

            director.emit(EventGame.TOOL_FINISHED, ToolType.SWAP);
            // Tự động hủy tool sau khi thực thi xong
            this.firstSwapCell = null;
        }
    }

    private async executeNormal(cellA: { row, col }, cellB: { row, col }) {
        this.logicManager.IsProcessing = true;
        await this.logicManager.swapCells(cellA, cellB);
        this.logicManager.triggerPostActionCheck();
    }

    private async executeUpgraded(cellA: { row, col }, cellB: { row, col }) {
        const grid = GridManager.getInstance().grid;
        const inGameLogic = InGameLogicManager.getInstance();

        // 1. Xác định "pattern": giá trị và hướng
        const valueA = grid[cellA.row][cellA.col].value;
        const valueB = grid[cellB.row][cellB.col].value;
        const deltaRow = cellB.row - cellA.row; // 1 (dưới), -1 (trên), 0
        const deltaCol = cellB.col - cellA.col; // 1 (phải), -1 (trái), 0

        const pairsToSwap: { cellA: { row, col }, cellB: { row, col } }[] = [];

        // 2. Quét toàn bộ bàn cờ để tìm các cặp có cùng pattern
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                // Tọa độ của ô B tương ứng
                const partnerRow = r + deltaRow;
                const partnerCol = c + deltaCol;

                // Kiểm tra biên
                if (partnerRow >= 0 && partnerRow < grid.length && partnerCol >= 0 && partnerCol < grid[0].length) {
                    // Kiểm tra xem cặp [r, c] và [partnerRow, partnerCol] có khớp pattern không
                    if (grid[r][c].value === valueA && grid[partnerRow][partnerCol].value === valueB) {
                        pairsToSwap.push({ cellA: { row: r, col: c }, cellB: { row: partnerRow, col: partnerCol } });
                    }
                }
            }
        }

        // 3. Thực hiện hoán đổi hàng loạt
        const swapPromises = pairsToSwap.map(pair => inGameLogic.swapCells(pair.cellA, pair.cellB));
        await Promise.all(swapPromises);

        // 4. Kích hoạt kiểm tra match sau khi tất cả đã hoán đổi xong
        inGameLogic.triggerPostActionCheck();
    }

    deactivate(): void {
        // Dọn dẹp nếu tool bị hủy giữa chừng
        if (this.firstSwapCell) {
            this.logicManager.cells[this.firstSwapCell.row]?.[this.firstSwapCell.col]?.cellUI.StopAnimationShake();
        }
        this.firstSwapCell = null;
    }
}