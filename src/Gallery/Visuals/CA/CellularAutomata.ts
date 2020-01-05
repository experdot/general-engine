import { Color } from "../../../Engine/UI/Color";
import { Array2 } from "../../../Engine/Collections/Array2";
import { Cell } from "./Cell";

export class CellularAutomata extends Array2<Cell> {
    generate() {
        return new CellularAutomata(this.width, this.height);
    }

    around(x: number, y: number, xOffsets: number[], yOffsets: number[]) {
        let result = 0;
        for (let i = 0; i < 8; i++) {
            const tx = x + xOffsets[i];
            const ty = y + yOffsets[i];
            if (this.data[tx] && this.data[tx][ty]) {
                result += 1;
            }
        }
        return result;
    }

    aroundColor(x: number, y: number, xOffsets: number[], yOffsets: number[]) {
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        let rd = 0;
        let gd = 0;
        let bd = 0;

        const length = xOffsets.length;
        const current = this.data[x][y];

        const absCr = Math.abs(current.color.r);
        const absCg = Math.abs(current.color.g);
        const absCb = Math.abs(current.color.b);

        for (let i = 0; i < length; i++) {
            const tx = x + xOffsets[i];
            const ty = y + yOffsets[i];
            const target = this.data[tx] && this.data[tx][ty];
            if (target) {
                const absTr = Math.abs(target.color.r);
                const absTg = Math.abs(target.color.g);
                const absTb = Math.abs(target.color.b);

                const distance = (Math.abs(xOffsets[i]) + Math.abs(yOffsets[i])) === 2 ? 1.41421356 : 1;
                r += absTr / distance;
                g += absTg / distance;
                b += absTb / distance;
                count += 1;
                rd += Math.abs(target.color.r - current.color.r);
                gd += Math.abs(target.color.g - current.color.g);
                bd += Math.abs(target.color.b - current.color.b);
            }
        }

        const radio = 0.38;
        const dr = current.color.r + (r / count - absCr) * radio * Math.sign(current.color.r);
        const dg = current.color.g + (g / count - absCg) * radio * Math.sign(current.color.g);
        const db = current.color.b + (b / count - absCb) * radio * Math.sign(current.color.b);
        const aroundColor = new Color(dr, dg, db);

        const aRadio = 130;
        const ar = rd / count / 255 * aRadio;
        const ag = gd / count / 255 * aRadio;
        const ab = bd / count / 255 * aRadio;
        const aroundDeltas = { ar, ag, ab };
        return { aroundColor, aroundDeltas };
    }
}