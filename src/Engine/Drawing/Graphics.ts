import { Array2 } from "../Collections/Array2";
import { Matrix3x2 } from "../Numerics/Matrix3x2";
import { Vector2 } from "../Numerics/Vector2";
import { Color } from "../UI/Color";

export class Graphics {
    static clear(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        return this;
    }

    static shadow(context: CanvasRenderingContext2D, blur: number, color: string, offsetX: number, offsetY: number, action: (context: CanvasRenderingContext2D) => void) {
        Graphics.hold(context, () => {
            context.shadowBlur = blur;
            context.shadowColor = color;
            context.shadowOffsetX = offsetX;
            context.shadowOffsetY = offsetY;
            action && action(context);
        });
        return this;
    }

    static scaleOffset(context: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, alpha = 1) {
        const w = context.canvas.width;
        const h = context.canvas.height;
        const rw = w + offsetX;
        const rh = h + offsetY;
        Graphics.hold(context, () => {
            context.globalAlpha = alpha;
            context.translate(w / 2, h / 2);
            context.drawImage(context.canvas, -rw / 2, -rh / 2, rw, rh);
        });
        return this;
    }

    static offset(context: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, alpha = 1) {
        const w = context.canvas.width;
        const h = context.canvas.height;
        Graphics.hold(context, () => {
            context.globalAlpha = alpha;
            context.drawImage(context.canvas, offsetX, offsetY, w, h);
        });
        return this;
    }

    static rotate(context: CanvasRenderingContext2D, rotation: number, alpha = 1, action: (context: CanvasRenderingContext2D) => void) {
        const w = context.canvas.width;
        const h = context.canvas.height;
        const x = w / 2;
        const y = h / 2;
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
        const w = context.canvas.width;
        const h = context.canvas.height;
        const x = w / 2;
        const y = h / 2;
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

    static drawPoints(ctx: CanvasRenderingContext2D, points: Vector2[]) {
        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const x_mid = (points[i].x + points[i + 1].x) / 2;
                const y_mid = (points[i].y + points[i + 1].y) / 2;
                const cp_x1 = (x_mid + points[i].x) / 2;
                const cp_x2 = (x_mid + points[i + 1].x) / 2;
                ctx.quadraticCurveTo(cp_x1, points[i].y, x_mid, y_mid);
                ctx.quadraticCurveTo(cp_x2, points[i + 1].y, points[i + 1].x, points[i + 1].y);
            }
        }
        ctx.closePath();
    }

    static getImageData(img: HTMLImageElement) {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const context = canvas.getContext('2d')
        context.drawImage(img, 0, 0)

        const pixels = context.getImageData(0, 0, img.width, img.height);

        const colors = new Array2<Color>(canvas.width, canvas.height);
        colors.forEach((v, x, y) => {
            var p = y * colors.width + x;
            var r = pixels.data[4 * p + 0];
            var g = pixels.data[4 * p + 1];
            var b = pixels.data[4 * p + 2];
            colors.set(x, y, new Color(r, g, b, 1));
        });

        return colors;
    }
}
