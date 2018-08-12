import { GeneralObject } from "../../Core/GeneralObject";
import { AppInterface } from "../AppInterface/AppInterface";

export class App extends GeneralObject {
    constructor() {
        super();
        this.implements(AppInterface);
    }
}