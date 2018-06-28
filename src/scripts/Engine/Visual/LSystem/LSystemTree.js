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
} from "../../../Engine/Fundamental/Vector";
import {
    Color,
    ColorHelper
} from "../../../Engine/Fundamental/Color";

class LSystemTree extends GameVisual {
    get states() {
        return this.LSystem.states;
    }
    constructor(view) {
        super(view);

        this.LSystem = new LSystem();
        this.LSystem.initRoot(new State("F", null, 0));

        let letters = "F[+F-F+F+FF]F[-F+F-F-FF]F";
        //let letters = "FF[-F-FF--F][+F+FF-F]FF";
        //let letters = "F[.--F++F-.F][.++F--F+.F][.-F++F][.+F--F].F";
        //let letters = "F-F-F+F++F+F-F-F";
        //let letters = "F--F+F+F+F+F--F";
        this.LSystem.addRule(new RuleGrammar("F", 0, letters));

        this.depth = 3;
        this.LSystem.generate(this.depth);

        this.start.next(this._start);
        this.update.next(this._update);
    }

    _start() {
        let w = this.world.width;
        let h = this.world.height;

        this.fillColor = new Color(0, 128, 128, 0.4);
        this.view.render.next(context => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, w, h);
        }, 0);
    }

    _update() {
        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 10);
        }
    }
}

class LSystemTreeView extends GameView {
    constructor(target) {
        super(target);
        this.centerStack = [];
        this.offsetStack = [];
        this.lengthStack = [];
        this.currentIndex = 0;

        this.rotateRatio = 3;
        this.singleNumber = 0;
    }
    draw(context) {

        //context.clearRect(0, 0, this.target.world.width, this.target.world.height);

        this.centerStack = [];
        this.offsetStack = [];
        this.lengthStack = [];
        this.currentIndex = 0;
        this.singleNumber = (this.singleNumber + 0.05) % (Math.PI * 2);

        this.rotateRatio = 6.2 + Math.sin(this.singleNumber) * 0.3;

        //if (!this.center) {
        this.center = new Vector2(this.target.world.width / 2, this.target.world.height * 0.9);
        this.lengthOfLine = this.target.world.height * (1 / Math.pow(3, this.target.depth + 1)) * 1;
        this.offset = new Vector2(0, -this.lengthOfLine);
        this.lineColor = new Color(255, 255, 255, 1);
        //}

        let stepIndex = 0;
        let stepBound = 10000;
        let states = this.target.states;
        for (let i = this.currentIndex; i < states.length; i++) {
            let state = states[i];
            /* eslint-disable */
            switch (state.id) {
                case "F":
                    this.drawLineBranch(context, this.center, this.offset);
                    this.center = this.center.add(this.offset);
                    break;
                case "M":
                    this.center = this.center.add(this.offset);
                    break;
                case "+":
                    this.offset = this.offset.rotate(Math.PI / this.rotateRatio);
                    break;
                case "-":
                    this.offset = this.offset.rotate(-Math.PI / this.rotateRatio);
                    break;
                case ".":
                    this.lengthOfLine *= 0.618;
                    this.offset.setLength(this.lengthOfLine);
                    break;
                case "*":
                    this.lengthOfLine /= 0.618;
                    this.offset.setLength(this.lengthOfLine);
                    break;
                case "[":
                    this.centerStack.push(this.center.clone());
                    this.offsetStack.push(this.offset.clone());
                    this.lengthStack.push(this.lengthOfLine);
                    break;
                case "]":
                    this.center = this.centerStack.pop();
                    this.offset = this.offsetStack.pop();
                    this.lengthOfLine = this.lengthStack.pop();
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

        // if (Math.random() > 0.5) {
        //     this.lineColor = ColorHelper.getGradientRandomColor(this.lineColor, 10);
        // }
        //this.lineColor = ColorHelper.getGradientColor(this.lineColor, 0.001);

        // let circle = center.add(offset.multiply(0.5));
        // context.beginPath();
        // context.arc(circle.x, circle.y, offset.length() / 2, 0, Math.PI * 2, false);
        // context.closePath();
        // context.fillStyle = this.lineColor.getRGBAValue();
        // context.fill();

        let target = center.add(offset);
        context.strokeStyle = this.lineColor.getRGBAValue();
        //context.lineWidth = offset.length() / 10;
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