import {
    AnimationBox
} from "./Engine/Core/AnimationBox";
import {
    CustomWorld
} from "./Gallery/CustomWorld";

attachObjectToTarget(window, "Natural2D", {});
attachObjectToTarget(window.Natural2D, "AnimationBox", AnimationBox);
attachObjectToTarget(window.Natural2D, "CustomWorld", CustomWorld);

function attachObjectToTarget(target, key, value) {
    if (!target[key]) {
        target[key] = value;
    }
}