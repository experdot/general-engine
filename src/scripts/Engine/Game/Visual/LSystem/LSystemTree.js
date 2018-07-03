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
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Color
} from "../../../../Engine/UI/Color";
import {
    GameVisual
} from "../../GameObject/GameVisual";
import {
    GameView
} from "../../GameObject/GameView";

class LSystemTree extends GameVisual {
    get states() {
        return this.LSystem.states;
    }
    constructor(view) {
        super(view);

        this.LSystem = new LSystem();
        this.LSystem.initRoot(new State("F", null, 0));

        let letters = [
            "F[+F-F+F+FF]F[-F+F-F-FF]F",
            "FF[-F-FF--F][+F+FF-F]FF",
            "F[.--F++F-.F][.++F--F+.F][.-F++F][.+F--F].F",
            "F-F-F+F++F+F-F-F",
            "F--F+F+F+F+F--F"
        ];
        let index = 0; //Math.floor(Math.random() * letters.length);
        this.LSystem.addRule(new RuleGrammar("F", 0, letters[index]));

        this.depth = 3;
        this.LSystem.generate(this.depth);
    }
}

class LSystemTreeView extends GameView {
    constructor() {
        super();
        this.centerStack = [];
        this.offsetStack = [];
        this.lengthStack = [];
        this.currentIndex = 0;

        this.singleNumber = 0;
        this.rotateRatio = 6;

        this.lineColor = new Color(255, 255, 255, 1);
        this.animation = true;
    }
    draw(source, context) {
        if (this.animation) {
            this.singleNumber = (this.singleNumber + 0.1 * Math.random()) % (Math.PI * 2);
            this.rotateRatio = 6.2 + Math.sin(this.singleNumber) * 0.3;
            this.centerStack = [];
            this.offsetStack = [];
            this.lengthStack = [];
            this.currentIndex = 0;
            this.lineColor = new Color(255, 255, 255, 1);
            context.clearRect(0, 0, this.target.world.width, this.target.world.height);
        }

        if (this.animation || !this.center) {
            this.center = new Vector2(this.target.world.width / 2, this.target.world.height * 0.9);
            this.lengthOfLine = this.target.world.height * (1 / Math.pow(3, this.target.depth + 1)) * 1;
            this.offset = new Vector2(0, -this.lengthOfLine);
        }

        let stepIndex = 0;
        let stepBound = this.animation ? 10000 : 1000;
        let states = this.target.states;
        for (let i = this.currentIndex; i < states.length; i++) {
            this.mapped(states[i].id, context);
            this.currentIndex = i + 1;
            stepIndex += 1;
            if (stepIndex > stepBound) {
                break;
            }
        }
    }

    mapped(id, context) {
        /* eslint-disable */
        switch (id) {
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
    }

    drawLineBranch(context, center, offset) {
        let target = center.add(offset);
        context.strokeStyle = this.lineColor.rgba;
        context.beginPath();
        context.moveTo(center.x, center.y);
        context.lineTo(target.x, target.y);
        context.closePath();
        context.stroke();
    }

    drawCircleBranch(context, center, offset) {
        let circle = center.add(offset.multiply(0.5));
        context.beginPath();
        context.arc(circle.x, circle.y, offset.length() / 2, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = this.lineColor.rgba;
        context.fill();
    }
}

export {
    LSystemTree,
    LSystemTreeView
};