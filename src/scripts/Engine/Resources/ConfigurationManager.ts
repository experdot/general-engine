import { ResourceManager } from "./ResourceManager";
import { ResourceSet } from "./ResourceSet";

export class ConfigurationManager extends ResourceManager {
    url: string;
    target: any;

    constructor(url: string) {
        super()
        this.url = url;
        this.add(new ResourceSet(this.url));
    }

    load(loaded?: Function) {
        return super.load(() => {
            this.target && this.assign(this.target);
            loaded && loaded();
        });
    }

    attach(target) {
        this.target = target;
        return this;
    }
}