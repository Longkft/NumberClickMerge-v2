import { _decorator, Animation, Component, Layers, Node, tween, Vec3 } from 'cc';
import { BezierMove } from './BezierMove';
import { MoneyController } from '../InGame/head/Money/MoneyController';
import { BaseSingleton } from '../Base/BaseSingleton';
import { Utils } from '../Utils/Utils';

const { ccclass, property } = _decorator;

@ccclass('CoinEff')
export class CoinEff extends BaseSingleton<CoinEff> {

    @property({ type: Node })
    coin: Node = null;

    @property({ type: Node })
    coin1: Node = null;

    @property({ type: Node })
    coin2: Node = null;

    start() {
        // this.PlayCoins();
    }

    PlayCoins(): Promise<void> {
        return new Promise((resolve) => {
            const coins = [this.coin, this.coin1, this.coin2];
            const delayBetween = 0.5;
            const posB = MoneyController.getInstance().coinUi.worldPosition;

            const promises = coins.map((coin, index) => {
                return new Promise<void>((res) => {
                    this.scheduleOnce(async () => {
                        await this.playSingleCoin(coin, posB);
                        res();
                    }, delayBetween * index);
                });
            });

            Promise.all(promises).then(() => {
                Utils.getInstance().setCamLayer(this.node, Layers.Enum.DEFAULT);
                resolve()
            });
        });
    }


    playSingleCoin(coin: Node, target: Vec3): Promise<void> {
        return new Promise((resolve) => {
            const vec0 = new Vec3(0, 0, 0);
            coin.setWorldPosition(vec0);
            coin.active = true;

            this.scheduleOnce(() => {
                const anim = coin.getChildByName('coin')?.getComponent(Animation);
                anim?.defaultClip && anim.play();
            }, 0);

            const move = coin.getComponent(BezierMove);
            move?.moveAlongCurve(vec0, target, () => {
                tween(MoneyController.getInstance().node)
                    .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .to(0.1, { scale: new Vec3(1, 1, 1) })
                    .start();

                MoneyController.getInstance().moneyUi.activeEffGold();
                resolve(); // resolve khi tween xong
            });
        });
    }



}
