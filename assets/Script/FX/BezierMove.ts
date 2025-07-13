import { _decorator, Component, Node, Vec3, tween, UITransform, log, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BezierMove')
export class BezierMove extends Component {

    @property({ type: Vec3 })
    posStart: Vec3 = new Vec3(0, 0, 0);

    initPositionDefault: Vec3;
    protected start(): void {
        // this.initPositionDefault = this.node.worldPosition.clone();
    }

    moveAlongCurve(posStart: Vec3 = new Vec3(0, 0, 0), posB: Vec3, call?: CallableFunction, height: number = 300, duration: number = 1.5) {

        this.initPositionDefault = this.node.parent.getComponent(UITransform).convertToWorldSpaceAR(posStart);
        let posA = this.initPositionDefault.clone();
        const control = this.getCircularControlPoint(posA, posB, height);

        tween(this.node)
            .to(duration, { scale: new Vec3(1, 1, 1) })
            .start();

        tween({ t: 0 })
            .to(duration, { t: 1 }, {
                easing: 'circIn',
                onUpdate: (obj) => {
                    const t = obj.t;

                    // Bezier bậc 2
                    const x = (1 - t) * (1 - t) * posA.x + 2 * (1 - t) * t * control.x + t * t * posB.x;
                    const y = (1 - t) * (1 - t) * posA.y + 2 * (1 - t) * t * control.y + t * t * posB.y;
                    const z = (1 - t) * (1 - t) * posA.z + 2 * (1 - t) * t * control.z + t * t * posB.z;

                    const worldPos = new Vec3(x, y, z);

                    this.node.setWorldPosition(worldPos);
                }
            })
            .call(() => {
                this.node.active = false;
                call();
            })
            .start();
    }

    /**
     * Tính điểm control sao cho A–control–B nằm trên một cung tròn
     */
    private getCircularControlPoint(a: Vec3, b: Vec3, height: number): Vec3 {
        const mid = a.clone().add(b).multiplyScalar(0.5);

        const ab = b.clone().subtract(a);

        // Vector vuông góc (trên mặt phẳng XY) — xoay 90 độ ngược (lõm qua phải)
        const normal = new Vec3(ab.y, -ab.x, 0).normalize();

        return mid.add(normal.multiplyScalar(height));
    }


    resetData() {
        // Tween.stopAllByTarget(this.node)
        this.node.active = true;
        this.node.setScale(1, 1, 1);
        this.node.position = this.posStart;
    }

}