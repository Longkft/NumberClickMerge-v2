import { _decorator, Component, director, easing, floatToHalf, instantiate, log, Node, Prefab, Sprite, sys, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from './DataManager';
import { Utils } from '../Utils/Utils';
import { BaseSingleton } from '../Base/BaseSingleton';
import { HighScoreMenu } from '../InGame/head/HighScoreMenu';
import { ScoreController } from '../InGame/head/score/ScoreController';
import { InGameLogicManager } from '../InGame/InGameLogicManager';
import { EventGame } from '../Enum/EEvent';
import { GameManager } from './GameManager';
import { GameMode, GameState } from '../Enum/Enum';
import { GridManager } from '../InGame/GridManager';
import { LevelConfig } from '../LevelConfig';
// import { FbSdk } from '../FbSdk';


const { ccclass, property } = _decorator;

@ccclass('HomeManager')
export class HomeManager extends BaseSingleton<HomeManager> {

    @property({ type: Prefab })
    gamePlayPrefab: Prefab = null;

    @property({ type: Prefab })
    mapJourneyPrefab: Prefab = null;

    @property({ type: Prefab })
    mapGameJourneyPrefab: Prefab = null;

    gamePlayNode: Node = null;
    mapJourneyNode: Node = null;
    mapGameJourneyNode: Node = null;

    @property({ type: Node })
    loadingInScene: Node = null;

    @property({ type: Node })
    head: Node = null;

    @property({ type: HighScoreMenu })
    highScoreClassic: HighScoreMenu = null;

    // @property({ type: HighScoreMenu })
    // highScoreHard: HighScoreMenu = null;

    scheduleLoadShowGameplay: CallableFunction = null;

    @property(Node)
    home: Node = null

    @property(Node)
    gameplayContainer: Node = null
    @property(Node)
    journeyContainer: Node = null;

    // =================== level quest =====================
    levelQuest: number; // cấp leo tháp
    dataLevelQuest: any;
    isHard: boolean = false;

    protected async onLoad() {

        super.onLoad();
        // FbSdk.getInstance().loginGame()
        // localStorage.clear()
        this.levelQuest = await DataManager.getInstance().GetLevelQuest();
        this.dataLevelQuest = LevelConfig[this.levelQuest - 1];
        this.isHard = this.dataLevelQuest.isHard;
        DataManager.getInstance()._scenePlay = false; // chưa có màn playGame

        this.PreLoadPrefabGamePlay();
    }

    setLevelQuestData() {
        this.levelQuest += 1;
        this.dataLevelQuest = LevelConfig[this.levelQuest - 1];
        this.isHard = this.dataLevelQuest.isHard;
    }

    // #region  PreLoad

    PreLoadPrefabGamePlay() {
        Utils.PreloadAsset(`GamePlay/InGame`, Prefab, (Prefab) => {
            this.gamePlayPrefab = Prefab;
        });

        Utils.PreloadAsset(`GamePlay/InGame_MapJourney`, Prefab, (Prefab) => {
            this.mapGameJourneyPrefab = Prefab;
        });

        Utils.PreloadAsset(`Map/MapJourney`, Prefab, (Prefab) => {
            this.mapJourneyPrefab = Prefab;
        });
    }

    // ------------------------ play game -------------------------------
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
        this.home.active = false;

        // hiện game
        this.gamePlayNode = instantiate(this.gamePlayPrefab);
        this.gamePlayNode.setParent(this.gameplayContainer);
        this.gamePlayNode.active = true;
    }

    // ------------------------ Journey -------------------------------
    TouchMapJourney() {
        if (this.mapJourneyPrefab == null) {
            this.loadingInScene.active = true;

            this.schedule(this.scheduleLoadMap, 0.1);
        } else {
            this.scheduleLoadMap();
        }
        DataManager.getInstance()._scenePlay = false;
    }

    scheduleLoadMap() {
        if (this.mapJourneyPrefab != null) {
            this.loadingInScene.active = false;
            this.unschedule(this.scheduleLoadMap);
            this.ActiveMapJourney();
        }
    }

    ActiveMapJourney() {
        this.home.active = false;

        // hiện map
        this.mapJourneyNode = instantiate(this.mapJourneyPrefab);
        this.mapJourneyNode.setParent(this.journeyContainer);
        this.mapJourneyNode.active = true;
    }

    // ------------------------ Journey -------------------------------
    TouchGameMapJourney() {
        if (this.mapGameJourneyPrefab == null) {
            this.loadingInScene.active = true;

            this.schedule(this.scheduleLoadGameMap, 0.1);
        } else {
            this.scheduleLoadGameMap();
        }
        DataManager.getInstance()._scenePlay = true;
    }

    scheduleLoadGameMap() {
        if (this.mapGameJourneyPrefab != null) {
            this.loadingInScene.active = false;
            this.unschedule(this.scheduleLoadGameMap);
            this.ActiveGameMapJourney();
        }
    }

    ActiveGameMapJourney() {
        this.home.active = false;
        this.mapJourneyNode.destroy();
        this.mapGameJourneyNode = null;

        // hiện map
        this.mapGameJourneyNode = instantiate(this.mapGameJourneyPrefab);
        this.mapGameJourneyNode.setParent(this.gameplayContainer);
        this.mapGameJourneyNode.active = true;
    }

    // #region  Score

    // ------------------------ other -------------------------------
    FXOpacity(node) {
        tween(node.getComponent(UIOpacity)).to(0.5, { opacity: 255 }).start()
    }

    ShowHome() {
        this.home.active = true;

        switch (GridManager.getInstance().GameMode) {
            case GameMode.CLASSIC: {
                InGameLogicManager.getInstance().SaveGame();
                director.emit(EventGame.UPDATE_HIGH_SCORE);

                this.gamePlayNode.destroy();
                this.gamePlayNode = null;
            }
                break;
            case GameMode.MAP: {
                this.mapJourneyNode.destroy();
                this.mapJourneyNode = null;
            }
                break;
            case GameMode.JOURNEY: {
                InGameLogicManager.getInstance().SaveGame();

                this.mapGameJourneyNode.destroy();
                this.mapGameJourneyNode = null;
            }
                break;
        }

        DataManager.getInstance()._scenePlay = false;
    }
}


