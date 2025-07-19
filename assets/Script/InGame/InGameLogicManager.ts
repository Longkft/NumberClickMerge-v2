import { _decorator, Component, error, game, log, Node, tween } from 'cc';
import { CellCollection } from './Cell/CellCollection';
import { GameManager } from '../Manager/GameManager';
import { PoolObjectManager } from '../Manager/PoolObjectManager';
import { PrefabManager } from '../Manager/PrefabManager';
import { InGameUIManager } from './InGameUIManager';
import { GridManager } from './GridManager';
import { CellModel } from './Cell/CellModel';
import { Cell } from './Cell/Cell';
import { BaseSingleton } from '../Base/BaseSingleton';
import { EventBus } from '../Utils/EventBus';
import { EventGame } from '../Enum/EEvent';
import { DataManager } from '../Manager/DataManager';
import { AudioManager } from '../Manager/AudioManager';
import { SFXType } from '../Enum/Enum';
import { PopupManager } from '../Manager/PopupManager';
import { Utils } from '../Utils/Utils';
import { TutorialManager } from './Tools/TutorialManager';
const { ccclass, property } = _decorator;

@ccclass('InGameLogicManager')
export class InGameLogicManager extends BaseSingleton<InGameLogicManager> {

    public cellCollection: CellCollection = null
    public cellContainColllection: Node[] = []

    contains = []
    cells = []

    isUpLevel = false

    private isProcessing: boolean = false;

    private consecutiveMerges: number = 0;

    public get IsProcessing() {
        return this.isProcessing;
    }

    public set IsProcessing(value: boolean) {
        this.isProcessing = value;
    }

    protected onLoad(): void {
        super.onLoad();

        this.RegisEventBeforUnload();

        log('DataManager.getInstance().First: ', DataManager.getInstance().First);

        if (DataManager.getInstance().First) {
            DataManager.getInstance().First = false;
            PopupManager.getInstance().PopupTutorial.Show();

        } else {
            PopupManager.getInstance().PopupGoal.Show();
        }
    }

    protected start(): void {
        // this.init()
        // this.InitContainCells()
        // this.InitCells()

        this.LoadGame();

        // EventBus.on(EventGame.GRID_CELL_UPDATED_EVENT, this.OnUpdateUi, this);
    }

    DestroyEvent() {
        EventBus.off(EventGame.GRID_CELL_UPDATED_EVENT, this.OnUpdateUi);
    }


    init() {
        this.cellCollection = new CellCollection();
    }

    InitContainCells() {
        for (let i = 0; i < GameManager.getInstance().dataGame.json["row"]; i++) {
            let list: Node[] = []
            for (let j = 0; j < GameManager.getInstance().dataGame.json["col"]; j++) {
                let newContainer = PoolObjectManager.getInstance().Spawn(PrefabManager.getInstance().cellContainPrefab, InGameUIManager.getInstance().containNode)
                this.cellContainColllection.push(newContainer)
                list.push(newContainer)
            }
            this.contains.push(list)

            InGameUIManager.getInstance().UpdateLayoutContainCell()
        }

        log('this.contains: ', this.contains)
    }


    InitCells() {
        for (let i = 0; i < GameManager.getInstance().dataGame.json["row"]; i++) {
            let list: Cell[] = []
            for (let j = 0; j < GameManager.getInstance().dataGame.json["col"]; j++) {
                // let dataCell = 
                let cell = this.CreateCells(GridManager.getInstance().grid[i][j])
                cell.GetCellUI().setPosition(this.contains[i][j].position)
                list.push(cell)
            }

            this.cells.push(list)
        }
    }

    CreateCells(dataCell: CellModel): Cell {

        let newCell = this.cellCollection.CreateCell(dataCell)
        return newCell
    }

    ClickCheckToMove(rootRow: number, rootCol: number, matched: { row: number, col: number }[]) {
        if (this.isProcessing) {
            log("Đang xử lý, không cho click.");
            return;
        }

        // Khi người chơi tự click, reset combo và bắt đầu một chuỗi mới
        this.consecutiveMerges = 0;

        // Bắt đầu vòng lặp kiểm tra. Vòng lặp sẽ tự tìm thấy nhóm vừa được click
        // và xử lý nó cùng các nhóm khác (nếu có).
        // TRUYỀN THÔNG TIN Ô ĐƯỢC CLICK VÀO HÀM XỬ LÝ CHÍNH
        this.checkAllMatchingGroupsLoop({ row: rootRow, col: rootCol });
    }

