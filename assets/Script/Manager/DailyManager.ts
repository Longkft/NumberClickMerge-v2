import { _decorator, Component, game, Node } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { PopupManager } from './PopupManager';
import { DataManager } from '../Manager/DataManager'; // Import DataManager
import { Utils } from '../Utils/Utils';
import { MoneyController } from '../InGame/head/Money/MoneyController';

const { ccclass, property } = _decorator;

// Định nghĩa kiểu dữ liệu để dễ quản lý
interface IDailyBonusData {
    lastClaimTimestamp: number;
    currentDayIndex: number;
}

@ccclass('DailyManager')
export class DailyManager extends BaseSingleton<DailyManager> {

    private boundBeforeUnload: (event: BeforeUnloadEvent) => void;
    public _dailyData: IDailyBonusData = null;

    protected async onLoad(): Promise<void> {
        super.onLoad();
        this._dailyData = await DataManager.getInstance().getDailyBonusData();
        this.RegisEventBeforUnload();
        await this.checkAndShowDailyPopup();
    }

    protected onDestroy(): void {
        this.UnRegisEventBeforUnload();
    }

    RegisEventBeforUnload() {
        if (typeof window !== 'undefined') {
            // Lưu reference của function đã bind để dùng lại khi remove
            this.boundBeforeUnload = this.handleBeforeUnload.bind(this);
            window.addEventListener('beforeunload', this.boundBeforeUnload);
        }
        // Đăng ký sự kiện game hide/close
        game.on('hide', this.SaveGame.bind(this));
        game.on('close', this.SaveGame.bind(this));
    }

    UnRegisEventBeforUnload() {
        // Hủy đăng ký sự kiện
        if (typeof window !== 'undefined' && this.boundBeforeUnload) {
            window.removeEventListener('beforeunload', this.boundBeforeUnload);
        }
        game.off('hide', this.SaveGame.bind(this));
        game.off('close', this.SaveGame.bind(this));
    }

    private handleBeforeUnload(): void {
        this.SaveGame();
    }

    public SaveGame() {
        // Dữ liệu cần lưu là như nhau cho cả 2 chế độ
        MoneyController.getInstance().SaveGold();
        DataManager.getInstance().setDailyBonusData(this._dailyData);
    }

    async checkAndShowDailyPopup() {
        const dailyData = await DataManager.getInstance().getDailyBonusData();
        const now = Date.now();

        // Nếu chưa nhận bao giờ, hoặc đã sang ngày mới -> thì mới hiển thị popup
        if (dailyData.lastClaimTimestamp === 0 || !Utils.getInstance().isSameDay(dailyData.lastClaimTimestamp, now)) {
            PopupManager.getInstance().PopupDailyBonus.Show();
        }
    }
}