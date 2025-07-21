import { _decorator, Component, Label, Node, Sprite, tween } from 'cc';
import { LevelModel } from './LevelModel'; // Giả sử bạn có file LevelModel.ts

const { ccclass, property } = _decorator;

@ccclass('LevelUI')
export class LevelUI extends Component {

    @property(Label)
    labelLevel: Label = null;

    @property({ type: Sprite, tooltip: "Sprite thanh EXP, có Fill Type là RADIAL" })
    progressSprite: Sprite = null;

    public initializeView(levelInfo: LevelModel) {
        this.labelLevel.string = levelInfo.level.toString();
        if (this.progressSprite) {
            this.progressSprite.fillRange = levelInfo.progress;
        }
    }

    public updateView(oldInfo: LevelModel, newInfo: LevelModel) {
        this.labelLevel.string = newInfo.level.toString();

        // Chạy animation cho thanh tiến độ
        if (this.progressSprite) {
            if (oldInfo.level < newInfo.level) {
                this.animateLevelUp(oldInfo.progress, newInfo.progress);
            } else {
                this.animateProgress(oldInfo.progress, newInfo.progress);
            }
        }
    }

    private animateProgress(start: number, end: number) {
        const progressData = { value: start };
        tween(progressData)
            .to(0.5, { value: end }, {
                onUpdate: () => { this.progressSprite.fillRange = progressData.value; }
            })
            .start();
    }

    private animateLevelUp(start: number, end: number) {
        const progressData = { value: start };

        tween(progressData)
            .to(0.3, { value: 1 }, {
                onUpdate: () => { this.progressSprite.fillRange = progressData.value; }
            })
            .call(() => {
                // Reset về 0 và chạy đến tiến độ mới
                this.progressSprite.fillRange = 0;
                progressData.value = 0;
                tween(progressData)
                    .to(0.3, { value: end }, {
                        onUpdate: () => { this.progressSprite.fillRange = progressData.value; }
                    })
                    .start();
            })
            .start();
    }
}