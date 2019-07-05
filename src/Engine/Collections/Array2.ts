class Array2<T> {
    readonly width: number;
    readonly height: number;
    readonly data: T[][];

    constructor(width: number = 1, height: number = 1) {
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

    set(x: number, y: number, value: T): T {
        this.data[x][y] = value;
        return this.data[x][y];
    }

    get(x: number, y: number): T {
        return this.data[x][y];
    }

    forEach(action: (value: T, x: number, y: number) => void): void {
        this.data.forEach((column: T[], x: number) => {
            column && column.forEach((value, y) => {
                action && action(value, x, y);
            });
        });
    }
}

export {
    Array2
};