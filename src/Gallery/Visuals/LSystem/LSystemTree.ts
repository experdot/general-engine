import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";
import {
    State, TwoDementionState, IState
} from "./State/State";
import {
    LSystem
} from "./LSystem";
import {
    GrammarRule, TwoDementionRule
} from "./Rule/Rule";
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
import { InputEvents } from "../../../Engine/Inputs/Inputs";
import { GhostEffect } from "../../../Engine/Game/GameComponents/Effect/Effect";
import { Graphics } from "../../../Engine/Drawing/Graphics";

export class LSystemTree extends GameVisual {

    static get defaultView() {
        return new LSystemTreeView();
    }

    get states() {
        return this.lSystem.states;
    }

    offset: Vector2 = Vector2.Zero;
    lineLengthRatio: number = 1;

    depth: number = 4;
    lSystem: LSystem;

    changed: boolean = false;

    // private letters: string[] = ["F", "[", "]", ".", "*", "+", "-", "(", ")"];
    // private letters1: string[] = ["F", "[", "]", ".", "*", "+", "-", "(", ")"];
    // private letters2: string[] = ["F", "]", "[", "*", ".", "-", "+", ")", "("];

    private letters: string[] = ["F", "U", "D", "L", "R", "[", "]", ".", "*", "+", "-", "(", ")"];
    private letters1: string[] = ["F", "U", "D", "L", "R", "[", "]", ".", "*", "+", "-", "(", ")"];
    private letters2: string[] = ["F", "D", "U", "R", "L", "]", "[", "*", ".", "-", "+", ")", "("];

    private random: Random = new Random();

    constructor() {
        super();

        this.lSystem = new LSystem();
        this.lSystem.initRoot(new State("F", null, 0));

        // const letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
        // const count = 9;
        // for (let index = 0; index < count; index++) {
        //     const element = letters[index];
        //     this.lSystem.states.push(new TwoDementionState(element, null, 1, new Vector2(index % 3, Math.floor(index / 3))));
        // }

        // for (let index = 0; index < letters.length; index++) {
        //     const element = letters[index];
        //     this.lSystem.addRule(new TwoDementionRule(element, this.generateABCD(letters, count)));
        // }

        // const rules = [
        //     "FF+[+F-F-F]-[-F+F+F]",
        //     "F[+F-F+F+FF]F[-F+F-F-FF]F",
        //     "FF[-F-FF--F][+F+FF-F]FF",
        //     "F[.--F++F-.F][.++F--F+.F][.-F++F][.+F--F].F",
        //     "F-F-F+F++F+F-F-F",
        //     "F--F+F+F+F+F--F",
        //     "F[-F-FF--F][+F+FF-F]F",
        //     "F[-FF--F][+FF-F]FF",
        //     "F[-F-FF][+F+FF]F",
        //     "F-F[-FFF-F][+FFF-F]F+F",
        //     "F+[-FF-F][+FF-F]F-F",
        //     "F-[-FF-F][+FF-F]+F",
        // ];
        // const i = Math.floor(Math.random() * rules.length);
        // this.lSystem.addRule(new GrammarRule("F", rules[i]));

        // this.lSystem.addRule(new GrammarRule("U", "URRRUUDL"));
        // this.lSystem.addRule(new GrammarRule("R", "RDDDRRLU"));
        // this.lSystem.addRule(new GrammarRule("D", "DLLLDDUR"));
        // this.lSystem.addRule(new GrammarRule("L", "LUUULLRD"));

        const maxCount = 10;
        for (let index = 0; index < this.letters.length; index++) {
            const rule = this.generate(maxCount, index);
            console.log(rule);
            this.lSystem.addRule(new GrammarRule(this.letters[index], rule));
        }

        this.depth = 4;
        this.lSystem.generate(this.depth);
        console.log(this.states);

        //this.joint(new GhostEffect(new Color(0, 128, 128, 0.5), 20));
        this.bindMouseEvents();
    }

    private bindMouseEvents() {
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
                const curPos: Vector2 = this.world.inputs.pointer.position;
                this.offset = startOffset.add(curPos.subtract(startPos));
                this.changed = true;
            }
        });

        this.on(InputEvents.PointerReleased, () => {
            isMouseDown = false;
        });

        this.on(InputEvents.MouseWheel, (e: MouseWheelEvent) => {
            const ratio = Math.pow(1.2, Math.sign(e.deltaY))
            this.lineLengthRatio *= ratio;
            this.offset = this.offset.multiply(ratio);
            this.changed = true;
        });
    }

    private generate(maxCount = 50, v: number = 0) {
        let count = this.random.normal(1, maxCount);

        let result1: string = "";
        let result2: string = "";
        for (let index = 0; index < count; index++) {
            let i = Math.floor(Math.random() * this.letters.length)
            result1 = result1 + this.letters1[i];
            result2 = result2 + this.letters2[i];
        }

        return result1 + this.letters[v] + result2;
    }

    private generateABCD(letters: string, count: number) {
        let result = "";
        const last = Math.floor(Math.random() * letters.length);
        for (let index = 0; index < count; index++) {
            result = result + letters[(last + index) % letters.length];
        }
        console.log(result);
        return result;
    }
}

export class LSystemTreeView extends GameView {

    centerStack: Vector2[];
    offsetStack: Vector2[];
    lengthStack: number[];
    rotateStack: number[];

    singleNumber: number;
    rotateRatio: number;
    lineColor: Color;

    constructor() {
        super();
        this.centerStack = [];
        this.offsetStack = [];
        this.lengthStack = [];
        this.rotateStack = [];

        this.currentIndex = 0;

        this.lineColor = new Color(255, 255, 255, 1);

        this.singleNumber = 0;
        this.rotateRatio = 6;
        this.animation = true;
    }