    private findPathToRoot(
        startCell: { row: number, col: number },
        rootCell: { row: number, col: number },
        matchedCells: { row: number, col: number }[]
    ): { row: number, col: number }[] {

        const queue: { row: number, col: number }[][] = [[startCell]]; // Hàng đợi chứa các đường đi
        const visited = new Set<string>([`${startCell.row},${startCell.col}`]);
        const matchedSet = new Set(matchedCells.map(c => `${c.row},${c.col}`));

        const directions = [{ r: 0, c: 1 }, { r: 0, c: -1 }, { r: 1, c: 0 }, { r: -1, c: 0 }];

        while (queue.length > 0) {
            const path = queue.shift()!;
            const lastCell = path[path.length - 1];

            // Nếu đã đến đích, trả về đường đi
            if (lastCell.row === rootCell.row && lastCell.col === rootCell.col) {
                return path;
            }

            for (const dir of directions) {
                const nextRow = lastCell.row + dir.r;
                const nextCol = lastCell.col + dir.c;
                const nextKey = `${nextRow},${nextCol}`;

                // Kiểm tra xem ô tiếp theo có hợp lệ không
                if (matchedSet.has(nextKey) && !visited.has(nextKey)) {
                    visited.add(nextKey);
                    const newPath = [...path, { row: nextRow, col: nextCol }];
                    queue.push(newPath);
                }
            }
        }

        return []; // Không tìm thấy đường đi
    }

    // Thay thế hàm moveMatchedCellsToRoot cũ bằng hàm này

    public async moveMatchedCellsToRoot(
        rootRow: number,
        rootCol: number,
        matched: { row: number, col: number }[]
    ) {
        this.isProcessing = true;
        const STEP_DURATION = 0.2; // Tốc độ di chuyển

        if (matched.length <= 1) {
            this.ResetAfterTween(matched);
            return;
        }

        const rootCell = { row: rootRow, col: rootCol };
        const animationPromises: Promise<void>[] = [];

        for (const cell of matched) {
            if (cell.row === rootRow && cell.col === rootCol) continue;

            const node = this.cells[cell.row][cell.col]?.GetCellUI();
            if (!node) continue;

            const path = this.findPathToRoot(cell, rootCell, matched);
            if (path.length < 2) continue;

            const sequence = tween(node);

            for (let i = 1; i < path.length; i++) {
                const nextStep = path[i];
                const targetPos = this.contains[nextStep.row][nextStep.col].position;
                sequence.to(STEP_DURATION, { position: targetPos });
            }

            const promise = new Promise<void>(resolve => {
                sequence.call(resolve).start();
            });

            animationPromises.push(promise);
        }

        // Chờ tất cả các animation hoàn thành
        await Promise.all(animationPromises);

        Utils.getInstance().UpdateHeart(1);
        EventBus.emit(EventGame.UPDATE_HEARt_UI);

        // Sau khi tất cả đã di chuyển xong, reset lại bàn chơi
        // this.ResetAfterTween(matched);
    }

    private ResetAfterTween(matched: { row: number, col: number }[]) {
        this.ResetGrid(matched);
        this.isProcessing = false;

        DataManager.getInstance().MyHeart += 1;
        EventBus.emit(EventGame.UPDATE_HEARt_UI);

        AudioManager.getInstance().playSFX(SFXType.Merge);
    }

    AddScoreAfterMerge(rootModel: CellModel, matched: { row: number, col: number }[]) {
        const value = rootModel.value; // Lấy giá trị của ô (trước khi tăng)
        const groupSize = matched.length; // Lấy số lượng ô trong nhóm
        const score = value * groupSize * this.consecutiveMerges; // Áp dụng công thức
        EventBus.emit(EventGame.UPGRADE_SCORE, score);
    }

