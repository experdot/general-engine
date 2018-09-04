import { GeneralInterface } from "../../Core/GeneralInterface";
import { VoidGeneralProcess } from "../../Core/GeneralProcess";

export const AppInterface = new GeneralInterface(["launch", "run", "dispose"]);

export interface IAppProcesses {
    launch: VoidGeneralProcess;
    run: VoidGeneralProcess;
    dispose: VoidGeneralProcess;
}