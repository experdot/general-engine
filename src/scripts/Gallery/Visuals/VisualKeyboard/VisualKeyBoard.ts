import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";

export class VisualKeyBoard extends GameVisual {
    constructor() {
        super();

    }

    start(source: any) {
        throw new Error("method is not implemented.");
    }

    update() {
        throw new Error("method is not implemented.");
    }

    dispose() {
        super.dispose();
        throw new Error("method is not implemented.");

    }
}