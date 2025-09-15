import { _decorator, Component, Node } from 'cc';
import { BaseSingleton } from '../../Base/BaseSingleton';
import { Utils } from '../../Utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('PopupNoAds')
export class PopupNoAds extends BaseSingleton<PopupNoAds> {

    show() {
        this.node.active = true;
    }
}


