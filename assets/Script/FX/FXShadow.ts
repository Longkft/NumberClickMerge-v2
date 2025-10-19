import { _decorator, Component, find, log, Node, Tween, tween, UIOpacity, Vec3 } from 'cc';
import { AutoComponent } from '../Base/AutoComponent';
const { ccclass, property } = _decorator;

@ccclass('FXShadow')
export class FXShadow extends AutoComponent {

    @property({ type: UIOpacity })
    shadow: UIOpacity = null;

    ShowFxShadow(): Promise<void> {
        return new Promise((resolve) => {
            this.node.children.forEach(element => {
                element.active = false;
            });

            Tween.stopAllByTarget(this.node);
            Tween.stopAllByTarget(this.shadow);

            this.shadow.node.active = true;
            this.shadow.opacity = 155;
            tween(this.shadow)
                .to(0.2, { opacity: 255 }, { easing: 'quadInOut' })
                .call(() => {
                    resolve();
                })
                .start();
        })
    }

    HideFXShadow(): Promise<void> {
        return new Promise((resolve) => {
            Tween.stopAllByTarget(this.node);
            Tween.stopAllByTarget(this.shadow);
            tween(this.shadow)
                .to(0.2, { opacity: 0 }, { easing: 'quadInOut' })
                .call(() => {
                    this.shadow.node.active = false;
                    resolve();
                })
                .start();
        })
    }

    ShowFxGuide(guide: Node): Promise<void> {
        return new Promise((resolve) => {
            guide.children.forEach((element) => {
                element.active = false;
            })
            Tween.stopAllByTarget(guide);
            guide.active = true;

            const blockNode = guide.getChildByName('block');
            if (blockNode) {
                blockNode.active = true;
            }

            const posLocal = guide.getPosition().clone();
            guide.setPosition(-1080, posLocal.y, posLocal.z);
            tween(guide)
                .to(0.2, { position: new Vec3(0, posLocal.y, posLocal.z) })
                .call(() => {
                    resolve();
                })
                .start();
        })
    }

    HideFxGuide(guide: Node): Promise<void> {
        return new Promise((resolve) => {
            log(guide)
            Tween.stopAllByTarget(guide);
            const posLocal = guide.getPosition().clone();

            tween(guide)
                .to(0.2, { position: new Vec3(-1080, posLocal.y, posLocal.z) })
                .call(() => {
                    guide.active = false;
                    const blockNode = guide.getChildByName('block');
                    if (blockNode) {
                        blockNode.active = false;
                    }
                    resolve();
                })
                .start();
        })
    }

    ShowFxBox(guide: Node): Promise<void> {
        return new Promise((resolve) => {
            Tween.stopAllByTarget(guide);
            guide.active = true;
            const posLocal = guide.getPosition().clone();
            guide.setPosition(-1080, posLocal.y, posLocal.z);
            tween(guide)
                .to(0.2, { position: new Vec3(0, posLocal.y, posLocal.z) })
                .call(() => {
                    resolve();
                })
                .start();
        })
    }

    HideFxBox(guide: Node): Promise<void> {
        return new Promise((resolve) => {
            Tween.stopAllByTarget(guide);
            const posLocal = guide.getPosition().clone();
            tween(guide)
                .to(0.2, { position: new Vec3(1080, posLocal.y, posLocal.z) })
                .call(() => {
                    guide.active = false;
                    resolve();
                })
                .start();
        })
    }
}


