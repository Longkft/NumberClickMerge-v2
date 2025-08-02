import { _decorator, Component, EventTouch, Label, Node, find, log, sys, Color } from 'cc';
import { BaseTouch } from '../Base/BaseTouch';
import { LanguageManager } from './LanguageManager';
import { DataManager } from '../Manager/DataManager';
const { ccclass, property } = _decorator;

@ccclass('BtnLanguage')
export class BtnLanguage extends BaseTouch {
    @property(Label)
    vi: Label = null!;
    @property(Label)
    en: Label = null!;

    // TouchStart(event: EventTouch): void {
    //     this.changeLanguage();
    // }

    protected onEnable(): void {
        this.updateText();
    }

    async changeLanguage() {
        await LanguageManager.getInstance().nextLanguage();
        this.updateLabelText();
        this.updateAllLocalizedText();
    }

    updateLabelText() {
        const lang = LanguageManager.getInstance().currentLang;
        let display = '';
        switch (lang) {
            case 'en': display = 'English'; break;
            case 'vi': display = 'Россия'; break;
            default: display = lang; break;
        }
        // this.label.string = `${display}`;
    }

    updateText() {
        const lang = LanguageManager.getInstance().currentLang;
        let color = new Color(56, 194, 60, 255);

        switch (lang) {
            case 'en': {
                this.en.color = color;
                this.vi.color = new Color(255, 255, 255, 255);
            }
                break;
            case 'vi': {
                this.vi.color = color;
                this.en.color = new Color(255, 255, 255, 255);
            }
                break;
        }
    }

    updateAllLocalizedText() {
        const root = find('Canvas');
        if (!root) return;

        const localizedLabels = root.getComponentsInChildren('LocalizedLabel');
        for (const lbl of localizedLabels) {
            (lbl as any).updateText();
        }
    }

    // start() {
    //     super.start();

    //     this.updateLabelText();


    // }

    async UpdateChangeEn() {
        await DataManager.getInstance().SetLanguage("en")
        let lang = await DataManager.getInstance().GetLanguage();
        await LanguageManager.getInstance().loadLanguage(lang);
        this.updateText();
        this.updateAllLocalizedText();
    }

    async UpdateChangeRu() {
        await DataManager.getInstance().SetLanguage("vi")
        let lang = await DataManager.getInstance().GetLanguage();
        await LanguageManager.getInstance().loadLanguage(lang);
        this.updateText();
        this.updateAllLocalizedText();
    }

}
