import { _decorator, Component, Node } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { PopupManager } from './PopupManager';
const { ccclass, property } = _decorator;

@ccclass('DailyManager')
export class DailyManager extends BaseSingleton<DailyManager> {

    protected onLoad(): void {
        super.onLoad();

        PopupManager.getInstance().PopupDailyBonus.Show();
    }
}


