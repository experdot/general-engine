import {
    GameVisual
} from "../../Core/GameObject/GameVisual";
import {
    LSystem
} from "./LSystem";
import {
    State
} from "./State/State";
import {
    RuleTree
} from "./Rule/RuleBase";
import {
    GameView
} from "../../Core/GameObject/GameView";
import {
    Vector2
} from "../../../Fundamental/Vector";
import {
    Color,
    ColorHelper
} from "../../../Fundamental/Color";

class LSystemTree extends GameVisual {
    get states() {
        return this.LSystem.states;
    }
    constructor(view) {
        super(view);
        this.LSystem = new LSystem();
        this.LSystem.initRoot(new State("F", null, 0));
        this.LSystem.addRule(new RuleTree("F", 0));
        this.LSystem.generate(5);
    }

    start() {

    }

    update() {

    }
}

class LSystemTreeView extends GameView {
    constructor(target) {
        super(target);
        this.centerStack = [];
        this.offsetStack = [];
        this.currentIndex = 0;
    }
    draw(context) {
        if (!this.center) {
            this.center = new Vector2(this.target.world.width / 2, this.target.world.height * 0.99);
            this.lengthOfLine = -this.target.world.height * 0.01;
            this.offset = new Vector2(0, this.lengthOfLine);
            this.lineColor = new Color(255, 255, 255);
        }
        let stepIndex = 0;
        let stepBound = 50;
        let states = this.target.states;
        for (let i = this.currentIndex; i < states.length - 1; i++) {
            let state = states[i];
            /* eslint-disable */
            switch (state.id) {
                case "F":
                    this.drawLineBranch(context, this.center, this.offset);
                    this.center = this.center.add(this.offset);
                    break;
                case "+":
                    this.offset = this.offset.rotate(Math.PI / 6);
                    break;
                case "-":
                    this.offset = this.offset.rotate(-Math.PI / 6);
                    break;
                case "[":
                    this.centerStack.push(this.center);
                    this.offsetStack.push(this.offset);
                    break;
                case "]":
                    this.center = this.centerStack.pop();
                    this.offset = this.offsetStack.pop();
                    break;
                default:
                    break;
            }
            /* eslint-enable */

            this.currentIndex = i + 1;
            stepIndex += 1;
            if (stepIndex > stepBound) {
                break;
            }
        }
    }

    drawLineBranch(context, center, offset) {
        let target = center.add(offset);
        if (Math.random() > 0.5) {
            this.lineColor = ColorHelper.getGradientRandomColor(this.lineColor, 20);
        }
        context.strokeStyle = this.lineColor.getRGBAValue();
        context.beginPath();
        context.moveTo(center.x, center.y);
        context.lineTo(target.x, target.y);
        context.closePath();
        context.stroke();
    }
}

export {
    LSystemTree,
    LSystemTreeView
};