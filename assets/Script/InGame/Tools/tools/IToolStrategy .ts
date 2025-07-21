export interface IToolStrategy {
    /**
     * Kích hoạt công cụ, chuẩn bị cho việc người dùng tương tác trên lưới.
     * @param params - Các tham số bổ sung nếu cần (hiện tại chưa dùng).
     */
    activate(params?: any): void;

    /**
     * Thực thi logic chính của công cụ.
     * @param row - Hàng của ô được chọn.
     * @param col - Cột của ô được chọn.
     */
    execute(row: number, col: number): Promise<void>;

    /**
     * Hủy kích hoạt công cụ, dọn dẹp và trả lại trạng thái bình thường.
     */
    deactivate(): void;
}