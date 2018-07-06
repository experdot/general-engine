class Graphics {
    static clear(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    static offsetScale(context, offsetX = 0, offsetY = 0, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let rw = w + offsetX;
        let rh = h + offsetY;
        Graphics.hold(context, () => {
            context.globalAlpha = alpha;
            context.drawImage(context.canvas, -offsetX, -offsetY, rw, rh);
        });
    }

    static rotate(context, rotation, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let x = w / 2;
        let y = h / 2;
        Graphics.hold(context, () => {
            context.translate(x, y);
            context.rotate(rotation);
            context.translate(-x, -y);
            context.globalAlpha = alpha;
            context.drawImage(context.canvas, 0, 0, w, h);
        });
    }

    static mirror(context, horizontal, vertical, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let x = w / 2;
        let y = h / 2;
        Graphics.hold(context, () => {
            context.translate(x, y);
            context.scale(horizontal, vertical);
            context.translate(-x, -y);
            context.globalAlpha = alpha;
            context.drawImage(context.canvas, 0, 0, w, h);
        });
    }

    static transform(context, matrix, action) {
        Graphics.hold(context, () => {
            context.setTransform(...matrix.toArray());
            action && action(context);
        });
    }

    static hold(context, action) {
        context.save();
        action && action(context);
        context.restore();
    }
}

export {
    Graphics
};