import {
    GameView
} from "../GameObject/GameView";

class GameWorldView extends GameView {
    draw(source, context) {
        this.target.visuals.forEach(element => {
            element.view && element.view.$render.process(context);
        });
    }
}

export {
    GameWorldView
};