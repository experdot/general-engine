import { Matrix3x2 } from "../Numerics/Matrix3x2";

export class Graphics {
    static clear(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        return this;
    }

    static scaleOffset(context: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let rw = w + offsetX;
        let rh = h + offsetY;
        Graphics.hold(context, () => {
            context.globalAlpha = alpha;
            context.translate(w / 2, h / 2);
            context.drawImage(context.canvas, -rw / 2, -rh / 2, rw, rh);
        });
        return this;
    }

    static rotate(context: CanvasRenderingContext2D, rotation: number, alpha = 1, action: (context: CanvasRenderingContext2D) => void) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let x = w / 2;
        let y = h / 2;
        Graphics.hold(context, () => {
            context.translate(x, y);
            context.rotate(rotation);
            context.translate(-x, -y);
            context.globalAlpha = alpha;
            action && action(context);
        });
        return this;
    }

    static mirror(context: CanvasRenderingContext2D, horizontal: number, vertical: number, alpha = 1, action: (context: CanvasRenderingContext2D) => void) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let x = w / 2;
        let y = h / 2;
        Graphics.hold(context, () => {
            context.translate(x, y);
            context.scale(horizontal, vertical);
            context.translate(-x, -y);
            context.globalAlpha = alpha;
            action && action(context);
        });
        return this;
    }

    static transform(context: CanvasRenderingContext2D, matrix: Matrix3x2, action: (context: CanvasRenderingContext2D) => void) {
        Graphics.hold(context, () => {
            (context.setTransform as Function)(...matrix.toArray());
            action && action(context);
        });
        return this;
    }

    static transparent(context: CanvasRenderingContext2D, alpha = 1, action: (context: CanvasRenderingContext2D) => void) {
        Graphics.hold(context, () => {
            context.globalAlpha = alpha;
            action && action(context);
        });
        return this;
    }

    static hold(context: CanvasRenderingContext2D, action: (context: CanvasRenderingContext2D) => void) {
        context.save();
        action && action(context);
        context.restore();
        return this;
    }
}
