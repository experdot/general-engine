export class OffscreenCanvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }

    draw(action) {
        action && action(this.context);
        return this;
    }

    output(context, ...args) {
        context.drawImage(this.canvas, ...args);
        return this;
    }
}