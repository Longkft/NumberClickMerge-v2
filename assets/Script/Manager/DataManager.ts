import { _decorator, Component, log, Node, sys } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { ToolProgress } from '../InGame/Tools/ToolProgress';
import { ToolType } from './ToolManager';
import { GameMode } from '../Enum/Enum';
import { GridManager } from '../InGame/GridManager';
import { Config } from '../Config';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends BaseSingleton<DataManager> {

    _scenePlay: boolean = false;

    // #region My Heart
    public async GetMyHeart() {
        const saved = await this.getLocale("myHeart");
        return saved == null ? 5 : saved
    }

    public async SetMyHeart(value: number) {
        if (value > 5) return;
        this.saveLocale("myHeart", value)
    }

    // #region language
    public async GetLanguage() {

        const saved = await this.getLocaleShared("language")
        return saved ? saved : sys.language;
    }

    public async SetLanguage(value: string) {
        await this.saveLocaleShared("language", value)
    }

    // #region HighScore
    public async GethighScoreMenu(gameMode: GameMode) {
        const saved = await this.getLocaleShared(`highScore` + `${Config.keyGame}` + `${gameMode}`)
        return (saved == null || saved == undefined) ? null : JSON.parse(saved);
    }

    public async GethighScore() {
        const saved = await this.getLocale("highScore")
        return saved == null ? 0 : saved
    }

    public async SethighScore(value: number) {
        await this.saveLocale("highScore", value)

    }

    // #region CoreInPlayGame
    public async GetCoreInPlayGame() {
        const saved = await this.getLocale("CoreInPlayGame")
        return saved ? parseInt(saved) : 0;
    }

    public async SetCoreInPlayGame(value: number) {
        await this.saveLocale("CoreInPlayGame", value)
    }

    // #region gold
    public async GetGold() {
        const saved = await this.getLocaleShared("Gold")
        return saved == null ? 100000000000: saved

    }

    public async SetGold(value: number) {
        await this.saveLocaleShared("Gold", value)
    }

    // #region first
    public async GetFirst() {
        const saved = await this.getLocale("First")
        return saved == null ? true : saved;
    }

    public async SetFirst(value: boolean) {
        await this.saveLocale("First", value)

    }

    // #region DataMusic
    public async GetDataMusic() {
        const saved = await this.getLocale("DataMusic")
        return saved == null ? true : saved;
    }

    public async SetDataMusic(value: boolean) {
        await this.saveLocale("DataMusic", value)
    }

    // #region DataSound
    public async GetDataSound() {
        const saved = await this.getLocale("DataSound")
        return saved == null ? true : saved;
    }

    public async SetDataSound(value: boolean) {
        await this.saveLocale("DataSound", value)
    }

    // Lưu trạng thái game
    public async SaveGameState(gameState: any) {
        await this.saveLocale(`gameState`, gameState)
    }

    // Tải trạng thái game
    public async LoadGameState(): Promise<any> {
        return await this.getLocale(`gameState`)
    }

    // Xóa trạng thái game
    public clearGameState() {
        this.removeData("gameState")
    }

    // #region Tool Progress
    public async GetToolProgress(): Promise<Record<string, ToolProgress>> {
        const saved = await this.getLocale("ToolProgress");

        if (saved && Object.keys(saved).length === 0 || !saved) {
            return {
                [ToolType.HAMMER]: { points: 0, isUpgraded: false },
                [ToolType.SWAP]: { points: 0, isUpgraded: false },
                [ToolType.UPGRADE]: { points: 0, isUpgraded: false },
                [ToolType.REMOVE_MIN]: { points: 0, isUpgraded: false },
            };
        }
        return saved;
    }

    public async SetToolProgress(progress: Record<string, ToolProgress>) {
        await this.saveLocale("ToolProgress", progress);
    }
    // #endregion

    // #region TotalExp
    public async GetTotalExp() {
        const saved = await this.getLocale("TotalExp");
        return saved == null ? 0 : Number(saved);
    }

    public async SetTotalExp(value: number) {
        await this.saveLocale("TotalExp", value);
    }

    // #region Daily Bonus
    public async getDailyBonusData(): Promise<{ lastClaimTimestamp: number, currentDayIndex: number }> {
        const saved = await this.getLocaleShared("DailyBonusData");
        // Nếu không có dữ liệu, trả về giá trị mặc định cho lần đầu tiên
        if (!saved) {
            return { lastClaimTimestamp: 0, currentDayIndex: 0 };
        }
        return saved;
    }

    public async setDailyBonusData(data: { lastClaimTimestamp: number, currentDayIndex: number }) {
        await this.saveLocaleShared("DailyBonusData", data);
    }
    // #endregion

    public async saveLocale(key, value) {
        await localStorage.setItem(key + `${Config.keyGame}` + `${GridManager.getInstance().GameMode}`, JSON.stringify(value));
    }

    public async getLocale(key) {

        // let saved = await localStorage.getItem(key)
        // console.log(key)
        // console.log(JSON.parse(saved))
        // return (saved == null || saved == undefined) ? null : JSON.parse(saved);

        try {
            let saved = await localStorage.getItem(key + `${Config.keyGame}` + `${GridManager.getInstance().GameMode}`);
            return (saved == null || saved == undefined) ? null : JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }

    public async removeData(key) {
        await localStorage.removeItem(key + `${Config.keyGame}` + `${GridManager.getInstance().GameMode}`);
    }

    public async getLocaleShared(key) {
        try {
            let saved = await localStorage.getItem(key + `${Config.keyGame}`);
            return (saved == null || saved == undefined) ? null : JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }

    public async saveLocaleShared(key, value) {
        await localStorage.setItem(key + `${Config.keyGame}`, JSON.stringify(value));
    }
}


