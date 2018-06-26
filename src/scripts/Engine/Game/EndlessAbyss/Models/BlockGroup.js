import {
    Vector2
} from "../../../../Fundamental/Vector";
import {
    OffsetMap
} from "./OffsetMap/OffsetMap";

class BlockGroup {
    constructor() {
        this.location = new Vector2(0, 0);
        this.offsetMaps = [];
        this.current = 0;
    }

    setLocation(location) {
        this.location = location;
        return this;
    }

    addOffsetMap(offsetGroup) {
        this.offsetMaps.push(offsetGroup);
        return this;
    }

    getLocations() {
        return this.offsetMaps[this.current].getLocations(this.location);
    }

    move(offset) {
        this.location = this.location.add(offset);
        return this;
    }

    rotate() {
        this.current = (this.current + 1) % this.offsetMaps.length;
        return this;
    }
}

class BlockGroupHelper {
    static getStandardGroups() {
        let groups = [];
        /*eslint-disable*/
        const maps = [
            //I
            [{
                x: [0, 0, 0, 0],
                y: [0, -1, -2, -3]
            }, {
                x: [0, 1, 2, 3],
                y: [0, 0, 0, 0]
            }],
            //J
            [{
                x: [1, 1, 1, 0],
                y: [0, -1, -2, -2]
            }, {
                x: [0, 0, 1, 2],
                y: [, -1, -1, -1]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }],
            //L
            [{
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }],
            //O
            [{
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }],
            //S
            [{
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }],
            //Z
            [{
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }],
            //T
            [{
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }, {
                x: [0, 0, 0, 0],
                y: [0, 0, 0, 0]
            }]
        ];
        /*eslint-enable*/

        maps.forEach(element => {
            let group = new BlockGroup();
            element.forEach(offsetsWithXY => {
                let offsets = [];
                for (let index = 0; index < offsetsWithXY.x.length; index++) {
                    offsets.push(new Vector2(offsetsWithXY.x[index], offsetsWithXY.y[index]));
                }
                group.addOffsetMap(new OffsetMap(offsets));
            });
            groups.push(group);
        });
        return groups;
    }
}

export {
    BlockGroup,
    BlockGroupHelper
};