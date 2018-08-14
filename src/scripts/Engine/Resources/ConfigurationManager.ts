import { ResourceManager } from "./ResourceManager";
import { ResourceSet } from "./ResourceSet";

export class ConfigurationManager extends ResourceManager {
    url: string;
    target: any;

    constructor(url: string, target?: object) {
        super()
        this.url = url;
        this.target = target;
    }

    load(loaded?: Function) {
        return super.load(() => {
            this.target && this.assign(this.target);
            loaded && loaded();
        });
    }

    attach(target) {
        this.clear().add(new ResourceSet(this.url));
        this.target = target;
        return this;
    }
}