    private RewardGoldByCombo() {
        const chance = Math.random();
        log('change: ', chance);
        if (chance > 0.3) return; // 70% không nhận
        if (this.consecutiveMerges < 3) return; // chỉ từ combo 3

        const gold = 10 * (this.consecutiveMerges - 2) + 10;
        PopupManager.getInstance().PopupClainGoldCombo.gold = gold;

        return new Promise(resolve => {
            // DataManager.getInstance().Gold += gold;
            // EventBus.emit(EventGame.UPDATE_COIN_UI, gold);
            PopupManager.getInstance().PopupClainGoldCombo.Show(gold, this.consecutiveMerges, () => {
                // Hàm callback khi người chơi bấm claim
                resolve(true);
            });
        });

    }


    ResetGrid(matched: { row: number, col: number }[]) {

        this.consecutiveMerges++; // Tăng biến đếm combo

        const root = matched[0]; // ô đầu tiên là gốc
        const gridMgr = GridManager.getInstance();
        const rootModel = gridMgr.grid[root.row][root.col];

        // Bắt đầu logic tính điểm
        this.AddScoreAfterMerge(rootModel, matched);

        const newValue = rootModel.value + 1;

        // Gán -1 cho toàn bộ ô matched (bao gồm root)
        gridMgr.ResetDataMatch(matched);

        // Tạo ô mới với value tăng +1
        const newCellModel = new CellModel({
            value: newValue,
            color: gridMgr.GetColorByValue(newValue),
            row: root.row,
            col: root.col,
        });
        gridMgr.grid[root.row][root.col] = newCellModel;

        // 👉 Xoá hết cell matched UI (kể cả gốc)
        for (const cell of matched) {
            if (this.cells[cell.row][cell.col]) {
                this.cells[cell.row][cell.col].Dispose();
                this.cells[cell.row][cell.col] = null;
            }
        }

        // Tạo lại node UI cho ô gốc mới
        const nodeCell = this.CreateCells(newCellModel);
        const spawnPos = this.contains[root.row][root.col].position.clone();

        nodeCell.GetCellUI().setPosition(spawnPos);

        this.cells[root.row][root.col] = nodeCell;
        this.UpdateValueCellBeforeTween(root.row, root.col, nodeCell);



        // Fill tiếp và check match tiếp theo
        this.fillIntheBlank();
        gridMgr.FillIntheValue();
        if (GridManager.getInstance().CheckUpdateMaxCurrent(newValue) == true) {
            this.isUpLevel = true
        }
        this.scheduleOnce(() => {
            this.checkAllMatchingGroupsLoop();

        }, 0.25)
    }

    async fillIntheBlank() {
        const rows = GameManager.getInstance().dataGame.json["row"];
        const cols = GameManager.getInstance().dataGame.json["col"];

        for (let col = 0; col < cols; col++) {
            let dest = -1;                               // hàng trống

            for (let row = 0; row < rows; row++) {       // vẫn từ trên xuống
                if (this.cells[row][col] === null) {
                    if (dest === -1) dest = row;         // ghi nhận ô trống
                } else if (dest !== -1) {
                    // Có cell ở dưới 1 ô trống ⇒ kéo xuống
                    const fallingCell = this.cells[row][col];
                    this.TweenFillNode(
                        fallingCell.GetCellUI(),
                        this.contains[dest][col]         // tween tới vị trí trống
                    );

                    this.cells[dest][col] = fallingCell; // cập nhật mảng
                    this.cells[row][col] = null;

                    // this.UpdateValueCellBeforeTween(dest, col, fallingCell);
                    dest++;                              // trống kế tiếp
                }
            }
        }
    }

    private OnUpdateUi(payload: { row: number; col: number; cell: CellModel }): void {
        const { row, col, cell } = payload; // Destructure payload
        if (this.cells[row][col]) {
            const existingCell = this.cells[row][col];

            const startPos = this.contains[GameManager.getInstance().dataGame.json["row"] - 1][col].position.clone();
            startPos.y += 250;
            existingCell.GetCellUI().setPosition(startPos);

            existingCell.cellData = cell;
            this.UpdateValueCellBeforeTween(row, col, existingCell);
            this.TweenFillNode(existingCell.GetCellUI(), this.contains[row][col]);
        } else {
            const nodeCell = this.CreateCells(cell);
            const startPos = this.contains[GameManager.getInstance().dataGame.json["row"] - 1][col].position.clone();
            startPos.y += 250;
            nodeCell.GetCellUI().setPosition(startPos);
            this.TweenFillNode(nodeCell.GetCellUI(), this.contains[row][col]);
            this.cells[row][col] = nodeCell;
            this.UpdateValueCellBeforeTween(row, col, nodeCell);
        }
    }

