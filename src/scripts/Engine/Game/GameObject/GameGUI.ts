import { GeneralObject } from "../../Core/GeneralObject";
import { GameGUIInterface, IGameGUIProcesses } from "../GameInterface/GameInterface";

/** 
 * Represents a GUI attached to the visual object
 */
export class GameGUI extends GeneralObject<IGameGUIProcesses> {
    constructor() {
        super();
        this.implements(GameGUIInterface);
    }
}