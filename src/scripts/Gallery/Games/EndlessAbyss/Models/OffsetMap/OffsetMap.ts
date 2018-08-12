import { Vector2 } from "../../../../../Engine/Numerics/Vector2";

export class OffsetMap {
    offsets: Vector2[];

    constructor(offsets: Vector2[]) {
        this.offsets = offsets;
    }

    setOffsets(offsets: Vector2[]) {
        this.offsets = offsets;
        return this;
    }
    getLocations(location: Vector2) {
        let result: Vector2[] = [];
        this.offsets.forEach((offset: Vector2) => {
            result.push(location.add(offset));
        });
        return result;
    }
}