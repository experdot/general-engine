import {
    GeneralGrid
} from "../../../../Engine/Common/GeneralGrid";

class ArrayGrid extends GeneralGrid {
    constructor(w, h) {
        super(w, h);

        this.forEach((cell, x, y) => {
            this.grid[x][y] = [];
        });

        this.offsetX = [0, -1, 0, 1, 1, 1, 0, -1, -1];
        this.offsetY = [0, -1, -1, -1, 0, 1, 1, 1, 0];
    }

    clear() {
        this.forEach(cell => {
            cell.splice(0, cell.length);
        });
    }

    neighbours(x, y) {
        let result = [];
        for (let i = 0; i < 9; i++) {
            let dx = x + this.offsetX[i];
            let dy = y + this.offsetY[i];
            if (dx >= 0 && dx < this.width && dy >= 0 && dy < this.height) {
                result.push(...this.grid[dx][dy]);
            }
        }
        return result;
    }
}

export {
    ArrayGrid
};