    render(source: LSystemTree, context) {
        if (this.animation || source.changed) {
            this.singleNumber = (this.singleNumber + 0.01 * Math.random()) % (Math.PI * 2);
            this.rotateRatio = 6.2 + Math.sin(this.singleNumber) * 2.4;
            this.centerStack = [];
            this.offsetStack = [];
            this.lengthStack = [];
            this.rotateStack = [];
            this.currentIndex = 0;

            context.clearRect(0, 0, source.world.width, source.world.height);
            //this.animation = false;
        }

        this.lineWidthRatio = Math.max(1, source.lineLengthRatio / 10);

        //Graphics.scaleOffset(context, 8, 8 * context.canvas.height / context.canvas.width, 0.99);

        if (this.animation || !this.center || source.changed) {
            this.center = new Vector2(source.world.width / 2, source.world.height * 0.7).add(source.offset);
            this.lengthOfLine = source.world.height * (1 / Math.pow(3, source.depth + 1)) * source.lineLengthRatio;
            //this.lengthOfLine = source.lineLengthRatio;
            this.offset = new Vector2(0, -this.lengthOfLine);
            source.changed = false;
        }

        let stepIndex = 0;
        let stepBound = this.animation ? 10000 : 1000;
        let states = source.states;
        for (let i = this.currentIndex; i < states.length; i++) {
            this.mapped(context, states[i]);
            this.currentIndex = i + 1;
            stepIndex += 1;
            if (stepIndex > stepBound) {
                break;
            }
        }
    }

    mapped(context: CanvasRenderingContext2D, state: IState<string>) {
        /* eslint-disable */
        switch (state.value) {
            case "F":
                this.drawLineBranch(context, this.center, this.offset, this.lineWidthRatio, this.lineColor);
                this.center = this.center.add(this.offset);
                break;
            case "U":
                this.offset = new Vector2(0, -this.lengthOfLine).rotate(2.4 / this.rotateRatio);;
                this.drawLineBranch(context, this.center, this.offset, this.lineWidthRatio, this.lineColor);
                this.center = this.center.add(this.offset);
                break;
            case "D":
                this.offset = new Vector2(0, this.lengthOfLine).rotate(2.4 / this.rotateRatio);;
                this.drawLineBranch(context, this.center, this.offset, this.lineWidthRatio, this.lineColor);
                this.center = this.center.add(this.offset);
                break;
            case "L":
                this.offset = new Vector2(-this.lengthOfLine, 0).rotate(2.4 / this.rotateRatio);;
                this.drawLineBranch(context, this.center, this.offset, this.lineWidthRatio, this.lineColor);
                this.center = this.center.add(this.offset);
                break;
            case "R":
                this.offset = new Vector2(this.lengthOfLine, 0).rotate(2.4 / this.rotateRatio);;
                this.drawLineBranch(context, this.center, this.offset, this.lineWidthRatio, this.lineColor);
                this.center = this.center.add(this.offset);
                break;
            case "+":
                this.offset = this.offset.rotate(2.4 / this.rotateRatio);
                break;
            case "-":
                this.offset = this.offset.rotate(-2.4 / this.rotateRatio);
                break;
            case ".":
                this.lengthOfLine *= 0.9;
                this.offset.setLength(this.lengthOfLine);
                break;
            case "*":
                this.lengthOfLine /= 0.9;
                this.offset.setLength(this.lengthOfLine);
                break;
            case "(":
                this.rotateRatio *= 0.9;
                break;
            case ")":
                this.rotateRatio /= 0.9;
                break;
            case "[":
                this.centerStack.push(this.center.clone());
                this.offsetStack.push(this.offset.clone());
                this.lengthStack.push(this.lengthOfLine);
                this.rotateStack.push(this.rotateRatio);
                break;
            case "]":
                this.center = this.centerStack.pop() || this.center;
                this.offset = this.offsetStack.pop() || this.offset;
                this.lengthOfLine = this.lengthStack.pop() || this.lengthOfLine;
                this.rotateRatio = this.rotateStack.pop() || this.rotateRatio;
                break;
            default:
                break;
        }
        /* eslint-enable */
    }

    drawLineBranch(context: CanvasRenderingContext2D, center, offset, lineWidth = 1, color: Color) {
        let target = center.add(offset);
        context.strokeStyle = color.rgb;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(center.x, center.y);
        context.lineTo(target.x, target.y);
        context.closePath();
        context.stroke();
    }

    drawCircleBranch(context: CanvasRenderingContext2D, center, offset) {
        let circle = center.add(offset.multiply(0.5));
        context.beginPath();
        context.arc(circle.x, circle.y, offset.length / 2, 0, Math.PI * 2, false);
        context.closePath();
        //context.strokeStyle = this.lineColor.rgba;
        //context.stroke();
        context.fillStyle = this.lineColor.rgba;
        context.fill()
    }
}


export class TwoDementionView extends LSystemTreeView {
    static letters = "ABCDEFGHJKLMNOPQRSTUVWXYZ";

    mapped(context: CanvasRenderingContext2D, state: TwoDementionState<string>) {
        const index = TwoDementionView.letters.indexOf(state.value) + 1;
        const value = (index + 10) * 2;
        this.drawRect(context, state, `#${value}${value}${value}`);
    }

    drawRect(context: CanvasRenderingContext2D, state: TwoDementionState<string>, color: string) {
        const location = state.location;
        const size = this.lengthOfLine;
        const actualLocation = location.multiply(size).add(this.center);
        context.fillStyle = color;
        context.fillRect(actualLocation.x, actualLocation.y, size, size);
    }
}