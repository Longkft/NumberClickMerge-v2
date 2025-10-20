import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapJourney')
export class MapJourney extends Component {

    @property(Node)
    map: Node = null;

    @property(Node)
    btnPlayJourney: Node = null;

    levelMapJourney: number = 1;

    onEnable(): void {
        // this.levelMapJourney = 
    }
}


