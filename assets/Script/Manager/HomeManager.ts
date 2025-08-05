import { _decorator, Component, easing, floatToHalf, instantiate, log, Node, Prefab, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from './DataManager';
import { Utils } from '../Utils/Utils';
import { BaseSingleton } from '../Base/BaseSingleton';


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

            this.gamePlayNode = instantiate(this.gamePlayPrefab);
            this.gamePlayNode.setParent(this.gameplayContainer);
            this.gamePlayNode.active = false;
        });
    }

    TouchPlayGame() {
        if (this.gamePlayPrefab == null) {
            // LoadingInScene hiện lên màn load

            this.loadingInScene.active = true;

            this.schedule(this.scheduleLoad, 0.1);
        } else {
            // add màn play

            this.scheduleLoad();
        }

        DataManager.getInstance()._scenePlay = true; // đã sang màn chơi chưa
        if (this.gamePlayPrefab == null) {
            // LoadingInScene hiện lên màn load

            this.loadingInScene.active = true;

            this.schedule(this.scheduleLoad, 0.1);
        } else {
            // add màn play

            this.scheduleLoad();
        }

        DataManager.getInstance()._scenePlay = true; // đã sang màn chơi chưa
    }

    scheduleLoad() {
        if (this.gamePlayPrefab != null) {
            this.loadingInScene.active = false;

            // huỷ
            this.unschedule(this.scheduleLoad);

            this.ActiveGamePlay();
        }
    }

    ActiveGamePlay() {
        this.home.active = false
        if (this.gamePlayNode != null) {
            this.gamePlayNode.active = true;

            this.activeHead();
            return;
        }

        // hiện game
        this.gamePlayNode = instantiate(this.gamePlayPrefab);
        this.gamePlayNode.setParent(this.gameplayContainer);
        this.gamePlayNode.active = true;

        this.activeHead();
    }

    activeHead() {
        let score = this.head.getChildByName('score');
        score.active = true;
        let heart = this.head.getChildByName('heart');
        heart.active = true;
        let level = this.head.getChildByName('level');
        level.active = true;
        log(score)
        log(heart)
        log(level)

        this.tool.active = true;
    }

    // #region  Score

    FXOpacity(node) {
        tween(node.getComponent(UIOpacity)).to(0.5, { opacity: 255 }).start()
    }

    ShowHome() {
        this.home.active = true;
        this.gamePlayNode.active = false;
    }
}


