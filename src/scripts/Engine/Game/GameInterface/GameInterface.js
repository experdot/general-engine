import {
    GeneralInterface
} from "../../Core/GeneralInterface";


export const GameObjectInterface = new GeneralInterface(["$start", "$dispose"]);

export const GameViewInterface = GameObjectInterface.clone().extends(["$render"]);
export const GameGUIInterface = GameObjectInterface.clone().extends(["$gui"]);
export const GameEffectInterface = GameObjectInterface.clone().extends(["$update"]);

export const GameVisualInterface = GameObjectInterface.clone().extends(["$update", "$gui", "$render"]);