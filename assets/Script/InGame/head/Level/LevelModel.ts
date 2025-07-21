export class LevelModel {
    level: number
    currentExp: number
    expToNextLevel: number
    progress: number


    constructor(init: Partial<LevelModel>) {
        Object.assign(this, init);
    }
}
