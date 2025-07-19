import { _decorator, Component, Node } from 'cc';
import { ScoreUi } from './ScoreUi';
import { DataManager } from '../../../Manager/DataManager';
import { EventBus } from '../../../Utils/EventBus';
import { EventGame } from '../../../Enum/EEvent';
import { BaseSingleton } from '../../../Base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('ScoreController')
export class ScoreController extends BaseSingleton<ScoreController> {

    @property({ type: ScoreUi })
    scoreUiCpn: ScoreUi = null;

    scoreCurrent: number = 0
    highScoreCurrent: number = 0
    protected async onLoad() {
        this.LoadScoreCurrent()
    }

    start() {
        this.scoreUiCpn = this.node.getComponent(ScoreUi);

        this.updateScore();
        this.updateScoreMax();

        this.ResGisterEvent();
    }

    onDestroy() {
        this.UnResGisterEvent();
    }

    ResGisterEvent() {
        EventBus.on(EventGame.UPGRADE_SCORE, this.OnScoreUpgraded, this);
        EventBus.on(EventGame.RESET_SCORE, this.ResetScore, this);
    }

    UnResGisterEvent() {
        EventBus.off(EventGame.UPGRADE_SCORE, this.OnScoreUpgraded);
        EventBus.off(EventGame.RESET_SCORE, this.ResetScore);
    }

    async LoadScoreCurrent() {
        this.scoreCurrent = await DataManager.getInstance().GetCoreInPlayGame()
        this.highScoreCurrent = await DataManager.getInstance().GethighScore()
    }

    OnScoreUpgraded(plusScore: number) {
        // Cộng điểm vào CoreInPlayGame
        const dataManager = DataManager.getInstance();

        const previousScore = this.scoreCurrent;
        const updatedScore = previousScore + plusScore;

        // Cập nhật điểm trong DataManager
        this.scoreCurrent = updatedScore;

        // Cập nhật high score
        if (updatedScore > this.highScoreCurrent) {
            this.highScoreCurrent = updatedScore;
        }

        // Gọi hàm tween tăng điểm mượt mà
        this.scoreUiCpn.AnimationScoreChange(previousScore, updatedScore, this.scoreUiCpn.scoreLabel);

        // Cập nhật hiệu ứng + điểm
        this.scoreUiCpn.updateScorePlus(plusScore);

        // Cập nhật highScore trên UI
        this.scoreUiCpn.SetValueMaxScore(this.highScoreCurrent);
    }

    public updateScore() {
        let score = this.scoreCurrent;
        if (score) {
            this.scoreUiCpn.SetValueScore(score);
            return;
        }

        this.scoreCurrent = 0;
        score = 0;
        this.scoreUiCpn.SetValueScore(score);
    }

    ResetScore() {
        this.scoreCurrent = 0;
        let score = 0;
        this.scoreUiCpn.SetValueScore(score);
    }

    public updateScoreMax() {
        const score = this.highScoreCurrent;

        this.scoreUiCpn.SetValueMaxScore(score);
    }


    SaveScoreCurrent() {
        DataManager.getInstance().SetCoreInPlayGame(this.scoreCurrent)
        DataManager.getInstance().SethighScore(this.highScoreCurrent)
    }
}


