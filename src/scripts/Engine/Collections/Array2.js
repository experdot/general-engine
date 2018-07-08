class Array2 {
    constructor(width = 1, height = 1) {
        this.width = width;
        this.height = height;
        this.data = [];
        for (let x = 0; x < width; x++) {
            this.data.push([]);
            for (let y = 0; y < height; y++) {
                this.data[x][y] = undefined;
            }
        }
    }

    set(x, y, value) {
        this.data[x][y] = value;
        return this.data[x][y];
    }

    get(x, y) {
        return this.data[x][y];
    }

    forEach(action) {
        this.data.forEach((column, x) => {
            column && column.forEach((value, y) => {
                action && action(value, x, y);
            });
        });
    }
}

export {
    Array2
};