
import {
    AnimationBox
} from "./Engine/Core/GameAnimation/AnimationBox";
import {
    GameStarter
} from "./Gallery/GameStarter/GameStarter";

const natural2D = {
    AnimationBox: AnimationBox,
    GameStarter: GameStarter
};

(window as any).Natural2D = natural2D;