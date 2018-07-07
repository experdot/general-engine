import {
    GeneralGrid
} from "../../../Engine/Common/GeneralGrid";
import {
    Color
} from "../../../Engine/UI/Color";

class CellularAutomata extends GeneralGrid {
    generate() {
        return new CellularAutomata(this.width, this.height);
    }

    around(x, y, xOffsets, yOffsets) {
        let result = 0;
        for (let i = 0; i < 8; i++) {
            const tx = x + xOffsets[i];
            const ty = y + yOffsets[i];
            if (this.grid[tx] && this.grid[tx][ty]) {
                result += 1;
            }
        }
        return result;
    }

    aroundColor(x, y, xOffsets, yOffsets) {
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < 8; i++) {
            const tx = x + xOffsets[i];
            const ty = y + yOffsets[i];
            if (this.grid[tx] && this.grid[tx][ty]) {
                r += this.grid[tx][ty].color.r;
                g += this.grid[tx][ty].color.g;
                b += this.grid[tx][ty].color.b;
                count += 1;
            }
        }
        return new Color(r / count, g / count, b / count);
    }
}

export {
    CellularAutomata
};