import { _decorator, Component, Node, screen, Size, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UpdateContenSize')
export class UpdateContenSize extends Component {
    protected update(dt: number): void {
        this.node.getComponent(UITransform).setContentSize(this.getSizeWindow())
    }

    public getSizeWindow(): Size {
        let newH: number = 0
        let newW: number = 0
        let scaleW = screen.windowSize.width / 1080
        let scaleH = screen.windowSize.height / 1920
        if (scaleW > scaleH) {
            newW = screen.windowSize.width / scaleH
            newH = 1920
        }
        else {
            newH = screen.windowSize.height / scaleW
            newW = 1080
        }
        return new Size(newW, newH)
    }
}


