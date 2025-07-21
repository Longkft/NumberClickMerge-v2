import { _decorator, Component, Node } from 'cc';
import { LevelUI } from './LevelUI';
import { DataManager } from '../../../Manager/DataManager';
import { BaseSingleton } from '../../../Base/BaseSingleton';
import { EventBus } from '../../../Utils/EventBus';
import { EventGame } from '../../../Enum/EEvent';
import { Utils } from '../../../Utils/Utils';

const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends BaseSingleton<LevelController> {

    @property({ type: LevelUI })
    levelUi: LevelUI = null;

    newTotalExp: number = 0;

    onLoad() {
        // Tên sự kiện nên là ADD_EXP để rõ ràng hơn
        EventBus.on(EventGame.EXP_UPDATED, this.onAddExp, this);
    }

    onDestroy() {
        EventBus.off(EventGame.EXP_UPDATED, this.onAddExp);
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

        // 1. Lấy dữ liệu cũ
        const oldTotalExp = this.newTotalExp;
        const oldLevelInfo = Utils.getLevelInfo(oldTotalExp);

        // 2. Tính toán và lưu dữ liệu mới
        this.newTotalExp = oldTotalExp + expGained;

        const newLevelInfo = Utils.getLevelInfo(this.newTotalExp);

        // 3. Ra lệnh cho UI cập nhật với cả thông tin cũ và mới để tạo animation
        this.levelUi.updateView(oldLevelInfo, newLevelInfo);
    }

    SaveTotalExp() {
        DataManager.getInstance().SetTotalExp(this.newTotalExp);
    }
}


