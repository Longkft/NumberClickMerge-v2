import { _decorator, Component, director, Label, Node, Sprite, tween } from 'cc';
// import { FbSdk } from '../FbSdk';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    @property(Node)
    loadingbar: Node = null

    @property(Label)
    txtLoadingPersent: Label = null


    protected async onLoad() {
        this.FXLblLoading();
        this.FXProgressLoading();

        this.LoadScene();
    }

    protected start(): void {
        // FbSdk.getInstance().loginGame()
    }

    LoadScene() {
        director.loadScene("Gameplay");
    }

    FXLblLoading() {
        const label = this.txtLoadingPersent;
        const texts = ["Loading.", "Loading..", "Loading..."];
        let index = 0;

        this.schedule(() => {
            label.string = texts[index];
            index = (index + 1) % texts.length;
        }, 0.5);
    }


    FXProgressLoading() {
        const loadingSprites: Node[] = this.loadingbar.children
        const totalSprites = loadingSprites.length;
        const duration = 10; // 3 giây
        const interval = 1

        for (let i = 0; i < totalSprites; i++) {
            this.scheduleOnce(() => {
                tween(loadingSprites[i].getComponent(Sprite)).to(interval, { fillRange: 1 }).start()
            }, interval * i)
        }


    }


}


