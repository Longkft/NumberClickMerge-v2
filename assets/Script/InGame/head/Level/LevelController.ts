import { _decorator, Component, director, log, Node } from 'cc';
import { LevelUI } from './LevelUI';
import { DataManager } from '../../../Manager/DataManager';
import { BaseSingleton } from '../../../Base/BaseSingleton';
import { EventBus } from '../../../Utils/EventBus';
import { EventGame } from '../../../Enum/EEvent';
import { Utils } from '../../../Utils/Utils';
import { PopupManager } from '../../../Manager/PopupManager';
import { ToolManager, ToolType } from '../../../Manager/ToolManager';

const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends BaseSingleton<LevelController> {

    @property({ type: LevelUI })
    levelUi: LevelUI = null;

    newTotalExp: number = 0;

    onLoad() {
        super.onLoad();
        // Tên sự kiện nên là ADD_EXP để rõ ràng hơn
        director.on(EventGame.EXP_UPDATED, this.onAddExp, this);
    }

    onDestroy() {
        super.onDestroy();
        director.off(EventGame.EXP_UPDATED, this.onAddExp);
    }

    async start() {
        // Lấy tổng EXP và thiết lập giao diện ban đầu
        const totalExp = await DataManager.getInstance().GetTotalExp();
        this.newTotalExp = totalExp;
        const levelInfo = Utils.getLevelInfo(totalExp);
        this.levelUi.initializeView(levelInfo);
    }

    private async onAddExp(expGained: number) {
        if (expGained <= 0) return;

        const ratioLevel = 1;

        // 1. Lấy dữ liệu cũ
        const oldTotalExp = this.newTotalExp;
        const oldLevelInfo = Utils.getLevelInfo(oldTotalExp);

        // 2. Tính toán và lưu dữ liệu mới
        this.newTotalExp = oldTotalExp + expGained;

        const newLevelInfo = Utils.getLevelInfo(this.newTotalExp);

        // 3. Ra lệnh cho UI cập nhật với cả thông tin cũ và mới để tạo animation
        this.levelUi.updateView(oldLevelInfo, newLevelInfo);

        // ToolManager.getInstance().chooseTool = ToolType.NONE;

        if (newLevelInfo.level > oldLevelInfo.level) {
            if (newLevelInfo.level % ratioLevel == 0) {
                ToolManager.getInstance().triggerRandomToolUpgrade();
            }

            PopupManager.getInstance().PopupLevelUp.show(newLevelInfo.level);
        }
    }

    SaveTotalExp() {
        DataManager.getInstance().SetTotalExp(this.newTotalExp);
    }
}


