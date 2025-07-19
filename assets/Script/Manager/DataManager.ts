import { _decorator, Component, Node, sys } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends BaseSingleton<DataManager> {

    // #region FirstGame
    // public get FirstGame(): boolean {
    //     const saved = localStorage.getItem("firstGame");
    //     return saved !== null && saved === 'false' ? false : true;
    // }

    // public set FirstGame(value: boolean) {
    //     localStorage.setItem("firstGame", value.toString());
    // }

    // #region My Heart
    public async GetMyHeart() {
        const saved = await this.getLocale("myHeart");
        return saved !== null ? parseInt(saved) : 5;
    }

    public async SetMyHeart(value: number) {
        if (value > 5) return;
        this.saveLocale("myHeart", value)
    }

    // // #region NumberMax
    // public async GetNumberMax() {
    //     const saved = await this.getLocale("numberMax");
    //     return saved !== null ? parseInt(saved) : 8;
    // }

    // public set NumberMax(value: number) {
    //     localStorage.setItem("numberMax", value.toString());
    // }

    // // #region numberMin
    // public get NumberMin(): number {
    //     const saved = localStorage.getItem("numberMin");
    //     return saved !== null ? parseInt(saved) : 1;
    // }

    // public set NumberMin(value: number) {
    //     localStorage.setItem("numberMin", value.toString());
    // }

    // #region language
    public get Language(): string {
        const saved = localStorage.getItem("language");
        return saved ? saved : sys.language;
    }

    public set Language(value: string) {
        localStorage.setItem("language", value.toString());
    }

    // #region HighScore
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
        const saved = await this.getLocale("Gold")
        return saved == null ? 0 : saved

    }

    public async SetGold(value: number) {
        await this.saveLocale("Gold", value)
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
        await this.saveLocale("gameState", gameState)
    }

    // Tải trạng thái game
    public async LoadGameState(): Promise<any> {
        return await this.getLocale("gameState")
    }

    // Xóa trạng thái game
    public clearGameState() {
        this.removeData("gameState")
    }

    // #region Level
    public async getLevel() {
        return await this.getLocale("DataLevel")
    }

    public async setLevel(level: number, bar: number, exp: number) {
        let obj = {
            level: level,
            bar: bar,
            exp: exp,
        };

        await this.saveLocale("DataLevel", obj)
    }


    public async saveLocale(key, value) {
        await localStorage.setItem(key, JSON.stringify(value));
    }

    public async getLocale(key) {
        let saved = await localStorage.getItem(key)
        return saved ? JSON.parse(saved) : null;
    }


    public async removeData(key) {
        await localStorage.removeItem(key);
    }
}


