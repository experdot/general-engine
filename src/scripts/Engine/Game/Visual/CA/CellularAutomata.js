import {
    GeneralGrid
} from "../../../Common/GeneralGrid";

class CellularAutomata extends GeneralGrid {
    constructor(width = 1, height = 1) {
        super(width, height);
        this.width = width;
        this.height = height;
        this.grid = [];
        for (let x = 0; x < width; x++) {
            this.grid.push([]);
            for (let y = 0; y < height; y++) {
                this.grid[x][y] = undefined;
            }
        }
    }

    generate() {
        return new CellularAutomata(this.width, this.height);
    }
    getAround(x, y, offsetX, offsetY) {
        let result = 0;
        for (let i = 0; i < 8; i++) {
            const tx = x + offsetX[i];
            const ty = y + offsetY[i];
            if (this.grid[tx] && this.grid[tx][ty]) {
                result += 1;
            }
        }
        return result;
    }
}

export {
    CellularAutomata
};