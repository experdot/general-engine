class GeneralGrid {
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

    kill(x, y) {
        delete this.grid[x][y];
    }

    setCell(x, y, cell) {
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
    GeneralGrid
};