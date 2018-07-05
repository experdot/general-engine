class Graphics {
    static clear(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    static offsetScale(context, offsetX = 0, offsetY = 0, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let rw = w + offsetX;
        let rh = h + offsetY;
        context.save();
        context.translate(w / 2, h / 2);
        context.globalAlpha = alpha;
        context.drawImage(context.canvas, -rw / 2, -rh / 2, rw, rh);
        context.restore();
    }

    static rotate(context, rotation, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let x = w / 2;
        let y = h / 2;
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.translate(-x, -y);
        context.globalAlpha = alpha;
        context.drawImage(context.canvas, 0, 0, w, h);
        context.restore();
    }

    static mirror(context, horizontal, vertical, alpha = 1) {
        let w = context.canvas.width;
        let h = context.canvas.height;
        let x = w / 2;
        let y = h / 2;
        context.save();
        context.translate(x, y);
        context.scale(horizontal, vertical);
        context.translate(-x, -y);
        context.globalAlpha = alpha;
        context.drawImage(context.canvas, 0, 0, w, h);
        context.restore();
    }
}

export {
    Graphics
};