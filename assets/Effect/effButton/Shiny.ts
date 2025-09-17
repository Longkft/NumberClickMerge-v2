import { _decorator, Component, Sprite, Material, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shiny')
export class Shiny extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    @property({ type: Number, min: 0, max: 1, slide: true })
    shineWidth: number = 0.25;

    @property(Color)
    shineColor: Color = new Color(255, 255, 255, 128);

    @property({ type: Number, min: -90, max: 90, slide: true })
    shineAngle: number = 15;

    @property({ type: Number, min: 0.1, max: 10, slide: true })
    duration: number = 2; // thời gian shine chạy hết từ trái sang phải

    @property({ type: Number, min: 0, slide: true, tooltip: "Thời gian delay trước khi shine chạy lại từ đầu (giây)" })
    loopDelay: number = 1;

    @property({ tooltip: "Bật tắt lặp hiệu ứng shine" })
    isLooping: boolean = true;

    private elapsedTime: number = 0;
    private delayTime: number = 0;
    private isDelaying: boolean = false;

    private material: Material | null = null;

    start() {
        this.material = this.sprite.getMaterial(0);

        if (this.material) {
            // this.material.setProperty('shineColor', this.shineColor);
            this.material.setProperty('shineWidth', this.shineWidth);
            this.material.setProperty('shineAngle', this.shineAngle);
        }
    }

    update(dt: number) {
        if (!this.material) return;

        const slope = Math.tan((this.shineAngle * Math.PI) / 180);
        const extraDistance = Math.abs(slope); // mở rộng theo chiều y

        const totalDistance = 1 + this.shineWidth * 2 + extraDistance;
        const startPos = -this.shineWidth - extraDistance;
        const endPos = 1 + this.shineWidth + extraDistance;

        if (this.isDelaying) {
            // Delay giữa các lần chạy
            this.delayTime += dt;
            if (this.delayTime >= this.loopDelay) {
                this.elapsedTime = 0;
                this.delayTime = 0;
                this.isDelaying = false;
            }
        } else {
            this.elapsedTime += dt;

            let shinePosition = (this.elapsedTime / this.duration) * totalDistance + startPos;

            if (shinePosition > endPos) {
                shinePosition = endPos;

                if (this.isLooping) {
                    this.isDelaying = true;
                    this.delayTime = 0;
                }
            }

            this.material.setProperty('shinePosition', shinePosition);
        }

        // Cập nhật các thuộc tính luôn
        this.material.setProperty('shineWidth', this.shineWidth);
        this.material.setProperty('shineColor', this.shineColor);
        this.material.setProperty('shineAngle', this.shineAngle);
    }
}
