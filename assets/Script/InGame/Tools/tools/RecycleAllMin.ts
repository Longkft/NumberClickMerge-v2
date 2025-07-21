import { EventGame } from "../../../Enum/EEvent";
import { GameManager } from "../../../Manager/GameManager";
import { ToolManager } from "../../../Manager/ToolManager";
import { EventBus } from "../../../Utils/EventBus";
import { GridManager } from "../../GridManager";
import { InGameLogicManager } from "../../InGameLogicManager";
import { IToolStrategy } from "./IToolStrategy ";

export class RecycleAllMin implements IToolStrategy {
    activate(): void {
        // Tool này không cần người dùng click, nên sẽ tự thực thi ngay khi kích hoạt
        console.log("RemoveMin Tool Activated & Executing");
        this.execute(-1, -1); // Tọa độ không quan trọng
    }

    async execute(row: number, col: number): Promise<void> {
        const logicManager = InGameLogicManager.getInstance();
        logicManager.IsProcessing = true;

        await logicManager.removeAllMinCellsTools();

        EventBus.emit(EventGame.TOOL_FINISHED);
        ToolManager.getInstance().deactivateCurrentTool();
    }

    deactivate(): void {
        console.log("RemoveMin Tool Deactivated");
    }

}