import {
    Cell
} from "./Cell";

class CellularAutomata {
    constructor(width = 1, height = 1) {
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

    kill(x, y) {
        delete this.grid[x, y];
    }

    setCell(x, y, cell = new Cell()) {
        this.grid[x][y] = cell;
        return this.grid[x][y];
    }

    getCell(x, y) {
        return this.grid[x][y];
    }

    forEach(action) {
        let x = 0;
        this.grid.forEach(column => {
            column && column.forEach((cell, index) => {
                action && action(cell, x, index);
            });
            x += 1;
        });
    }


}

export {
    CellularAutomata
};