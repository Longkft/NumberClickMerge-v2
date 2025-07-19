import { _decorator, Component, log, Node } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
import { DataManager } from '../Manager/DataManager';
import { InGameLogicManager } from '../InGame/InGameLogicManager';
const { ccclass, property } = _decorator;

@ccclass('Utils')
export class Utils extends BaseSingleton<Utils> {


    //#region Heart
    LoadHeartGameDefault() {
        let heart = InGameLogicManager.getInstance().currentHeart;

        InGameLogicManager.getInstance().currentHeart = heart;
    }

    UpdateHeart(subtraction: number) { // subtraction là hiệu (cộng hoặc trừ)
        let heart = InGameLogicManager.getInstance().currentHeart;
        console.log(heart)
        let newHeart = heart + subtraction;
        if (newHeart < 0 || newHeart > 5) return;
        console.log("new heart", newHeart)
        InGameLogicManager.getInstance().currentHeart = newHeart;
    }

    ResetHeart(subtraction: number) {
        if (subtraction < 0 || subtraction > 5) return;

        InGameLogicManager.getInstance().currentHeart = subtraction;
    }

    //#region AdsManager
    ShowAdsReward(call?: CallableFunction) {
        if (typeof call === 'function') {
            call();
        }
    }

    //#region set cam
    setCamLayer(rootNode: Node, layer: number): void {
        if (!rootNode) return;
        rootNode.layer = layer;
        for (const child of rootNode.children) {
            this.setCamLayer(child, layer);
        }
    }

}

