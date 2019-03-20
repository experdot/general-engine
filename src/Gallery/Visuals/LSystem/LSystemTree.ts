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
import { InputEvents } from "../../../Engine/Inputs/Inputs";
import { GhostEffect } from "../../../Engine/Game/GameComponents/Effect/Effect";
import { Graphics } from "../../../Engine/Drawing/Graphics";

class LSystemTree extends GameVisual {
    get states() {
        return this.lSystem.states;
    }

    offset: Vector2 = Vector2.Zero;
    lineLengthRatio: number = 3;

    depth: number = 3;
    lSystem: LSystem;

    private letters: string[] = ["F", "[", "]", "+", "-", ".", "*", "(", ")", "R", "G", "B", "r", "g", "b"];

    private letters1: string[] = ["F", "[", "]", "+", "-", ".", "*", "(", ")", "R", "G", "B", "r", "g", "b"];
    private letters2: string[] = ["F", "]", "[", "-", "+", "*", ".", ")", "(", "r", "g", "b", "R", "G", "B"];

    private random: Random = new Random();

    constructor() {
        super();

        this.lSystem = new LSystem();
        this.lSystem.initRoot(new State("F", null, 0));

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

        //let i = Math.floor(Math.random() * rules.length);
        //this.lSystem.addRule(new RuleGrammar("F", rules[i]));

        let maxCount = window.document.body.clientWidth / 50;

        for (let k = 0; k < this.depth; k++) {
            for (let index = 0; index < this.letters.length; index++) {
                this.lSystem.addRule(new RuleGrammar(this.letters[index], this.generate(maxCount)));
            }
        }

        this.lSystem.generate(this.depth);

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

        this.joint(new GhostEffect(new Color(0, 128, 128, 0.006), 40));
    }


    private generate(maxCount = 50) {
        let count = this.random.normal(1, maxCount);

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

    centerStack: Vector2[];
    offsetStack: Vector2[];
    lengthStack: number[];
    lineWidthStack: number[];

    singleNumber: number;
    rotateRatio: number;
    lineWidthRatio: number;
    lineColor: Color;

    constructor() {
        super();
        this.centerStack = [];
        this.offsetStack = [];
        this.lengthStack = [];
        this.lineWidthStack = [];
        this.currentIndex = 0;

        this.lineWidthRatio = 1;
        this.lineColor = new Color(255, 255, 255, 1);

        this.singleNumber = 0;
        this.rotateRatio = 6;
        this.animation = true;
    }

    render(source: LSystemTree, context) {
        if (this.animation) {
            this.singleNumber = (this.singleNumber + 0.01 * Math.random()) % (Math.PI * 2);
            this.rotateRatio = 6.2 + Math.sin(this.singleNumber) * 2.3;
            this.centerStack = [];
            this.offsetStack = [];
            this.lengthStack = [];
            this.currentIndex = 0;
            this.lineColor = new Color(128, 218, 128, 1);
            //context.clearRect(0, 0, source.world.width, source.world.height);
            Graphics.scaleOffset(context, 8, 8 * context.canvas.height / context.canvas.width, 0.99);
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
            this.mapped(states[i].value, context);
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
                //this.drawLineBranch(context, this.center, this.offset, 1 || this.lineWidthRatio, this.lineColor);
                this.drawCircleBranch(context, this.center, this.offset);
                this.center = this.center.add(this.offset);
                break;
            case "+":
                this.offset = this.offset.rotate(Math.PI / this.rotateRatio);
                break;
            case "-":
                this.offset = this.offset.rotate(-Math.PI / this.rotateRatio);
                break;
            case ".":
                this.lengthOfLine += 10;
                this.offset.setLength(this.lengthOfLine);
                break;
            case "*":
                this.lengthOfLine -= 10;
                this.offset.setLength(this.lengthOfLine);
                break;
            case "(":
                this.rotateRatio *= 0.5;
                break;
            case ")":
                this.rotateRatio /= 0.5;
                break;
            case "R":
                this.lineColor.r += 25;
                if (this.lineColor.r > 255) {
                    this.lineColor.r = 255;
                }
                break;
            case "G":
                this.lineColor.g += 25;
                if (this.lineColor.g > 255) {
                    this.lineColor.g = 255;
                }
                break;
            case "B":
                this.lineColor.b += 25;
                if (this.lineColor.b > 255) {
                    this.lineColor.b = 255;
                }
                break;
            case "r":
                this.lineColor.r -= 25;
                if (this.lineColor.r < 0) {
                    this.lineColor.r = 0;
                }
                break;
            case "g":
                this.lineColor.g -= 25;
                if (this.lineColor.g < 0) {
                    this.lineColor.g = 0;
                }
                break;
            case "b":
                this.lineColor.b -= 25;
                if (this.lineColor.b < 0) {
                    this.lineColor.b = 0;
                }
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

export {
    LSystemTree,
    LSystemTreeView
};