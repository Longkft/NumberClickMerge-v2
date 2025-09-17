import { _decorator, Component, Camera, view, CCBoolean } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SyncCamera')
export class SyncCamera extends Component {

    @property({
        type: Camera,
        tooltip: 'Kéo camera chính của bạn vào đây.'
    })
    mainCamera: Camera = null;

    @property({
        type: Camera,
        tooltip: 'Kéo camera phụ (camera cần đồng bộ) vào đây.'
    })
    secondaryCamera: Camera = null;

    @property({
        tooltip: 'Bật nếu bạn muốn đồng bộ cả vị trí và góc xoay.'
    })
    syncTransform: boolean = false;

    onLoad() {
        if (!this.mainCamera || !this.secondaryCamera) {
            this.enabled = false;
            return;
        }

        // Đăng ký sự kiện khi kích thước màn hình thay đổi
        view.on('canvas-resize', this.syncProperties, this);

        // Đồng bộ lần đầu tiên
        this.syncProperties();
    }

    onDestroy() {
        // Hủy đăng ký sự kiện để tránh rò rỉ bộ nhớ
        view.off('canvas-resize', this.syncProperties, this);
    }

    lateUpdate(dt: number) {
        // Cập nhật mỗi frame trong lateUpdate để đảm bảo lấy được thông tin cuối cùng của mainCamera
        this.syncProperties();
    }

    syncProperties() {
        if (!this.mainCamera || !this.secondaryCamera) return;

        // Đồng bộ các thuộc tính quan trọng nhất
        this.secondaryCamera.projection = this.mainCamera.projection;

        if (this.mainCamera.projection === Camera.ProjectionType.PERSPECTIVE) {
            // Đối với camera 3D
            this.secondaryCamera.fov = this.mainCamera.fov;
        } else {
            // Đối với camera 2D
            this.secondaryCamera.orthoHeight = this.mainCamera.orthoHeight;
        }

        // Đồng bộ các thuộc tính khác nếu cần
        this.secondaryCamera.near = this.mainCamera.near;
        this.secondaryCamera.far = this.mainCamera.far;

        // Đồng bộ vị trí và góc xoay nếu được bật
        if (this.syncTransform) {
            this.secondaryCamera.node.setWorldPosition(this.mainCamera.node.worldPosition);
            this.secondaryCamera.node.setWorldRotation(this.mainCamera.node.worldRotation);
        }
    }
}