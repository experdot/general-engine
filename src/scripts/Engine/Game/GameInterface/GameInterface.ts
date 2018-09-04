import { GeneralInterface } from "../../Core/GeneralInterface";
import { TypedGeneralProcess, VoidGeneralProcess } from "../../Core/GeneralProcess";

export const GameObjectInterface = new GeneralInterface(["start", "dispose"]);

export const GameViewInterface = GameObjectInterface.clone().extends(["render"]);
export const GameGUIInterface = GameObjectInterface.clone().extends(["gui"]);
export const GameEffectInterface = GameObjectInterface.clone().extends(["update"]);

export const GameVisualInterface = GameObjectInterface.clone().extends(["update", "gui", "render"]);


export interface IGameObjectProcesses {
    start: VoidGeneralProcess;
    dispose: VoidGeneralProcess;
}

export interface IGameViewProcesses extends IGameObjectProcesses {
    render: TypedGeneralProcess<CanvasRenderingContext2D>;
}

export interface IGameGUIProcesses extends IGameObjectProcesses {
    gui: TypedGeneralProcess<HTMLElement>;
}

export interface IGameEffectProcesses extends IGameObjectProcesses {
    update: VoidGeneralProcess;
}

export interface IGameVsiualProcesses extends IGameObjectProcesses, IGameViewProcesses, IGameGUIProcesses, IGameEffectProcesses {

}