    TweenFillNode(node: Node, targetNode: Node) {
        if (!node || !targetNode) {
            return;
        }

        tween(node)
            .to(0.2, { position: targetNode.position.clone() })
            .start();


    }

    private UpdateValueCellBeforeTween(row: number, col: number, cell: Cell) {
        const model = GridManager.getInstance().grid[row][col];

        model.row = row;
        model.col = col;

        cell.cellData = model;

        this.UpdateAllFrames();
        cell.cellUI.UpdateUICell(model, cell.clickEffect, cell.cellState);

    }

    private findAllMatchedGroups() {
        const rows = GameManager.getInstance().dataGame.json["row"];
        const cols = GameManager.getInstance().dataGame.json["col"];

        const grid = GridManager.getInstance().grid;
        const visited = new Set<string>();

        const matchGroups: { root: { row: number, col: number }, cells: { row: number, col: number }[] }[] = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const key = `${i},${j}`;
                if (visited.has(key) || grid[i][j].value <= 0) continue;

                const matched = GridManager.getInstance().findConnectedCells(i, j);
                if (matched.length >= 3) {
                    matched.forEach(c => visited.add(`${c.row},${c.col}`));
                    matchGroups.push({ root: { row: i, col: j }, cells: matched });
                }
            }
        }

        return matchGroups;
    }

    public async checkAllMatchingGroupsLoop(clickedRoot?: { row: number, col: number }) {
        this.isProcessing = true;

        // Tìm tất cả các nhóm
        let matchGroups = this.findAllMatchedGroups();

        // Xử lý trường hợp clickedRoot cho lượt đầu tiên
        if (clickedRoot) {
            const firstGroupIndex = matchGroups.findIndex(group =>
                group.cells.some(cell => cell.row === clickedRoot.row && cell.col === clickedRoot.col)
            );

            if (firstGroupIndex !== -1) {
                // Nếu ô click thuộc về một nhóm, đặt nó làm root của nhóm đó
                const clickedGroup = matchGroups[firstGroupIndex];
                clickedGroup.root = clickedRoot; // Gán root là ô người chơi click

                // Đảm bảo nhóm được click được xử lý đầu tiên nếu cần (tùy chọn)
                // Hoán đổi nhóm này lên đầu mảng nếu không phải là nhóm đầu tiên
                if (firstGroupIndex !== 0) {
                    const temp = matchGroups[0];
                    matchGroups[0] = clickedGroup;
                    matchGroups[firstGroupIndex] = temp;
                }
            } else {
                // Nếu ô click không tạo ra nhóm nào, có thể xử lý ở đây
                console.error("Ô được click không tạo ra nhóm phù hợp.");
                this.isProcessing = false;
                // Thêm logic hiển thị popup hết tim nếu cần
                if (DataManager.getInstance().MyHeart <= 0) {
                    PopupManager.getInstance().OutOfMove.Show();
                }
                return;
            }
        }


        // Nếu không có nhóm nào (sau khi đã thử với clickedRoot nếu có), kết thúc
        if (matchGroups.length === 0) {
            this.isProcessing = false; // cho phép click lại
            console.log("Không còn ô nào match.");

            if (this.isUpLevel) {
                PopupManager.getInstance().ShowPopupUnlockMax();
                this.isUpLevel = false;
            } else {
                // Chỉ thưởng combo nếu không có isUpLevel và không phải click ban đầu không tạo ra match
                if (!clickedRoot) { // Chỉ gọi khi là một vòng lặp tự động kết thúc chuỗi combo
                    this.RewardGoldByCombo();
                }
            }
            this.isProcessing = false;
            return;
        }

        // Tăng combo chỉ khi thực sự có match được xử lý
        this.consecutiveMerges++;

        // Chạy animation cho tất cả các nhóm
        const animationPromises: Promise<void>[] = [];
        for (const group of matchGroups) {
            const animPromise = this.moveMatchedCellsToRoot(group.root.row, group.root.col, group.cells);
            animationPromises.push(animPromise);
        }
        await Promise.all(animationPromises);

        // Sau khi tất cả animation di chuyển hoàn thành, xử lý logic merge
        AudioManager.getInstance().playSFX(SFXType.Merge);
        // DataManager.getInstance().MyHeart += 1; // Tim đã trừ khi click, không cộng lại ở đây (chỉ khi match)
        // EventBus.emit(EventGame.UPDATE_HEARt_UI); // Cập nhật UI tim nếu có thay đổi

        const gridMgr = GridManager.getInstance();
        const allCellsToRemove: { row: number, col: number }[] = [];
        const newCellsData: { root: { row: number, col: number }, newValue: number }[] = [];

        // Vòng lặp: Đọc và lưu lại tất cả thông tin cần thiết
        for (const group of matchGroups) {
            const rootModel = gridMgr.grid[group.root.row][group.root.col];
            const originalValue = rootModel.value; // Lấy giá trị gốc tại đây

            // Tính điểm dựa trên giá trị gốc
            this.AddScoreAfterMerge(rootModel, group.cells);

            // Chuẩn bị dữ liệu để tạo ô mới sau này
            newCellsData.push({
                root: group.root,
                newValue: originalValue + 1 // Tính toán giá trị mới chính xác
            });

            // Thu thập các ô sẽ bị xóa
            allCellsToRemove.push(...group.cells);
        }

        // Reset data logic của các ô cũ
        gridMgr.ResetDataMatch(allCellsToRemove);

        // Xóa các node UI cũ
        for (const cellPos of allCellsToRemove) {
            if (this.cells[cellPos.row][cellPos.col]) {
                this.cells[cellPos.row][cellPos.col].Dispose();
                this.cells[cellPos.row][cellPos.col] = null;
            }
        }

        // Tạo các ô mới dựa trên dữ liệu đã lưu
        for (const data of newCellsData) {
            const root = data.root;
            const newValue = data.newValue; // Lấy giá trị mới đã được tính đúng

            const newCellModel = new CellModel({
                value: newValue,
                color: gridMgr.GetColorByValue(newValue),
                row: root.row, col: root.col,
            });
            gridMgr.grid[root.row][root.col] = newCellModel;

            const nodeCell = this.CreateCells(newCellModel);
            nodeCell.GetCellUI().setPosition(this.contains[root.row][root.col].position.clone());
            this.cells[root.row][root.col] = nodeCell;
            this.UpdateValueCellBeforeTween(root.row, root.col, nodeCell);

            if (GridManager.getInstance().CheckUpdateMaxCurrent(newValue)) {
                this.isUpLevel = true;
            }
        }

        // Lấp đầy chỗ trống và kiểm tra lại
        // `fillIntheBlank` không cần await vì tween đang chạy trong đó
        this.fillIntheBlank();
        gridMgr.FillIntheValue();

        // Đợi một chút để animation fill hoàn tất trước khi check vòng lặp tiếp theo
        this.scheduleOnce(() => {
            this.checkAllMatchingGroupsLoop(); // Tiếp tục vòng lặp tự động
        }, 0.3); // Tăng thời gian chờ một chút để đảm bảo animation rơi hoàn tất trước khi check lại
    }

    private processAllMatchGroups(rootRow: number, rootCol: number, matched: { row: number, col: number }[]) {

        this.moveMatchedCellsToRoot(rootRow, rootCol, matched);
    }

    //#region UpdateAllFrame
    public UpdateAllFrames(): void {
        const rows = GameManager.getInstance().dataGame.json["row"];
        const cols = GameManager.getInstance().dataGame.json["col"];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = this.cells[i][j];
                if (cell) {
                    cell.cellUI.UpdateUICell(cell.cellData, cell.clickEffect, cell.cellState);
                }
            }
        }
    }

    //#region xoá tất cả min
    /** Xoá toàn bộ ô min rồi rơi & fill lại, min này khi tăng số ô lên mới đúng */
    public removeAllMinCells(): void {

        if (this.isProcessing) return;

        const gridMgr = GridManager.getInstance();
        const rows = GameManager.getInstance().dataGame.json["row"];
        const cols = GameManager.getInstance().dataGame.json["col"];
        const minVal = gridMgr.numberMin - 1; // chưa hiểu vì sao trừ 1

        log('minVal: ', minVal)

        const cellsToRemove: { row: number, col: number }[] = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (gridMgr.grid[i][j].value === minVal) {
                    cellsToRemove.push({ row: i, col: j });
                }
            }
        }

        if (cellsToRemove.length === 0) {
            console.warn("[removeAllMinCells] Không có ô min nào để xoá.");
            return;
        }

        for (const c of cellsToRemove) {
            if (this.cells[c.row][c.col]) {
                this.cells[c.row][c.col].cellUI.PlayAnimationShakeLoop();
                this.isProcessing = true;

                this.scheduleOnce(() => {
                    gridMgr.ResetDataMatch(cellsToRemove);
                    this.cells[c.row][c.col].cellUI.StopAnimationShake();
                    this.cells[c.row][c.col].Dispose();
                    this.cells[c.row][c.col] = null;
                }, 1)
            }
        }

        this.scheduleOnce(() => {
            this.isProcessing = true;
            this.fillIntheBlank();
            gridMgr.FillIntheValue();

            this.scheduleOnce(() => {
                this.checkAllMatchingGroupsLoop();
            }, 0.3);
        }, 1.1)
    }

    //#region xoá tất cả min khi dùng tools
    public removeAllMinCellsTools(): void {
        if (this.isProcessing) return;

        const gridMgr = GridManager.getInstance();
        const rows = GameManager.getInstance().dataGame.json["row"];
        const cols = GameManager.getInstance().dataGame.json["col"];

        const collectCells = (value: number) => {
            const list: { row: number, col: number }[] = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (gridMgr.grid[i][j].value === value) list.push({ row: i, col: j });
                }
            }
            return list;
        };

        let targetVal = 1; // lấy min là 1 luôn cho bao quát trường hợp
        let cellsToRemove: { row: number, col: number }[] = [];

        while (targetVal <= gridMgr.numberMax) {
            cellsToRemove = collectCells(targetVal);
            if (cellsToRemove.length > 0) break;     // đã tìm được
            targetVal++;                             // thử giá trị kế tiếp
        }

        if (cellsToRemove.length === 0) {
            console.warn(`[removeAllMinCells] Không tìm thấy ô nào trong khoảng ${gridMgr.numberMin}…${gridMgr.numberMax}.`);
            return;
        }

        gridMgr.ResetDataMatch(cellsToRemove);

        for (const c of cellsToRemove) {
            const cellRef = this.cells[c.row][c.col];
            if (cellRef) {
                cellRef.cellUI.PlayAnimationShakeLoop();
            }
        }

        this.isProcessing = true;

        this.scheduleOnce(() => {
            EventBus.emit(EventGame.TOOL_FINISHED);

            for (const c of cellsToRemove) {
                const cellRef = this.cells[c.row][c.col];
                if (cellRef) {
                    cellRef.cellUI.StopAnimationShake();
                    cellRef.Dispose();
                    this.cells[c.row][c.col] = null;
                }
            }

            this.fillIntheBlank();
            gridMgr.FillIntheValue();

            this.scheduleOnce(() => {
                this.checkAllMatchingGroupsLoop();   // tự mở khoá click khi xong
            }, 0.3);
        }, 1);
    }

    //#region Hammer tools
    public async HandleHammerAt(row: number, col: number) {
        if (this.isProcessing) return;

        EventBus.emit(EventGame.TOOL_FINISHED);

        this.isProcessing = true;

        const gridMgr = GridManager.getInstance();

        const targetCell = this.cells[row][col];
        if (!targetCell) {
            this.isProcessing = false;
            return;
        }

        targetCell.cellUI.PlayAnimationShakeLoop();

        await new Promise(r => setTimeout(r, 1000)); // chờ rung 1 s

        targetCell.cellUI.StopAnimationShake();

        // Xoá dữ liệu logic
        gridMgr.grid[row][col].value = -1;
        this.cells[row][col].Dispose();
        this.cells[row][col] = null;

        // Rơi và fill
        await this.FillAfterHammer();

        // Tự check merge
        this.checkAllMatchingGroupsLoop();
    }

    /** Cho cell rơi xuống và fill lại sau khi dùng búa */
    private async FillAfterHammer(): Promise<void> {
        this.fillIntheBlank();
        GridManager.getInstance().FillIntheValue();

        return new Promise(resolve => {
            this.scheduleOnce(() => {
                resolve();
            }, 0.3);
        });
    }

    //#region Upgrade tools
    public HandleUpgradeAt(row: number, col: number): void {
        if (this.isProcessing) return;

        EventBus.emit(EventGame.TOOL_FINISHED);

        const gridMgr = GridManager.getInstance();
        const cell = this.cells[row][col];
        if (!cell) return;

        const maxUpgradeVal = gridMgr.numberMax - 1;
        const cellModel = cell.cellData;

        // Không nâng cấp nếu đã >= max
        if (cellModel.value >= maxUpgradeVal) {
            cell.cellUI.PlayAnimationShake();
            return;
        }

        // Cập nhật model
        cellModel.value = maxUpgradeVal;
        cellModel.color = gridMgr.GetColorByValue(maxUpgradeVal);

        // Cập nhật UI
        cell.cellUI.UpdateUICell(cellModel, cell.clickEffect, cell.cellState);

        this.UpdateAllFrames();

        // Nếu chạm mốc max, cập nhật unlock max
        if (gridMgr.CheckUpdateMaxCurrent(maxUpgradeVal)) {
            this.isUpLevel = true;
        }

        // Tự check merge
        this.checkAllMatchingGroupsLoop();
    }

    //#region Swap tools
    public swapCallback: ((row: number, col: number) => void) = null;

    public EnableSwapMode(callback: ((row: number, col: number) => void) | null) {
        this.swapCallback = callback;
    }

    public async HandleSwap(a: { row: number, col: number }, b: { row: number, col: number }) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        const cellA = this.cells[a.row][a.col];
        const cellB = this.cells[b.row][b.col];

        if (!cellA || !cellB) {
            this.isProcessing = false;
            return;
        }

        // Hoán đổi logic data
        const tempModel = GridManager.getInstance().grid[a.row][a.col];
        GridManager.getInstance().grid[a.row][a.col] = GridManager.getInstance().grid[b.row][b.col];
        GridManager.getInstance().grid[b.row][b.col] = tempModel;

        // Cập nhật vị trí trong model
        GridManager.getInstance().grid[a.row][a.col].row = a.row;
        GridManager.getInstance().grid[a.row][a.col].col = a.col;
        GridManager.getInstance().grid[b.row][b.col].row = b.row;
        GridManager.getInstance().grid[b.row][b.col].col = b.col;

        // Hoán đổi tham chiếu trong mảng UI
        const posA = this.contains[a.row][a.col].position.clone();
        const posB = this.contains[b.row][b.col].position.clone();
        const nodeA = cellA.GetCellUI();
        const nodeB = cellB.GetCellUI();
        this.cells[a.row][a.col] = cellB;
        this.cells[b.row][b.col] = cellA;

        // Chạy animation di chuyển
        const tweenA = new Promise(resolve => {
            tween(nodeA).to(0.2, { position: posB }).call(resolve).start();
        });
        const tweenB = new Promise(resolve => {
            tween(nodeB).to(0.2, { position: posA }).call(resolve).start();
        });

        await Promise.all([tweenA, tweenB]);

        // Cập nhật lại UI của 2 ô vừa hoán đổi
        this.UpdateValueCellBeforeTween(a.row, a.col, this.cells[a.row][a.col]);
        this.UpdateValueCellBeforeTween(b.row, b.col, this.cells[b.row][b.col]);

        // Kiểm tra xem có nhóm nào được tạo ở vị trí A hoặc B không
        const matchA = GridManager.getInstance().findConnectedCells(a.row, a.col);
        const matchB = GridManager.getInstance().findConnectedCells(b.row, b.col);

        if (matchA.length >= 3 || matchB.length >= 3) {
            // Nếu có, gọi vòng lặp xử lý chính của game
            this.scheduleOnce(() => {
                this.checkAllMatchingGroupsLoop();
            }, 0.1);
        } else {
            // Nếu không có nhóm nào được tạo, mở khóa và cho người chơi đi tiếp
            this.isProcessing = false;
        }
    }

    //#region restart game
    public RestartGame(): void {
        this.isProcessing = true;

        // Xoá tất cả Cell UI
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const cell = this.cells[i][j];
                if (cell) {
                    cell.Dispose();
                    this.cells[i][j] = null;
                }
            }
        }

        for (const node of this.cellContainColllection) {
            node.destroy(); // hoặc node.destroy() nếu không dùng pool
        }

        // Reset UI và biến
        this.cells = [];
        this.contains = [];
        this.cellContainColllection = [];
        this.cellCollection = new CellCollection(); // làm mới bộ nhớ pool

        this.consecutiveMerges = 0;
        this.isUpLevel = false;

        // Gọi hàm reset logic từ GridManager
        GridManager.getInstance().ResetGridState();

        // Khởi tạo lại UI
        this.InitContainCells();
        this.InitCells();

        // Gọi check match đầu tiên
        this.scheduleOnce(() => {
            this.checkAllMatchingGroupsLoop();
        }, 0.3);

        Utils.getInstance().ResetHeart(5); // reset tim
        EventBus.emit(EventGame.UPDATE_HEARt_UI); // update Ui
        EventBus.emit(EventGame.RESET_SCORE);
    }

    //#region Load State

    protected onDestroy(): void {
        this.UnRegisEventBeforUnload();
    }

    // Đăng ký sự kiện beforeunload cho trình duyệt, sự kiện game hide/close
    RegisEventBeforUnload() {
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        }
        // Đăng ký sự kiện game hide/close
        game.on('hide', this.SaveGame.bind(this));
        game.on('close', this.SaveGame.bind(this));
    }

    UnRegisEventBeforUnload() {
        // Hủy đăng ký sự kiện
        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        }
        game.off('hide', this.SaveGame.bind(this));
        game.off('close', this.SaveGame.bind(this));
    }

    private handleBeforeUnload(): void {
        this.SaveGame();
    }

    public SaveGame() {
        DataManager.getInstance().SaveGameState({
            grid: GridManager.getInstance().grid.map(row => row.map(cell => ({
                value: cell.value,
                row: cell.row,
                col: cell.col,
                color: cell.color
            }))),
            numberMin: GridManager.getInstance().numberMin,
            numberMax: GridManager.getInstance().numberMax,
            heart: DataManager.getInstance().MyHeart,
            score: DataManager.getInstance().CoreInPlayGame, // hoặc score hiện tại
        });

    }

    async LoadGame() {
        this.isProcessing = true; // Khóa input trong lúc load

        this.init(); // Tạo CellCollection
        this.cells = [];
        this.contains = [];
        this.cellContainColllection = [];

        const savedData = await DataManager.getInstance().LoadGameState();

        // 3. Quyết định luồng chạy
        if (savedData) {

            GridManager.getInstance().grid = savedData.grid.map(row =>
                row.map(c => new CellModel({ value: c.value, color: c.color, row: c.row, col: c.col }))
            );
            GridManager.getInstance().numberMin = savedData.numberMin;
            GridManager.getInstance().numberMax = savedData.numberMax;

            DataManager.getInstance().MyHeart = savedData.heart;
            DataManager.getInstance().CoreInPlayGame = savedData.score;
            EventBus.emit(EventGame.UPDATE_HEARt_UI);
            EventBus.emit(EventGame.UPGRADE_SCORE, 0);

        } else {
            log("🔥 No save data, starting a new game...");

            GridManager.getInstance().initNewGrid();
        }

        this.InitContainCells();
        this.InitCells();

        this.scheduleOnce(() => {
            this.checkAllMatchingGroupsLoop();
        }, 0.25);

        EventBus.on(EventGame.GRID_CELL_UPDATED_EVENT, this.OnUpdateUi, this);
    }


}


