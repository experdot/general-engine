import {
    AnimationBox
} from "../Engine/Core/GameAnimation/AnimationBox";
import {
    ParticlesFlyerWorld
} from "./ParticlesFlyerWorld";
import {
    ParticlesWalkerWorld
} from "./ParticlesWalkerWorld";
import {
    ParticlesTreeWorld
} from "./ParticlesTreeWorld";
import {
    LSystemTreeWorld
} from "./LSystemTreeWorld";

class GameStarter {
    constructor() {
        this.symbols = {};
        this.addSymbol("flyer", ParticlesFlyerWorld);
        this.addSymbol("walker", ParticlesWalkerWorld);
        this.addSymbol("tree", ParticlesTreeWorld);
        this.addSymbol("lsystemtree", LSystemTreeWorld);
    }

    addSymbol(name, symbol) {
        this.symbols[name] = symbol;
    }
    getSymbolByName(name) {
        return this.symbols[name];
    }
    launch(canvas) {
        let request = this._getRequest();
        let World = this.getSymbolByName(request["scene"]);
        if (World) {
            return new AnimationBox(canvas, new World(canvas.width, canvas.height));
        } else {
            window.location = "../";
        }
    }

    _getRequest() {
        let result = {};
        let search = location.search;
        if (search.indexOf("?") >= 0) {
            let str = search.substr(1);
            let pairs = str.split("&");
            for (var i = 0; i < pairs.length; i++) {
                result[pairs[i].split("=")[0]] = unescape(pairs[i].split("=")[1]);
            }
        }
        return result;
    }
}
export {
    GameStarter
};