import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";
import {
    DelayTimer
} from "../../../Engine/Common/DelayTimer";
import {
    FileIO
} from "../../../Engine/IO/FileIO";
import {
    GhostEffect
} from "../../../Engine/Game/GameComponents/Effect/Effect";
import {
    Color
} from "../../../Engine/UI/Color";
import {
    MessageBox
} from "../../../Engine/Application/MessageBox";
import {
    GameView
} from "../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../Engine/Drawing/Graphics";
import {
    OffscreenCanvas
} from "../../../Engine/Drawing/OffscreenCanvas";

class AudioVisualizer extends GameVisual {
    get FFTData() {
        this.audioAnalyzer.getByteFrequencyData(this.freqByteData);
        return this.freqByteData;
    }

    constructor() {
        super();
        this.timer = new DelayTimer();
        this.effects = {
            ghost: this.joint(new GhostEffect(new Color(0, 0, 0, 0.01), 40, false)),
        };
    }

    start() {
        this.initAudio();
        this.on("Drop", event => {
            this.loadFile(event.dataTransfer.files[0]);
        });
        this.on("PointerClicked", () => {
            FileIO.openFileDialog(event => {
                this.loadFile(event.target.files[0]);
            }, "audio/*");
        });
    }

    dispose() {
        super.dispose();
        this.audioContext.close();
        if (this.audio) {
            this.audio.remove();
        }
    }

    initAudio() {
        this.audioContext = new AudioContext();

        this.audio = document.createElement("audio");
        this.audio.loop = true;
        document.body.appendChild(this.audio);

        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        this.audioAnalyzer = this.audioContext.createAnalyser();

        this.fftSize = this.world.width > 1200 ? 2048 : 1024;
        this.audioAnalyzer.fftSize = this.fftSize;
        this.freqByteData = new Uint8Array(this.audioAnalyzer.frequencyBinCount);

        this.audioSource.connect(this.audioAnalyzer);
        this.audioAnalyzer.connect(this.audioContext.destination);

        this.file = {
            name: "",
            playing: false
        };
    }

    loadFile(file) {
        if (file && file.type.indexOf("audio") === 0) {
            this.audio.src = URL.createObjectURL(file);
            this.audio.autoplay = true;
            this.audio.play();
            this.file.playing = true;
            this.file.name = file.name.split(".").shift();
        } else {
            MessageBox.show("Please select a valid audio file.");
        }
    }
}

class AudioVisualizerView extends GameView {
    constructor() {
        super();
        this.rotation = 0;
        this.rotation2 = 0;
    }

    render(source, context) {
        if (!this.innerCanvas) {
            this.innerCanvas = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        this.innerCanvas.draw(innerContext => {
            this.drawDynamic(source, innerContext);
        }).output(context, 0, 0);

        this.drawStatic(source, context);
    }

    drawDynamic(source, context) {
        let w = source.world.width;
        let h = source.world.height;
        let cx = w / 2;
        let cy = h / 2;

        source.effects.ghost.effect(context);

        if (!source.file.playing) {
            this.drawText(source, context, w, h, cx, cy);
            Graphics.mirror(context, 1, -1, 0.01, () => {
                context.drawImage(context.canvas, 0, 0);
            });
        } else {
            this.rotation += 0.001;
            Graphics.scaleOffset(context, 5, 5, 0.99);
            Graphics.rotate(context, this.rotation, 1, () => {
                this.drawFFT(source, context, w, h, cx, cy);
            });
            Graphics.rotate(context, Math.PI, 1, () => {
                context.drawImage(context.canvas, 0, 0, w, h);
            });
        }
    }

    drawText(source, context, w, h, cx, cy) {
        let size = Math.max(w / 30, 32);
        context.font = size + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText("Drag an audio file here.", cx, cy - size / 2.5);
        context.fillRect(0, cy - 2, w, 4);
    }

    drawFFT(source, context, w, h, cx, cy) {
        let data = source.FFTData;
        context.beginPath();
        this.rotation2 += 0.002;
        for (let index = 0; index < data.length; index++) {
            let value = data[index];
            let x = index / data.length * w;
            let y = cy + value + Math.sin(x / (100 + Math.sin(this.rotation2) * 50)) * 100;
            context.lineTo(x, y);
        }
        context.lineWidth = w / data.length;
        context.strokeStyle = "#FFF";
        context.stroke();
    }

    drawStatic(source, context) {
        let w = source.world.width;
        let h = source.world.height;
        this.drawFileinfo(source, context, w, h);
    }

    drawFileinfo(source, context, w, h) {
        let file = source.file;
        if (file.playing) {
            let size = Math.max(w / 48, 16);
            let x = w * 0.1;
            let y = h * 0.8;
            context.font = size + "px Arial";
            context.textAlign = "left";
            context.fillStyle = "#FFF";
            context.fillText(file.name, x, y);

            let width = w * 0.8;
            let progress = source.audio.currentTime / source.audio.duration;
            context.strokeStyle = "#FFF";
            context.strokeRect(x, y + size, width, size / 3);
            context.fillRect(x, y + size, width * progress, size / 3);
        }
    }
}

export {
    AudioVisualizer,
    AudioVisualizerView
};