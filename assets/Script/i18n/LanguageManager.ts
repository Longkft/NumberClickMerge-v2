import { _decorator, Component, JsonAsset, Node, resources, sys } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { DataManager } from '../Manager/DataManager';
const { ccclass, property } = _decorator;

@ccclass('LanguageManager')
export class LanguageManager extends BaseSingleton<LanguageManager> {

    private _data: Record<string, string> = {};
    private _currentLang: string = 'en';

    private _supportedLangs = ['en', 'vi'];

    public async init() {
        // let savedLang = await DataManager.getInstance().GetLanguage();
        // if (savedLang != 'vi') {
        // DataManager.getInstance().SetLanguage("en")
        // }

        // savedLang = await DataManager.getInstance().GetLanguage();

        await this.loadLanguage(this._currentLang);
    }

    public async loadLanguage(lang: string): Promise<void> {
        this._currentLang = lang;
        return new Promise((resolve, reject) => {
            resources.load(`i18n/${lang}`, JsonAsset, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._data = asset.json;
                // sys.localStorage.setItem('lang', lang);
                DataManager.getInstance().SetLanguage(lang)
                resolve();
            });
        });
    }

    public t(key: string): string {
        return this._data[key] || key;
    }

    public get currentLang(): string {
        return this._currentLang;
    }

    public nextLanguage(): Promise<void> {
        const currentIndex = this._supportedLangs.indexOf(this._currentLang);
        const nextIndex = (currentIndex + 1) % this._supportedLangs.length;
        return this.loadLanguage(this._supportedLangs[nextIndex]);
    }
}


