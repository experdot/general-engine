import {
    GeneralGrid
} from "../../../Engine/Common/GeneralGrid";
import {
    Vector2
} from "../../../Engine/Numerics/Vector2";
import {
    Color
} from "../../../Engine/UI/Color";
import {
    BlockGroupHelper
} from "./BlockGroup";

class BlockGrid extends GeneralGrid {
    constructor(width = 1, height = 1) {
        super(width, height);
        this.current = null;
        this.next = null;
        this.upOffset = new Vector2(0, 0);
        this.downOffset = new Vector2(0, -1);
        this.leftOffset = new Vector2(-1, 0);
        this.rightOffset = new Vector2(1, 0);
        this.indexOffset = 1;

        let colors = ["#EE1111", "#11EE11", "#1111EE", "#EEEE11", "#11EEEE", "#EE11EE"];
        this.colors = colors.map(v => Color.FromHex(v));

        this.blockGroups = BlockGroupHelper.getStandardGroups();
        this.generateNext();
        this.generateCurrent();
    }

    setCurrent(current) {
        this.current = current;
    }

    generateNext() {
        let nextIndex = Math.floor(Math.random() * this.blockGroups.length);
        let nextLocation = new Vector2(Math.floor(this.width * Math.random()), this.height - 1);
        let nextRotation = Math.floor(Math.random() * 4);
        this.next = this.blockGroups[nextIndex].clone().setLocation(nextLocation).rotate(nextRotation);
    }

    generateCurrent() {
        this.current = this.next;
        this.generateNext();
    }

    up() {
        if (this._checkMoveAvaliable(this.current, this.upOffset, this.indexOffset)) {
            this.current.move(this.upOffset).rotate(this.indexOffset);
        }
    }
    down() {
        if (this._checkMoveAvaliable(this.current, this.downOffset)) {
            this.current.move(this.downOffset);
        } else {
            if (this.current.location.y === this.height - 1) {
                this.over();
            } else {
                this.combineBlock(this.current);
                this.generateCurrent();
            }
        }
    }
    left() {
        if (this._checkMoveAvaliable(this.current, this.leftOffset)) {
            this.current.move(this.leftOffset);
        }
    }
    right() {
        if (this._checkMoveAvaliable(this.current, this.rightOffset)) {
            this.current.move(this.rightOffset);
        }
    }

    over() {
        if (!this.overFlag) {
            alert("Game Over");
        }
        this.overFlag = true;
    }


    _checkMoveAvaliable(group, offset = Vector2.Zero(), indexOffset = 0, annular = true) {
        let locations = this.current.getLocations(indexOffset);
        for (let index = 0; index < locations.length; index++) {
            const location = locations[index].add(offset);
            if (annular) {
                location.x = location.x % this.width;
                if (location.x < 0) {
                    location.x += this.width;
                }
            }
            if (location.y < 0 || this.getCell(location.x, location.y)) {
                return false;
            }
        }
        return true;
    }
    combineBlock(target, annular = true) {
        let color = this.colors[Math.floor(this.colors.length * Math.random())];
        target.getBlocks().forEach(block => {
            if (block) {
                if (annular) {
                    block.location.x = block.location.x % this.width;
                    if (block.location.x < 0) {
                        block.location.x += this.width;
                    }
                }
                this.setCell(block.location.x, block.location.y, block.setColor(color));
            }
        });
        this.combineFullRow();
    }
    combineFullRow() {
        let maxRow = this._findMaxRow();
        let changedFlag = false;
        for (let y = 0; y < maxRow; y++) {
            if (this._checkFullRow(y)) {
                this._clearSingleRow(y);
                changedFlag = true;
            }
        }
        if (changedFlag) {
            this._updateBlockLocation();
        }
    }

    _findMaxRow() {
        let max = -1;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.getCell(x, y)) {
                    max = y;
                    break;
                }
            }
        }
        return max;
    }
    _clearSingleRow(y) {
        for (let x = 0; x < this.width; x++) {
            this.grid[x].splice(y, 1);
            this.grid[x].push(null);
        }
    }
    _checkFullRow(y) {
        for (let x = 0; x < this.width; x++) {
            if (!this.getCell(x, y)) {
                return false;
            }
        }
        return true;
    }
    _updateBlockLocation() {
        this.forEach((block, x, y) => {
            block && block.setLocation(new Vector2(x, y));
        });
    }
}

export {
    BlockGrid
};