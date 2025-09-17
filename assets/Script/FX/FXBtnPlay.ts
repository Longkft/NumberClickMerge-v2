import { _decorator, Component, log, Node, randomRangeInt, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FXBtnPlay')
export class FXBtnPlay extends Component {

    timeCurrent = 0
    duration = 5

    private _isPlaying: boolean = false;

    FXShake() {
        tween(this.node).to(0.5, { angle: -15 })
            .to(0.5, { angle: 15 })
            .to(0.5, { angle: 0 })
            .start()
    }


    FXScale() {
        if (this._isPlaying) return;
        this._isPlaying = true;

        Tween.stopAllByTarget(this.node)
        tween(this.node)
            .to(0.5, { scale: new Vec3(1.1, 1.1, 1.1) })
            .delay(0.3)
            .to(0.2, { scale: new Vec3(0.9, 0.9, 0.9) })
            .to(0.2, { scale: new Vec3(1.05, 1.05, 1.05) })
            .to(0.2, { scale: new Vec3(0.95, 0.95, 0.95) })
            .to(0.2, { scale: new Vec3(1.02, 1.02, 1.02) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                this._isPlaying = false;
            })
            .start()
    }


    protected update(dt: number): void {
        this.timeCurrent -= dt
        if (this.timeCurrent <= 0) {
            // let random = randomRangeInt(0, 2)
            // if (random == 0) this.FXShake()
            // else 
            log(this.node.name)
            this.FXScale()
            this.timeCurrent = this.duration
        }
    }
}


