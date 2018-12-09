export class OffscreenCanvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }

    draw(action: (context: CanvasRenderingContext2D) => void) {
        action && action(this.context);
        return this;
    }

    output(context: CanvasRenderingContext2D, ...args: number[]) {
        (context.drawImage as Function)(this.canvas, ...args);
        return this;
    }
}