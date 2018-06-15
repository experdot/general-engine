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
    RuleGrammar
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

        let letters = "F[+F[-F+F[+FF]]]F[-F[+F-F[-FF]]]F";
        this.LSystem.addRule(new RuleGrammar("F", 0, letters));

        this.depth = 5;
        this.LSystem.generate(this.depth);
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
            this.center = new Vector2(this.target.world.width / 2, this.target.world.height * 0.9);
            this.lengthOfLine = -this.target.world.height * (1 / Math.pow(3, this.target.depth + 1));
            this.offset = new Vector2(0, this.lengthOfLine);
            this.lineColor = new Color(255, 255, 255, 1);
        }
        let stepIndex = 0;
        let stepBound = 1000;
        let states = this.target.states;
        for (let i = this.currentIndex; i < states.length - 1; i++) {
            let state = states[i];
            /* eslint-disable */
            switch (state.id) {
                case "F" || "E":
                    this.drawLineBranch(context, this.center, this.offset);
                    this.center = this.center.add(this.offset);
                    break;
                case "+":
                    this.offset = this.offset.rotate(Math.PI / 6 * Math.random());
                    break;
                case "-":
                    this.offset = this.offset.rotate(-Math.PI / 6 * Math.random());
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

        if (Math.random() > 0.5) {
            this.lineColor = ColorHelper.getGradientRandomColor(this.lineColor, 10);
        }

        // let circle = center.add(offset.multiply(0.5));
        // context.beginPath();
        // context.arc(circle.x, circle.y, offset.length() / 2, 0, Math.PI * 2, false);
        // context.closePath();
        // context.fillStyle = this.lineColor.getRGBAValue();
        // context.fill();

        let target = center.add(offset);
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