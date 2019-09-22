import {GameWorld} from "../../Engine/Game/GameWorld/GameWorld";
import { PointerInput } from "../../Engine/Inputs/PointerInput";
import {
    GameOfLife,
    GameOfLifeView
} from "./CA/GameOfLife/GameOfLife";

export class GameOfLifeWorld extends GameWorld {
    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new GameOfLife().joint(new GameOfLifeView()));
    }
}