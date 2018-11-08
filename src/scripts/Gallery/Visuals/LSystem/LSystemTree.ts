import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";
import {
    State
} from "./State/State";
import {
    LSystem
} from "./LSystem";
import {
    RuleGrammar
} from "./Rule/RuleBase";
import {
    GameView
} from "../../../Engine/Game/GameObject/GameView";
import {
    Color
} from "../../../Engine/UI/Color";
import {
    Vector2
} from "../../../Engine/Numerics/Vector2";
import { Random } from "../../../Engine/Numerics/Random";
import { InputEvents } from "../../../Engine/Common/Inputs";

class LSystemTree extends GameVisual {
    get states() {
        return this.LSystem.states;
    }

    offset: Vector2 = Vector2.Zero;
    lineLengthRatio: number = 1;

    private letters: string[] = ["F", "[", "]", "+", "-", ".", "*", "(", ")"];

    private letters1: string[] = ["F", "[", "]", "+", "-", ".", "*", "(", ")"];
    private letters2: string[] = ["F", "]", "[", "-", "+", "*", ".", ")", "("];

    private random: Random = new Random();

    constructor() {
        super();

        this.LSystem = new LSystem();
        this.LSystem.initRoot(new State("F", null, 0));

        let rules = [
            "FF+[+F-F-F]-[-F+F+F]",
            "F[+F-F+F+FF]F[-F+F-F-FF]F",
            "FF[-F-FF--F][+F+FF-F]FF",
            "F[.--F++F-.F][.++F--F+.F][.-F++F][.+F--F].F",
            "F-F-F+F++F+F-F-F",
            "F--F+F+F+F+F--F",
            "F[-F-FF--F][+F+FF-F]F",
            "F[-FF--F][+FF-F]FF",
            "F[-F-FF][+F+FF]F",
            "F-F[-FFF-F][+FFF-F]F+F",
            "F+[-FF-F][+FF-F]F-F",
            "F-[-FF-F][+FF-F]+F",
        ];
        
        let i = Math.floor(Math.random() * rules.length);
        this.LSystem.addRule(new RuleGrammar("F", 0, rules[i]));

        for (let index = 1; index < this.letters.length; index++) {
            this.LSystem.addRule(new RuleGrammar(this.letters[index], 0, this.generate()));
        }

        this.depth = 3;
        this.LSystem.generate(this.depth);

        let isMouseDown: boolean = false;
        let startPos: Vector2;
        let startOffset: Vector2;
        this.on(InputEvents.PointerPressed, () => {
            isMouseDown = true;
            startPos = this.world.inputs.pointer.position;
            startOffset = this.offset.clone();
        });

        this.on(InputEvents.PointerMoved, () => {
            if (isMouseDown) {
                let curPos: Vector2 = this.world.inputs.pointer.position;
                this.offset = startOffset.add(curPos.subtract(startPos));
            }
        });

        this.on(InputEvents.PointerReleased, () => {
            isMouseDown = false;
        });

        this.on(InputEvents.MouseWheel, (e: MouseWheelEvent) => {
            this.lineLengthRatio *= Math.pow(1.2, Math.sign(e.deltaY));
        });
    }


    private generate() {
        let count = this.random.range(1, 12);

        let result1: string = "";
        let result2: string = "";
        for (let index = 0; index < count; index++) {
            const i = Math.floor(Math.random() * this.letters.length)
            result1 = result1 + this.letters1[i];
            if (Math.random() > 0.5) {
                result2 = result2 + this.letters2[i];
            }
            else {
                result2 = this.letters2[i] + result2;
            }
        }

        return result1 + "F" + result2;
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

    render(source: LSystemTree, context) {
        if (this.animation) {
            this.singleNumber = (this.singleNumber + 0.1 * Math.random()) % (Math.PI * 2);
            this.rotateRatio = 6.2 + Math.sin(this.singleNumber) * 0.3;
            this.centerStack = [];
            this.offsetStack = [];
            this.lengthStack = [];
            this.currentIndex = 0;
            this.lineColor = new Color(255, 255, 255, 1);
            context.clearRect(0, 0, source.world.width, source.world.height);
        }

        if (this.animation || !this.center) {
            this.center = new Vector2(source.world.width / 2, source.world.height * 0.7).add(source.offset);
            this.lengthOfLine = source.world.height * (1 / Math.pow(3, source.depth + 1)) * source.lineLengthRatio;
            this.offset = new Vector2(0, -this.lengthOfLine);
        }

        let stepIndex = 0;
        let stepBound = this.animation ? 10000 : 1000;
        let states = source.states;
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
            case "(":
                this.rotateRatio *= 0.618;
                break;
            case ")":
                this.rotateRatio /= 0.618;
                break;
            case "[":
                this.centerStack.push(this.center.clone());
                this.offsetStack.push(this.offset.clone());
                this.lengthStack.push(this.lengthOfLine);
                break;
            case "]":
                this.center = this.centerStack.pop() || this.center;
                this.offset = this.offsetStack.pop() || this.offset;
                this.lengthOfLine = this.lengthStack.pop() || this.lengthOfLine;
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
        context.arc(circle.x, circle.y, offset.length / 2, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = this.lineColor.rgba;
        context.fill();
    }
}

export {
    LSystemTree,
    LSystemTreeView
};