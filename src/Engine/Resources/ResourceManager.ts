import { HttpWebRequest } from "../Network/Network";
import { ResourceSet } from "./ResourceSet";

export class ResourceManager {
    sets: ResourceSet[];
    preload: (preloaded?: Function) => void;

    constructor() {
        this.sets = [];
    }

    add(...sets: ResourceSet[]) {
        this.sets.push(...sets);
    }

    clear() {
        this.sets = [];
        return this;
    }

    load(loaded?: Function) {
        if (this.preload) {
            this.preload(() => {
                this.loading(loaded);
            });
        }
        else {
            this.loading(loaded);
        }
        return this;
    }

    assign(target: any) {
        this.sets.forEach(element => {
            for (const key in target) {
                const value = element.data[key]
                if (value !== undefined) {
                    target[key] = element.data[key];
                }
            }
        });
        return this;
    }

    private loading(loaded?: Function) {
        let count = 0;
        const length = this.sets.length;

        this.sets.forEach(element => {
            HttpWebRequest.get(element.src, (response: any) => {
                element.init(JSON.parse(response))
                count += 1;
                if (count === length) {
                    loaded && loaded();
                }
            });
        })
    }
}