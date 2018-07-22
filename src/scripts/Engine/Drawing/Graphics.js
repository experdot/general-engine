class Graphics {
    static clear(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        return this;
    }

    static scaleOffset(context, offsetX = 0, offsetY = 0, alpha = 1) {
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

    static rotate(context, rotation, alpha = 1, action) {
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

    static mirror(context, horizontal, vertical, alpha = 1, action) {
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

    static transform(context, matrix, action) {
        Graphics.hold(context, () => {
            context.setTransform(...matrix.toArray());
            action && action(context);
        });
        return this;
    }

    static transparent(context, alpha = 1, action) {
        Graphics.hold(context, () => {
            context.globalAlpha = alpha;
            action && action(context);
        });
        return this;
    }

    static hold(context, action) {
        context.save();
        action && action(context);
        context.restore();
        return this;
    }
}

export {
    Graphics
};