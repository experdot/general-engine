import { GeneralObject } from "../../Core/GeneralObject";
import { AppInterface } from "../AppInterface/AppInterface";

export class App extends GeneralObject<AppInterface> {
    constructor() {
        super();
        this.implements(new AppInterface());
    }
}