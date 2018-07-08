import {
    Array2
} from "../../../../Engine/Collections/Array2";

class ArrayGrid extends Array2 {
    constructor(w, h) {
        super(w, h);

        this.forEach((cell, x, y) => {
            this.data[x][y] = [];
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
                result.push(...this.data[dx][dy]);
            }
        }
        return result;
    }
}

export {
    ArrayGrid
};