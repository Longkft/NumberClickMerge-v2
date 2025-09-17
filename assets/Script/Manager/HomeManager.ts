import { _decorator, Component, director, easing, floatToHalf, instantiate, log, Node, Prefab, Sprite, sys, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from './DataManager';
import { Utils } from '../Utils/Utils';
import { BaseSingleton } from '../Base/BaseSingleton';
import { HighScoreMenu } from '../InGame/head/HighScoreMenu';
import { ScoreController } from '../InGame/head/score/ScoreController';
import { InGameLogicManager } from '../InGame/InGameLogicManager';
import { EventGame } from '../Enum/EEvent';
// import { FbSdk } from '../FbSdk';


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

        super.onLoad();
        // FbSdk.getInstance().loginGame()
        // localStorage.clear()
        HomeManager.instance = this;
        DataManager.getInstance()._scenePlay = false; // chưa có màn playGame

        // this.PreLoadPrefabGamePlay();
    }

    // #region  PreLoad

    PreLoadPrefabGamePlay() {
        Utils.PreloadAsset(`GamePlay/InGame`, Prefab, (Prefab) => {
            this.gamePlayPrefab = Prefab;
        });
    }

    TouchPlayGame() {
        if (this.gamePlayPrefab == null) {
            this.loadingInScene.active = true;

            this.schedule(this.scheduleLoad, 0.1);
        } else {
            this.scheduleLoad();
        }
        DataManager.getInstance()._scenePlay = true; // đã sang màn chơi chưa
    }

    scheduleLoad() {
        if (this.gamePlayPrefab != null) {
            this.loadingInScene.active = false;
            this.unschedule(this.scheduleLoad);
            this.ActiveGamePlay();
        }
    }

    ActiveGamePlay() {
        this.home.active = false
        // if (this.gamePlayNode != null) {
        //     this.gamePlayNode.setParent(this.gameplayContainer);
        //     this.gamePlayNode.active = true;
        //     return;
        // }

        // hiện game
        this.gamePlayNode = instantiate(this.gamePlayPrefab);
        this.gamePlayNode.setParent(this.gameplayContainer);
        this.gamePlayNode.active = true;
    }


    // #region  Score

    FXOpacity(node) {
        tween(node.getComponent(UIOpacity)).to(0.5, { opacity: 255 }).start()
    }

    ShowHome() {
        InGameLogicManager.getInstance().SaveGame()
        // this.highScoreClassic.highScore = ScoreController.getInstance().highScoreCurrent;
        // this.highScoreHard.highScore = ScoreController.getInstance().highScoreCurrent;
        director.emit(EventGame.UPDATE_HIGH_SCORE);

        this.home.active = true
        this.gamePlayNode.destroy();
        this.gamePlayNode = null;

        DataManager.getInstance()._scenePlay = false;
    }
}


