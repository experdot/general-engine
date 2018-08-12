class Array2 {
    width: number;
    height: number;
    data: any[];

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

    set(x: number, y: number, value: any): any {
        this.data[x][y] = value;
        return this.data[x][y];
    }

    get(x: number, y: number): any {
        return this.data[x][y];
    }

    forEach(action: (value: any, x: number, y: number) => void): void {
        this.data.forEach((column: any[], x: number) => {
            column && column.forEach((value, y) => {
                action && action(value, x, y);
            });
        });
    }
}

export {
    Array2
};