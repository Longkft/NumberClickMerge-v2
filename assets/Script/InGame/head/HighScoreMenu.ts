import { _decorator, Component, Enum, Label, log, Node, tween } from 'cc';
import { GameMode } from '../../Enum/Enum';
import { DataManager } from '../../Manager/DataManager';
const { ccclass, property } = _decorator;

Enum(GameMode)
@ccclass('HighScoreMenu')
export class HighScoreMenu extends Component {

    @property({ type: GameMode })
    gameMode: GameMode = GameMode.CLASSIC;

    highScore: number = 0;

    protected async onLoad() {
        log('gameMode: ', this.gameMode)
        this.highScore = await DataManager.getInstance().GethighScoreMenu(this.gameMode);
        log('this.highScore: ' + this.gameMode, this.highScore)

        this.setValue();
    }

    setValue() {
        this.AnimationScoreChange(0, this.highScore, this.node.getComponent(Label));

        // this.node.getComponent(Label).string = this.highScore.toString();
    }

    public AnimationScoreChange(oldScore: number, newScore: number, label: Label) {
        if (oldScore === newScore) {
            label.string = `${newScore}`;
            return;
        }

        const scoreTweenObj = { value: oldScore };
        const delta = newScore - oldScore;

        // Tính thời gian tween theo độ chênh lệch (tối đa 1.5s, tối thiểu 0.3s)
        const duration = Math.min(1.5, Math.max(0.3, delta * 0.02));

        tween(scoreTweenObj)
            .to(duration, { value: newScore }, {
                onUpdate: () => {
                    // Cập nhật label hiển thị điểm (làm tròn xuống)
                    label.string = `${Math.floor(scoreTweenObj.value)}`;
                }
            })
            .start();
    }
}


