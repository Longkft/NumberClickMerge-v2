import { _decorator } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { IToolStrategy } from '../InGame/Tools/tools/IToolStrategy ';
import { HammerTool } from '../InGame/Tools/tools/Hammer';
import { Swap } from '../InGame/Tools/tools/Swap';
import { UpgradeOne } from '../InGame/Tools/tools/UpgradeOne';
import { RecycleAllMin } from '../InGame/Tools/tools/RecycleAllMin';
import { InGameLogicManager } from '../InGame/InGameLogicManager';

export enum ToolType {
    NONE,
    HAMMER,
    SWAP,
    UPGRADE,
    REMOVE_MIN
}

const { ccclass } = _decorator;

@ccclass('ToolManager')
export class ToolManager extends BaseSingleton<ToolManager> {
    private activeTool: IToolStrategy | null = null;
    private activeToolType: ToolType = ToolType.NONE;
    private toolMapping: Map<ToolType, IToolStrategy>;

    protected onLoad(): void {
        super.onLoad();
        this.toolMapping = new Map<ToolType, IToolStrategy>([
            [ToolType.HAMMER, new HammerTool()],
            [ToolType.SWAP, new Swap()],
            [ToolType.UPGRADE, new UpgradeOne()],
            [ToolType.REMOVE_MIN, new RecycleAllMin()],
        ]);
    }

    /**
     * Kích hoạt một tool. Được gọi từ các nút bấm trên UI.
     */
    public activateTool(type: ToolType) {
        if (InGameLogicManager.getInstance().IsProcessing && type !== ToolType.NONE) {
            console.log("Cannot activate tool while processing.");
            return;
        }

        // Nếu bấm vào tool đang active thì tắt nó đi
        if (this.activeToolType === type) {
            this.deactivateCurrentTool();
            return;
        }

        // Hủy tool cũ trước khi bật tool mới
        this.deactivateCurrentTool();

        // Kích hoạt tool mới
        this.activeTool = this.toolMapping.get(type) || null;
        this.activeToolType = type;
        if (this.activeTool) {
            this.activeTool.activate();
        }
    }

    /**
     * Hủy tool đang active.
     */
    public deactivateCurrentTool() {
        if (this.activeTool) {
            this.activeTool.deactivate();
            this.activeTool = null;
            this.activeToolType = ToolType.NONE;
        }
    }

    public getActiveTool(): IToolStrategy | null {
        return this.activeTool;
    }

    /**
     * Chuyển lệnh thực thi từ Cell đến tool đang active.
     */
    public useActiveToolOnCell(row: number, col: number) {
        if (this.activeTool) {
            this.activeTool.execute(row, col);
        }
    }
}