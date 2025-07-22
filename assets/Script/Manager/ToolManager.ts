import { _decorator, log } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { IToolStrategy } from '../InGame/Tools/tools/IToolStrategy';
import { HammerTool } from '../InGame/Tools/tools/Hammer';
import { Swap } from '../InGame/Tools/tools/Swap';
import { UpgradeOne } from '../InGame/Tools/tools/UpgradeOne';
import { RecycleAllMin } from '../InGame/Tools/tools/RecycleAllMin';
import { InGameLogicManager } from '../InGame/InGameLogicManager';
import { ToolProgress } from '../InGame/Tools/ToolProgress';
import { DataManager } from './DataManager';

export enum ToolType {
    HAMMER,
    SWAP,
    UPGRADE,
    REMOVE_MIN,
    NONE
}

const { ccclass } = _decorator;

@ccclass('ToolManager')
export class ToolManager extends BaseSingleton<ToolManager> {
    private activeTool: IToolStrategy | null = null;
    private activeToolType: ToolType = ToolType.NONE;
    private toolMapping: Map<ToolType, IToolStrategy>;

    private toolProgress: Record<string, ToolProgress> = {};
    chooseTool: ToolType = null;

    protected async onLoad() {
        super.onLoad();
        this.toolMapping = new Map<ToolType, IToolStrategy>([
            [ToolType.HAMMER, new HammerTool()],
            [ToolType.SWAP, new Swap()],
            [ToolType.UPGRADE, new UpgradeOne()],
            [ToolType.REMOVE_MIN, new RecycleAllMin()],
        ]);

        console.log('ToolType:', ToolType);
    }

    async GetToolGame() {
        await this.initialize();

        log('GetToolGame')
    }

    public async initialize() {
        this.toolProgress = await DataManager.getInstance().GetToolProgress();
        console.log("this.toolProgress:", this.toolProgress);
    }

    public async triggerRandomToolUpgrade(): Promise<ToolType | null> {
        // 1. Lấy danh sách các tool đủ điều kiện
        const eligibleTools = this.getEligibleToolsForUpgrade();

        log('eligibleTools: ', eligibleTools)

        if (eligibleTools.length === 0) {
            console.log("Tất cả các tool đã được nâng cấp tối đa!");
            return null; // Trả về null để báo hiệu không có tool nào được chọn
        }

        // 2. Random chọn 1 tool
        const randomIndex = Math.floor(Math.random() * eligibleTools.length);
        const chosenTool: ToolType = eligibleTools[randomIndex];

        // 3. Thực hiện nâng cấp điểm
        this.upgradeTool(chosenTool);

        this.chooseTool = chosenTool;
    }

    private getEligibleToolsForUpgrade(): ToolType[] {
        const allToolValues: ToolType[] = [
            ToolType.HAMMER,
            ToolType.SWAP,
            ToolType.UPGRADE,
            ToolType.REMOVE_MIN
        ];

        const toolsCanUpgrade = allToolValues.filter(toolType => {
            const progress = this.toolProgress[toolType.toString()];
            return progress && progress.points < 5;
        });

        log('toolsCanUpgrade: ', toolsCanUpgrade);
        return toolsCanUpgrade;
    }


    private upgradeTool(toolType: ToolType): void {
        const progress = this.toolProgress[toolType];
        if (!progress) return;

        progress.points++;
        console.log(`Tool ${ToolType[toolType]} được cộng 1 điểm, tổng điểm hiện tại: ${progress.points}`);

        if (progress.points === 5 && !progress.isUpgraded) {
            progress.isUpgraded = true;
            console.log(`--- TOOL ${ToolType[toolType]} ĐÃ ĐƯỢC NÂNG CẤP! ---`);
            // Có thể phát thêm sự kiện tại đây nếu cần
            // EventBus.emit(EventGame.TOOL_LEVELED_UP, toolType);
        }
    }

    async SetToolState() {
        log(this.toolProgress)
        await DataManager.getInstance().SetToolProgress(this.toolProgress);
    }

    /**
     * Lấy trạng thái hiện tại của một tool
     */
    public getToolState(toolType: ToolType): ToolProgress | null {
        return this.toolProgress[toolType] ?? null;
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
            // 1. Lấy trạng thái của tool đang được kích hoạt
            const toolState = this.getToolState(this.activeToolType);

            this.activeTool.execute(row, col, toolState);
        }
    }
}