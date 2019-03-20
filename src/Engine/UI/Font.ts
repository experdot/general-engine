export class Emoji {
    static get all() {
        if (!this.values) {
            const codes = [[0x1F300, 0x1F3FF], [0x1F300, 0x1F3FF], [0x1F300, 0x1F3FF]];
            this.values = codes.reduce((pre, cur) => pre.concat(this.range(cur[0], cur[1]))).map(v => String.fromCodePoint(v));
        }
        return this.values;
    }

    private static values: string[];

    private static range(start: number, end: number) {
        return Array.from(Array(end - start + 1).keys()).map((v, index) => start + index);
    }
}

export class RandomEmoji {
    static get one() {
        const values = Emoji.all;
        return values[Math.floor(Math.random() * values.length)];
    }
}