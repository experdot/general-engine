import {
    GeneralGrid
} from "../../../Common/GeneralGrid";

class CellularAutomata extends GeneralGrid {
    generate() {
        return new CellularAutomata(this.width, this.height);
    }

    around(x, y, offsetX, offsetY) {
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
}

export {
    CellularAutomata
};