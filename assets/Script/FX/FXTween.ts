import { _decorator, Component, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
import { BaseSingleton } from '../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('FXTween')
export class FXTween extends BaseSingleton<FXTween> {

    async FxTween(node: Node) { // set tween label err ads
        node.active = true;
        Tween.stopAllByTarget(node);

        let uiOpa = node.getComponent(UIOpacity);
        Tween.stopAllByTarget(uiOpa);

        let pos = new Vec3(0, -100, 0);
        node.setPosition(pos);

        let scale = new Vec3(0.7, 0.7, 0.7);
        node.setScale(scale);

        uiOpa.opacity = 255 / 2;

        // Các tween chạy song song, chờ Promise.all
        const tweenScale = new Promise<void>((resolve) => {
            tween(node)
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    resolve();
                })
                .start();
        });

        const tweenOpacity = new Promise<void>((resolve) => {
            tween(uiOpa)
                .to(0.3, { opacity: 255 })
                .call(() => {
                    resolve();
                })
                .start();
        });

        const tweenPosition = new Promise<void>((resolve) => {
            tween(node)
                .to(0.3, { position: new Vec3(0, 0, 0) })
                .call(() => {
                    resolve();
                })
                .start();
        });

        await Promise.all([tweenScale, tweenOpacity, tweenPosition])
            .then(async () => {
                Tween.stopAllByTarget(node);

                let uiOpa = node.getComponent(UIOpacity);
                Tween.stopAllByTarget(uiOpa);

                await this.AwaitTime(1);

                node.active = false;
            });
    }

    async AwaitTime(time) {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, time * 1000)
        });
    }
}


