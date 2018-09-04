import { GeneralObject } from "../../Core/GeneralObject";
import { GameViewInterface, IGameViewProcesses } from "../GameInterface/GameInterface";

/** 
 * Represents a view to present the visual object
 */
export class GameView extends GeneralObject<IGameViewProcesses> {
    constructor() {
        super();
        this.implements(GameViewInterface);
    }
}

/** 
 * Represents a view to present the visual object
 */
export abstract class TypedGameView<T> extends GameView {
    constructor() {
        super();
        this.implements(GameViewInterface);
    }

    abstract render(source: T, context: CanvasRenderingContext2D);
}