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
} from "../../../Common/Graphics";
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

        this.proxy(new GhostEffect(new Color(0, 255, 0, 0.01), 40));
    }

    loadFile(file) {
        if (file && file.type.indexOf("audio") === 0) {
            this.audio.src = URL.createObjectURL(file);
            //this.audio.autoplay = true;
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
        let viewport = {
            w: this.target.world.width,
            h: this.target.world.height,
        };

        let cx = viewport.w / 2;
        let cy = viewport.h / 2;

        let data = this.target.FFTData;

        if (!this.target.audioStatus) {
            context.font = "32px Arial";
            context.textAlign = "center";
            context.fillStyle = "#FFF";
            context.fillText("Drag an audio file here.", cx, cy - 16);
        } else {
            Graphics.offsetScale(context, 6, 6);
        }

        context.beginPath();
        for (let index = 0; index < data.length; index++) {
            let value = data[index];
            let x = index / data.length * viewport.w;
            let y = cy + value;
            context.lineTo(x, y);
        }
        //context.closePath();

        context.lineWidth = viewport.w / data.length;
        context.strokeStyle = "#FFF";
        context.stroke();

        if (!this.target.audioStatus) {
            Graphics.mirror(context, 1, -1);
        } else {
            Graphics.rotate(context, Math.PI);
        }
    }
}

export {
    AudioVisualizer,
    AudioVisualizerView
};