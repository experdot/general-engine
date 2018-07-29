import {
    Network
} from "../Network/Network";

class ResourceManager {
    constructor() {
        this.data = {};
    }

    get(key) {
        return this.data[key];
    }

    load(src, target) {
        this.loaded = false;
        Network.get(src, response => {
            this.data = JSON.parse(response);
            target && this._attach(target);
            this.loaded = true;
        });
        return this;
    }

    wait(callback, timeout = 10) {
        let waitHandler = () => {
            if (this.loaded) {
                callback && callback();
            } else {
                setTimeout(waitHandler, timeout, callback);
            }
        };
        waitHandler();
    }

    _attach(target) {
        for (let key in target) {
            target[key] = this.data[key];
        }
    }
}

export {
    ResourceManager
};