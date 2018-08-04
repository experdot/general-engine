import { HttpWebRequest } from "../Network/Network";
import { ResourceSet } from "./ResourceSet";

export class ResourceManager {
    sets: ResourceSet[];

    constructor() {
        this.sets = [];
    }

    add(...sets: ResourceSet[]) {
        this.sets.push(...sets);
    }

    load(loaded?: Function) {
        let count = 0;
        let length = this.sets.length;

        this.sets.forEach(element => {
            HttpWebRequest.get(element.src, (response: any) => {
                element.init(JSON.parse(response))
                count += 1;
                if (count = length) {
                    loaded && loaded();
                }
            });
        })

        return this;
    }
}