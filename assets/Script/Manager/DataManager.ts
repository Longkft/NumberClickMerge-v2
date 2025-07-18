import { _decorator, Component, Node, sys } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends BaseSingleton<DataManager> {

    // #region FirstGame
    public get FirstGame(): boolean {
        const saved = localStorage.getItem("firstGame");
        return saved !== null && saved === 'false' ? false : true;
    }

    public set FirstGame(value: boolean) {
        localStorage.setItem("firstGame", value.toString());
    }

    // #region My Heart
    public get MyHeart(): number {
        const saved = localStorage.getItem("myHeart");
        return saved !== null ? parseInt(saved) : 5;
    }

    public set MyHeart(value: number) {
        if (value > 5) return;

        localStorage.setItem("myHeart", value.toString());
    }

    // #region NumberMax
    public get NumberMax(): number {
        const saved = localStorage.getItem("numberMax");
        return saved !== null ? parseInt(saved) : 8;
    }

    public set NumberMax(value: number) {
        localStorage.setItem("numberMax", value.toString());
    }

    // #region numberMin
    public get NumberMin(): number {
        const saved = localStorage.getItem("numberMin");
        return saved !== null ? parseInt(saved) : 1;
    }

    public set NumberMin(value: number) {
        localStorage.setItem("numberMin", value.toString());
    }

    // #region language
    public get Language(): string {
        const saved = localStorage.getItem("language");
        return saved ? saved : sys.language;
    }

    public set Language(value: string) {
        localStorage.setItem("language", value.toString());
    }

    // #region HighScore
    public get highScore(): number {
        const saved = localStorage.getItem("highScore");
        return saved ? parseInt(saved) : 0;
    }

    public set highScore(value: number) {
        localStorage.setItem("highScore", value.toString());
    }

    // #region CoreInPlayGame
    public get CoreInPlayGame(): number {
        const saved = localStorage.getItem("CoreInPlayGame");
        return saved ? parseInt(saved) : 0;
    }

    public set CoreInPlayGame(value: number) {
        localStorage.setItem("CoreInPlayGame", value.toString());
    }

    // #region gold
    public async GetGold() {
        return await this.getLocale("Gold")
    }

    public async SetGold(value: number) {
        await this.saveLocale("Gold", value)
    }

    // #region DataMusic
    public async GetDataMusic() {
        return await this.getLocale("DataMusic")
    }

    public async SetDataMusic(value: boolean) {
        await this.saveLocale("DataMusic", value)
    }

    // #region DataSound
    public async GetDataSound() {
        return await this.getLocale("DataSound")
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


