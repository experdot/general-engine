import {
    Color
} from "../../../Engine/UI/Color";
import {
    Array2
} from "../../../Engine/Collections/Array2";

export class CellularAutomata extends Array2 {
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
        for (let i = 0; i < 8; i++) {
            const tx = x + xOffsets[i];
            const ty = y + yOffsets[i];
            if (this.data[tx] && this.data[tx][ty]) {
                r += this.data[tx][ty].color.r;
                g += this.data[tx][ty].color.g;
                b += this.data[tx][ty].color.b;
                count += 1;
            }
        }
        return new Color(r / count, g / count, b / count);
    }

    grow(growth: number = 0.001) {
        this.forEach(cell => {
            if (cell && cell.scale < 1) {
                cell.scale += growth;
            }
        });
    }
}