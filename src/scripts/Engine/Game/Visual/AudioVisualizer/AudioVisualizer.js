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

class AudioVisualizer extends GameVisual {
    get FFTData() {
        this.audioAnalyzer.getByteFrequencyData(this.freqByteData);
        return this.freqByteData;
    }

    constructor() {
        super();

        this.timer = new DelayTimer();
        this.audioContext = new AudioContext();

        this.start.next(() => {
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

            this.on("Drop", event => {
                this.loadFile(event.dataTransfer.files[0]);
            });

            this.on("PointerClicked", () => {
                FileIO.openFileDialog(event => {
                    this.loadFile(event.target.files[0]);
                });
            });
        });

        this.update.next(() => {

        });

        this.dispose.next(() => {
            this.audioContext.close();
            if (this.audio) {
                this.audio.remove();
            }
        });

        this.proxy(new GhostEffect(new Color(0, 0, 0, 0.01), 40));
    }

    loadFile(file) {
        if (file && file.type.indexOf("audio") === 0) {
            this.audio.src = URL.createObjectURL(file);
            this.audio.autoplay = true;
            this.audio.play();
            this.audioStatus = true;
        } else {
            alert("Please select an avaliable audio file.");
        }
    }
}

class AudioVisualizerView extends GameView {
    constructor() {
        super();
        this.rotation = 0;
    }

    draw(source, context) {
        let w = this.target.world.width;
        let h = this.target.world.height;
        let cx = w / 2;
        let cy = h / 2;

        if (!this.target.audioStatus) {
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
        for (let index = 0; index < data.length; index++) {
            let value = data[index];
            let x = index / data.length * w;
            let y = cy + value;
            context.lineTo(x, y);
        }
        context.lineWidth = w / data.length;
        context.strokeStyle = "#FFF";
        context.stroke();
    }
}

export {
    AudioVisualizer,
    AudioVisualizerView
};