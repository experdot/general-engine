import { GeneralInterface } from "../../Core/GeneralObject";

export class GameObjectInterface extends GeneralInterface {
    start = [];
    dispose = [];
}

export class GameViewInterface extends GameObjectInterface {
    render = [CanvasRenderingContext2D];
}

export class GameGUIInterface extends GameObjectInterface {
    gui = [HTMLElement];
}

export class GameEffectInterface extends GameObjectInterface {
    update = [];
}

export class GameVsiualInterface extends GameObjectInterface {
    render = [CanvasRenderingContext2D];
    gui = [HTMLElement];
    update = [];
}

