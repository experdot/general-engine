import { GeneralInterface } from "../../Core/GeneralObject";

export class GameObjectInterface extends GeneralInterface {
    start = [];
    dispose = [];
}

export class GameViewInterface extends GameObjectInterface {
    render: [CanvasRenderingContext2D] = [] as any;
}

export class GameGUIInterface extends GameObjectInterface {
    gui: [HTMLElement] = [] as any;
}

export class GameEffectInterface extends GameObjectInterface {
    update: [] = [] as any;
}

export class GameVsiualInterface extends GameObjectInterface {
    render: [CanvasRenderingContext2D] = [] as any;
    gui: [HTMLElement] = [] as any;
    update: [] = [] as any;
}