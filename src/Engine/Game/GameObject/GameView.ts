import { GeneralObject } from "../../Core/GeneralObject";
import { GameViewInterface } from "../GameInterface/GameInterface";

/** 
 * Represents a view to present the visual object
 */
export class GameView extends GeneralObject<GameViewInterface> {
    constructor() {
        super();
        this.implements(new GameViewInterface());
    }
}

/** 
 * Represents a view to present the visual object
 */
export abstract class TypedGameView<T> extends GameView {
    abstract render(source: T, context: CanvasRenderingContext2D): void;
}