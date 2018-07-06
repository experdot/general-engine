import {
    GameVisual
} from "../../GameObject/GameVisual";
import {
    GameView
} from "../../GameObject/GameView";
import {
    DelayTimer
} from "../../../Common/DelayTimer";
import {
    GhostEffect
} from "../../GameComponents/Effect/Effect";
import {
    Color
} from "../../../UI/Color";
import {
    Graphics
} from "../../../Drawing/Graphics";
import {
    FileIO
} from "../../../IO/FileIO";
import {
    OffscreenCanvas
} from "../../../Drawing/OffscreenCanvas";
import {
    MessageBox
} from "../../../UI/MessageBox";

class AudioVisualizer extends GameVisual {
    get FFTData() {
        this.audioAnalyzer.getByteFrequencyData(this.freqByteData);
        return this.freqByteData;
    }

    constructor() {
        super();
        this.timer = new DelayTimer();

        this.start.next(() => {
            this.initAudio();
            this.on("Drop", event => {
                this.loadFile(event.dataTransfer.files[0]);
            });
            this.on("PointerClicked", () => {
                FileIO.openFileDialog(event => {
                    this.loadFile(event.target.files[0]);
                }, "audio/*");
            });
        });

        this.dispose.next(() => {
            this.audioContext.close();
            if (this.audio) {
                this.audio.remove();
            }
        });

        this.ghost = new GhostEffect(new Color(0, 0, 0, 0.01), 40, false);
        this.proxy(this.ghost);
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

    draw(source, context) {
        if (!this.innerCanvas) {
            this.innerCanvas = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        this.drawDynamic(this.innerCanvas.context);
        this.innerCanvas.output(context, 0, 0);
        this.drawStatic(context);
    }

    drawDynamic(context) {
        let w = this.target.world.width;
        let h = this.target.world.height;
        let cx = w / 2;
        let cy = h / 2;

        this.target.ghost.effect(context);

        if (!this.target.file.playing) {
            this.drawText(context, w, h, cx, cy);
            Graphics.mirror(context, 1, -1, 0.01);
        } else {
            this.rotation += 0.001;
            Graphics.offsetScale(context, 5, 5, 0.99);
            Graphics.rotate(context, this.rotation, 1, () => {
                this.drawFFT(context, w, h, cx, cy);
            });
            Graphics.rotate(context, Math.PI, 1, () => {
                context.drawImage(context.canvas, 0, 0, w, h);
            });
        }
    }

    drawText(context, w, h, cx, cy) {
        let size = Math.max(w / 30, 32);
        context.font = size + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText("Drag an audio file here.", cx, cy - size / 2.5);
        context.fillRect(0, cy - 2, w, 4);
    }

    drawFFT(context, w, h, cx, cy) {
        let data = this.target.FFTData;
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

    drawStatic(context) {
        let w = this.target.world.width;
        let h = this.target.world.height;
        this.drawFileinfo(context, w, h);
    }

    drawFileinfo(context, w, h) {
        let file = this.target.file;
        if (file.playing) {
            let size = Math.max(w / 48, 16);
            let x = w * 0.1;
            let y = h * 0.8;
            context.font = size + "px Arial";
            context.textAlign = "left";
            context.fillStyle = "#FFF";
            context.fillText(file.name, x, y);

            let width = w * 0.8;
            let progress = this.target.audio.currentTime / this.target.audio.duration;
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