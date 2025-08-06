import { _decorator, Component, easing, floatToHalf, instantiate, log, Node, Prefab, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from './DataManager';
import { Utils } from '../Utils/Utils';
import { BaseSingleton } from '../Base/BaseSingleton';
import { HighScoreMenu } from '../InGame/head/HighScoreMenu';
import { ScoreController } from '../InGame/head/score/ScoreController';


const { ccclass, property } = _decorator;

@ccclass('HomeManager')
export class HomeManager extends BaseSingleton<HomeManager> {

    @property({ type: Prefab })
    gamePlayPrefab: Prefab = null;

    gamePlayNode: Node = null;

    @property({ type: Node })
    loadingInScene: Node = null;

    @property({ type: Node })
    head: Node = null;

    @property({ type: Node })
    tool: Node = null;

    @property({ type: HighScoreMenu })
    highScoreClassic: HighScoreMenu = null;

    @property({ type: HighScoreMenu })
    highScoreHard: HighScoreMenu = null;

    scheduleLoadShowGameplay: CallableFunction = null;

    @property(Node)
    home: Node = null

    @property(Node)
    gameplayContainer: Node = null

    public static instance: HomeManager = null

    protected onLoad(): void {
        HomeManager.instance = this;
        DataManager.getInstance()._scenePlay = false; // chưa có màn playGame

        this.PreLoadPrefabGamePlay();
    }

    // #region  PreLoad

    PreLoadPrefabGamePlay() {
        Utils.PreloadAsset(`GamePlay/InGame`, Prefab, (Prefab) => {
            this.gamePlayPrefab = Prefab;

            log(Prefab)

            // this.gamePlayNode = instantiate(this.gamePlayPrefab);
            // this.gamePlayNode.setParent(this.gameplayContainer);
            // this.gamePlayNode.active = false;
        });
    }

    TouchPlayGame() {
        log(1)
        if (this.gamePlayPrefab == null) {
            log(2)
            // LoadingInScene hiện lên màn load

            this.loadingInScene.active = true;

            this.schedule(this.scheduleLoad, 0.1);
        } else {
            log(3)
            // add màn play

            this.scheduleLoad();
        }

        DataManager.getInstance()._scenePlay = true; // đã sang màn chơi chưa
    }

    scheduleLoad() {
        log('no')
        if (this.gamePlayPrefab != null) {
            log('yes')
            this.loadingInScene.active = false;

            // huỷ
            this.unschedule(this.scheduleLoad);

            this.ActiveGamePlay();
        }
    }

    ActiveGamePlay() {
        this.home.active = false
        log('this.gamePlayNode: ', this.gamePlayNode);
        if (this.gamePlayNode != null) {
            this.gamePlayNode.setParent(this.gameplayContainer);
            this.gamePlayNode.active = true;

            log(`11111111111111111`)

            this.activeHead(true);
            return;
        }

        // hiện game
        this.gamePlayNode = instantiate(this.gamePlayPrefab);
        this.gamePlayNode.setParent(this.gameplayContainer);
        this.gamePlayNode.active = true;

        this.activeHead(true);
        log('this.gamePlayNode111: ', this.gamePlayNode);
    }

    activeHead(active: boolean) {
        let score = this.head.getChildByName('score');
        score.active = active;
        let heart = this.head.getChildByName('heart');
        heart.active = active;
        let level = this.head.getChildByName('level');
        level.active = active;
        log(score)
        log(heart)
        log(level)

        this.tool.active = active;
    }

    // #region  Score

    FXOpacity(node) {
        tween(node.getComponent(UIOpacity)).to(0.5, { opacity: 255 }).start()
    }

    ShowHome() {
        this.home.active = true;

        // this.gameplayContainer.removeAllChildren();
        this.gamePlayNode.removeFromParent();
        this.gamePlayNode.destroy();
        this.gamePlayNode = null;

        DataManager.getInstance()._scenePlay = false;

        this.highScoreClassic.highScore = ScoreController.getInstance().highScoreCurrent;
        this.highScoreHard.highScore = ScoreController.getInstance().highScoreCurrent;
        this.highScoreClassic.setValue();
        this.highScoreHard.setValue();

        this.activeHead(false);
    }
}


