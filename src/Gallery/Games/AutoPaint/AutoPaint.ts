import { GameVisual } from "../../../Engine/Game/GameObject/GameVisual";
import { TypedGameView } from "../../../Engine/Game/GameObject/GameView";
import { Drawing } from "./Model/Drawing";
import { Line } from "./Model/Line";
import { Vector2 } from "../../../Engine/Numerics/Vector2";
import { Vertex } from "./Model/Vertex";
import { Colors, ColorHelper, Color } from "../../../Engine/UI/Color";
import { ImageDataHelper } from "./AI/SimpleAutoPaintAI";
import { GalleryImages } from "../../Resources/GalleryImages";

export class AutoPaint extends GameVisual {
    drawing: Drawing;

    imageData: ImageData;
    rawImageData: ImageData;
    single: number = 0;

    changed: boolean = false;


    start() {
        this.drawing = new Drawing();
        const image = new Image();
        image.src = "../static/girl.png";
        image.onload = () => {
            this.rawImageData = ImageDataHelper.getImageData(image);
            this.imageData = ImageDataHelper.getThresholdImageData(this.rawImageData);
            this.changed = true;
        }
    }

    update() {
        if (this.imageData) {
            this.single += 0.01;
            const thresholding = Math.sin(this.single) * 64 + 128;
            this.imageData = ImageDataHelper.getThresholdImageData(this.rawImageData, thresholding);
            this.changed = true;
        }
    }
}

export class AutoPaintView extends TypedGameView<AutoPaint>{
    render(source: AutoPaint, context: CanvasRenderingContext2D) {
        if (source.changed) {
            const center = source.world.size.center;
            const x = center.x - source.imageData.width / 2;
            const y = center.y - source.imageData.height / 2;
            source.imageData && context.putImageData(source.imageData, x, y);
            source.changed = false;
        }
        // context.fillStyle = "#FFF";
        // source.drawing.lines.forEach(line => {
        //     line.verties.forEach(vertex => {
        //         const location = vertex.location;
        //         context.fillStyle = vertex.color.rgba;
        //         context.fillRect(location.x, location.y, 1, 1);
        //     });
        // });
    }
}