import { _decorator, Component, director, instantiate, log, Node, Button } from 'cc';
import { FXShadow } from '../../FX/FXShadow';
import { DataManager } from '../../Manager/DataManager';
import { EventGame } from '../../Enum/EEvent';
import { PrefabManager } from '../../Manager/PrefabManager';
import { DailyItem } from '../Daily/DailyItem';
import { Utils } from '../../Utils/Utils';
import { MoneyController } from '../head/Money/MoneyController';
import { DailyManager } from '../../Manager/DailyManager';

const { ccclass, property } = _decorator;

@ccclass('PopupDailyBonus')
export class PopupDailyBonus extends Component {
    @property({ type: FXShadow })
    shadow: FXShadow = null;

    @property({ type: Node })
    box: Node = null;

    @property({ type: Node })
    day16: Node = null; // Container cho ngày 1-6

    @property({ type: Node })
    day7: Node = null; // Container cho ngày 7

    @property({ type: Button, tooltip: "Nút nhận thưởng CHUNG cho toàn bộ popup" })
    claimButton: Button = null!; // Đây chính là nút nhận duy nhất

    dataDaily: any[] = [
        { day: '1', gold: 50 },
        { day: '2', gold: 50 },
        { day: '3', gold: 100 },
        { day: '4', gold: 100 },
        { day: '5', gold: 150 },
        { day: '6', gold: 150 },
        { day: '7', gold: 300 }
    ];

    public _dailyData: any = null;
    private _canClaim: boolean = false;
    private _dayItems: DailyItem[] = []; // Mảng lưu các component DailyItem

    async Show() {
        this.node.setSiblingIndex(Utils.getInstance().GetIndexMaxPopup());

        // Dọn dẹp UI cũ
        this.day16.removeAllChildren();
        this.day7.removeAllChildren();
        this._dayItems = [];

        // 1. Tạo các item UI
        this.AddDailyItem();

        // 2. Kiểm tra logic, xác định xem hôm nay có được nhận thưởng không
        await this.initializeAndCheckBonus();

        // 3. Hiển thị popup
        await this.shadow.ShowFxShadow();
        await this.shadow.ShowFxBox(this.box);

        this._dayItems[this._dailyData.currentDayIndex].getComponent(DailyItem).ActiveFxButton(true);
    }

    async initializeAndCheckBonus() {
        this._dailyData = DailyManager.getInstance()._dailyData;

        const now = Date.now();
        const lastClaimTime = this._dailyData.lastClaimTimestamp;

        if (lastClaimTime === 0) { // Lần đầu chơi
            this._canClaim = true;
            this._dailyData.currentDayIndex = 0;
        } else { // Đã từng chơi
            if (!Utils.getInstance().isSameDay(lastClaimTime, now)) { // Nếu đã qua ngày mới
                this._canClaim = true;
                this._dailyData.currentDayIndex++;
                if (this._dailyData.currentDayIndex >= this.dataDaily.length) {
                    this._dailyData.currentDayIndex = 0; // Reset
                }
            } else { // Vẫn trong ngày cũ
                this._canClaim = false;
            }
        }

        // Cập nhật giao diện (ẩn item cũ và bật/tắt nút "Nhận")
        this.updateUI();
    }

    async onClaimButtonClicked() {
        if (!this._canClaim) return; // Bảo vệ, không cho bấm khi không được phép

        const rewardData = this.dataDaily[this._dailyData.currentDayIndex];

        // Trao thưởng
        director.emit(EventGame.UPDATE_COIN_UI, rewardData.gold);

        // Cập nhật và lưu dữ liệu
        this._dailyData.lastClaimTimestamp = Date.now();

        DailyManager.getInstance()._dailyData = this._dailyData;

        this._canClaim = false; // Cập nhật lại trạng thái và giao diện ngay lập tức
        this.updateUI();
        this.scheduleOnce(() => this.Hide(), 0.5);
    }

    updateUI() {
        const currentDay = this._dailyData.currentDayIndex;

        this._dayItems.forEach((item, index) => {
            // Ngày đã qua hoặc hôm nay đã nhận -> ẩn đi
            const isClaimed = index < currentDay || (index === currentDay && !this._canClaim);
            item.ActiveNodeHide(isClaimed);
        });

        // Kích hoạt hoặc vô hiệu hóa nút "Nhận" chung
        this.claimButton.interactable = this._canClaim;
        this.claimButton.node.getChildByName('shadow').active = !this._canClaim;
    }

    AddDailyItem() {
        for (let i = 0; i < this.dataDaily.length; i++) {
            let dailyNode: Node;
            const data = this.dataDaily[i];

            if (i < this.dataDaily.length - 1) {
                dailyNode = instantiate(PrefabManager.getInstance().itemDaily);

                this.day16.addChild(dailyNode);
            } else {
                dailyNode = instantiate(PrefabManager.getInstance().itemDaily7);

                this.day7.addChild(dailyNode);
            }

            const dailyItemComp = dailyNode.getComponent(DailyItem);
            dailyItemComp.setUp(data.day, data.gold);

            // Tắt hết eff button
            dailyItemComp.ActiveFxButton(false);

            this._dayItems.push(dailyItemComp);
        }
    }

    async Hide() {
        await this.shadow.HideFxBox(this.box);
        await this.shadow.HideFXShadow();
    }

    BtnClose() {
        this.Hide();
    }
}