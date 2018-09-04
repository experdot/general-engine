import { GeneralObject } from "../../Core/GeneralObject";
import { AppInterface, IAppProcesses } from "../AppInterface/AppInterface";

export class App extends GeneralObject<IAppProcesses> {
    constructor() {
        super();
        this.implements(AppInterface);
    }
}