import { Vector2 } from "../Numerics/Vector2";

export class EventHelper {
    static getEventClientPositon(event: MouseEvent | TouchEvent) {
        if (event instanceof MouseEvent) {
            return new Vector2(event.clientX, event.clientY);
        } else if (event instanceof TouchEvent) {
            return new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        } else {
            return null;
        }
    }
}