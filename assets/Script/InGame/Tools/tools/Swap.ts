import { tween } from "cc";
import { InGameLogicManager } from "../../InGameLogicManager";
import { IToolStrategy } from "./IToolStrategy";
import { ToolManager, ToolType } from "../../../Manager/ToolManager";
// === IMPORT THÊM ===
import { EventBus } from "../../../Utils/EventBus";
import { EventGame } from "../../../Enum/EEvent";

export class Swap implements IToolStrategy {
    private firstSwapCell: { row: number, col: number } | null = null;
    private logicManager: InGameLogicManager;

    constructor() {
        this.logicManager = InGameLogicManager.getInstance();
    }

    activate(): void {
        console.log("Swap Tool Activated");
        this.firstSwapCell = null;
    }

    async execute(row: number, col: number): Promise<void> {
        if (!this.firstSwapCell) {
            // ---- Lượt click đầu tiên ----
            this.firstSwapCell = { row, col };
            this.logicManager.cells[row]?.[col]?.cellUI.PlayAnimationShakeLoop();
        } else {
            // ---- Lượt click thứ hai ----
            const secondSwapCell = { row, col };

            // Dừng hiệu ứng rung của ô đầu tiên
            this.logicManager.cells[this.firstSwapCell.row]?.[this.firstSwapCell.col]?.cellUI.StopAnimationShake();

            if (this.firstSwapCell.row === row && this.firstSwapCell.col === col) {
                // Nếu click lại chính nó, hủy tool
                ToolManager.getInstance().deactivateCurrentTool();
                return;
            }

            // === THÊM 1: KIỂM TRA TÍNH LIỀN KỀ ===
            const isAdjacent = Math.abs(this.firstSwapCell.row - secondSwapCell.row) + Math.abs(this.firstSwapCell.col - secondSwapCell.col) === 1;

            if (!isAdjacent) {
                console.warn("Invalid swap: Cells are not adjacent.");
                // Báo hiệu cho người dùng biết lựa chọn không hợp lệ (ví dụ: rung nhẹ ô thứ 2)
                const secondCellUI = this.logicManager.cells[secondSwapCell.row]?.[secondSwapCell.col]?.cellUI;
                if (secondCellUI) {
                    secondCellUI.PlayAnimationShake(); // Rung nhẹ rồi tự tắt
                }

                // Reset lại trạng thái để người dùng chọn lại từ đầu, nhưng không tắt tool
                this.firstSwapCell = null;
                return; // Kết thúc hàm execute, chờ người dùng chọn lại
            }

            // === Nếu hợp lệ, tiếp tục thực hiện swap ===
            this.logicManager.IsProcessing = true;
            await this.logicManager.swapCells(this.firstSwapCell, secondSwapCell);
            this.logicManager.triggerPostActionCheck();

            // === THÊM 2: GỬI TÍN HIỆU ĐỂ TẮT POPUP/SHADOW ===
            EventBus.emit(EventGame.TOOL_FINISHED, ToolType.SWAP);

            // Tự động hủy tool sau khi thực thi xong
            ToolManager.getInstance().deactivateCurrentTool();
        }
    }

    deactivate(): void {
        console.log("Swap Tool Deactivated");
        // Dọn dẹp nếu tool bị hủy giữa chừng
        if (this.firstSwapCell) {
            this.logicManager.cells[this.firstSwapCell.row]?.[this.firstSwapCell.col]?.cellUI.StopAnimationShake();
        }
        this.firstSwapCell = null;
    }
}