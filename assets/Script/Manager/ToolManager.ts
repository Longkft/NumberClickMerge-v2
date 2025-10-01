import { _decorator, director, log } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { IToolStrategy } from '../InGame/Tools/tools/IToolStrategy';
import { HammerTool } from '../InGame/Tools/tools/Hammer';
import { Swap } from '../InGame/Tools/tools/Swap';
import { UpgradeOne } from '../InGame/Tools/tools/UpgradeOne';
import { RecycleAllMin } from '../InGame/Tools/tools/RecycleAllMin';
import { InGameLogicManager } from '../InGame/InGameLogicManager';
import { ToolProgress } from '../InGame/Tools/ToolProgress';
import { DataManager } from './DataManager';
import { Config } from '../Config';
import { EventGame } from '../Enum/EEvent';

export enum ToolType {
    HAMMER,
    SWAP,
    REMOVE_MIN,
    UPGRADE,
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

    isShowHint: boolean = false;

    isClick: boolean = false;

    // numberPoint: number = 1;

    private toolInUse: boolean = false;

    public isToolInUse(): boolean {
        return this.toolInUse;
    }

    public setToolInUse(value: boolean) {
        this.toolInUse = value;
    }

    protected async onLoad() {
        super.onLoad();



        this.toolMapping = new Map<ToolType, IToolStrategy>([
            [ToolType.HAMMER, new HammerTool()],
            [ToolType.SWAP, new Swap()],
            [ToolType.UPGRADE, new UpgradeOne()],
            [ToolType.REMOVE_MIN, new RecycleAllMin()],
        ]);

    }

    async GetToolGame() {
        await this.initialize();
    }

    public async initialize() {
        this.toolProgress = await DataManager.getInstance().GetToolProgress();
    }

    public async triggerRandomToolUpgrade(): Promise<ToolType | null> {
        // 1. Lấy danh sách các tool đủ điều kiện
        const eligibleTools = this.getEligibleToolsForUpgrade();
        if (eligibleTools.length === 0) {
            return null; // Trả về null để báo hiệu không có tool nào được chọn
        }
        const chosenTool: ToolType = eligibleTools[0]; // chọn cái đầu tiên
        this.upgradeTool(chosenTool);
        this.chooseTool = chosenTool;
    }

    private getEligibleToolsForUpgrade(): ToolType[] {
        const allToolValues: ToolType[] = [
            ToolType.HAMMER,
            ToolType.SWAP,
            ToolType.REMOVE_MIN,
            ToolType.UPGRADE
        ];
        const toolsCanUpgrade = allToolValues.filter(toolType => {
            const progress = this.toolProgress[toolType.toString()];
            return progress && progress.points < Config.numberPointUpLv;
        });
        return toolsCanUpgrade;
    }


    private upgradeTool(toolType: ToolType): void {
        const progress = this.toolProgress[toolType];
        if (!progress) return;
        progress.points++;
        const totalPointsAfter = Object.keys(this.toolProgress).map(key => this.toolProgress[key]).reduce((sum, tool) => sum + tool.points, 0);
        if (totalPointsAfter === 1) {
            this.isShowHint = true;
        }
        if (progress.points === Config.numberPointUpLv && !progress.isUpgraded) {
            progress.isUpgraded = true;
        }
    }

    ShowHint() {

    }

    async SetToolState() {
        await DataManager.getInstance().SetToolProgress(this.toolProgress);
    }

    public getToolState(toolType: ToolType): ToolProgress | null {
        return this.toolProgress[toolType] ?? null;
    }

    public activateTool(type: ToolType) {
        if (InGameLogicManager.getInstance().IsProcessing && type !== ToolType.NONE) {
            return;
        }
        // if (this.activeToolType === type) {
        //     this.deactivateCurrentTool();
        //     return;
        // }
        // this.deactivateCurrentTool();
        this.activeTool = this.toolMapping.get(type) || null;
        this.activeToolType = type;
        if (this.activeTool) {
            this.activeTool.activate();
        }
    }

    public deactivateCurrentTool() {
        if (this.activeTool) {
            this.activeTool.deactivate();
            this.activeTool = null;
            this.activeToolType = ToolType.NONE;

            // director.emit(EventGame.TOOL_DEACTIVATED);
        }
    }

    public getActiveTool(): IToolStrategy | null {
        return this.activeTool;
    }

    public useActiveToolOnCell(row: number, col: number) {
        if (this.activeTool) {
            const toolState = this.getToolState(this.activeToolType);
            this.activeTool.execute(row, col, toolState);
        }
    }

    SetIsClick() {
        this.scheduleOnce(() => {
            this.isClick = false;
        }, 0.3)
    }
}