import {
    AnimationBox
} from "../Engine/Core/AnimationBox";
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
    launch(canvas) {
        let request = this._getRequest();
        let box = {};
        if (request["scene"] === "flyer") {
            box = new AnimationBox(canvas, new ParticlesFlyerWorld(canvas.width, canvas.height));
        } else if (request["scene"] === "walker") {
            box = new AnimationBox(canvas, new ParticlesWalkerWorld(canvas.width, canvas.height));
        } else if (request["scene"] === "tree") {
            box = new AnimationBox(canvas, new ParticlesTreeWorld(canvas.width, canvas.height));
        } else if (request["scene"] === "lsystemtree") {
            box = new AnimationBox(canvas, new LSystemTreeWorld(canvas.width, canvas.height));
        } else {
            window.location = "../";
        }
        return box;
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