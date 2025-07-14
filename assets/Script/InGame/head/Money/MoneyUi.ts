import { _decorator, Component, Label, Node, tween } from 'cc';
import { AutoComponent } from '../../../Base/AutoComponent';
import { EventBus } from '../../../Utils/EventBus';
import { EventGame } from '../../../Enum/EEvent';
import { CoinEff } from '../../../FX/CoinEff';
const { ccclass, property } = _decorator;

@ccclass('MoneyUi')
export class MoneyUi extends AutoComponent {

    @property({ type: Label })
    gold: Label = null;

    @property({ type: Node })
    effGold: Node = null;

    SetCoin(gold: number) {
        this.gold.string = gold.toString();
    }

    // public async AnimationMoneyChange(oldGold: number, newGold: number, label: Label) {
    //     if (oldGold === newGold) {
    //         label.string = `${newGold}`;
    //         return;
    //     }

    //     const goldsTweenObj = { value: oldGold };
    //     const delta = newGold - oldGold;

    //     // Tính thời gian tween theo độ chênh lệch (tối đa 1.5s, tối thiểu 0.3s)
    //     const duration = Math.min(1.5, Math.max(0.3, delta * 0.02));

    //     if (newGold > oldGold) {
    //         await CoinEff.getInstance().PlayCoins();
    //     }

    //     tween(goldsTweenObj)
    //         .to(duration, { value: newGold }, {
    //             onUpdate: () => {
    //                 // Cập nhật label hiển thị điểm (làm tròn xuống)
    //                 label.string = `${Math.floor(goldsTweenObj.value)}`;
    //             }
    //         })
    //         .start();
    // }

    public async AnimationMoneyChange(oldGold: number, newGold: number, label: Label) {
        if (oldGold === newGold) {
            label.string = `${newGold}`;
            return;
        }

        if (newGold > oldGold) {
            CoinEff.getInstance().PlayCoins();
            // --- LOGIC MỚI: KHI TĂNG TIỀN ---
            const delta = newGold - oldGold;
            const amountPerStage = delta / 3;
            let currentGold = oldGold;

            // Chạy animation 3 lần
            for (let i = 0; i < 3; i++) {
                if (i < 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                const targetGold = currentGold + amountPerStage;
                // Chạy animation cho từng đợt
                await this.tweenValue(currentGold, targetGold, 0.4, label);
                currentGold = targetGold;

                // Đợi 0.5s trước khi bắt đầu đợt tiếp theo (trừ lần cuối)
            }

            // Đảm bảo giá trị cuối cùng luôn chính xác
            label.string = `${newGold}`;

        } else {
            // --- LOGIC CŨ: KHI GIẢM TIỀN (giữ nguyên) ---
            const goldsTweenObj = { value: oldGold };
            const delta = newGold - oldGold;
            const duration = Math.min(1.5, Math.max(0.3, Math.abs(delta) * 0.02));

            tween(goldsTweenObj)
                .to(duration, { value: newGold }, {
                    onUpdate: () => {
                        label.string = `${Math.floor(goldsTweenObj.value)}`;
                    }
                })
                .call(() => {
                    // Đảm bảo giá trị cuối cùng chính xác
                    label.string = `${newGold}`;
                })
                .start();
        }
    }

    /**
     * Hàm trợ giúp để tween giá trị cho một đợt và trả về một Promise
     * @param fromValue Giá trị bắt đầu
     * @param toValue Giá trị kết thúc
     * @param duration Thời gian tween
     * @param label Label để cập nhật
     */
    private tweenValue(fromValue: number, toValue: number, duration: number, label: Label): Promise<void> {
        return new Promise(resolve => {
            const tweenObj = { value: fromValue };
            tween(tweenObj)
                .to(duration, { value: toValue }, {
                    onUpdate: () => {
                        label.string = `${Math.floor(tweenObj.value)}`;
                    }
                })
                .call(() => {
                    resolve()
                }) // Báo hiệu Promise đã hoàn thành khi tween kết thúc
                .start();
        });
    }

    activeEffGold() {
        this.effGold.active = true;

        setTimeout(() => {
            this.effGold.active = false;
        }, 1000)
    }
}


