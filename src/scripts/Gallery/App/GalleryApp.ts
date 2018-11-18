import { App } from "../../Engine/Application/AppObject/App";
import { GalleryTextResourceManager, GalleryTexts } from "../Resources/GalleryTexts";
import { PlatformInfo } from "../../Engine/Platform/PlatformInfo";
import { GameBox } from "../../Engine/Game/GameBox/GameBox";
import { GalleryStarter } from "../GalleryStarter";
import { GalleryNavigator } from "./GalleryNavigator";
import { GalleryImageResourceManager } from "../Resources/GalleryImages";
import { Utilities } from "../../Engine/Common/Utilities";
import { MessageBox } from "../../Engine/Application/MessageBox";

export class GalleryApp extends App {
    constructor() {
        super();
        this.joint(new AttachAlert());
        this.joint(new GalleryNavigator());
        this.joint(new WarningOpenOnPC());
        this.joint(new LayerProgress);
        this.joint(new GalleryGames());
    }

    launch() {
        GalleryTextResourceManager.load(() => {
            GalleryImageResourceManager.load(() => {
                this.processes.run.process();
            });
        });
    }
}

class AttachAlert extends App {
    launch() {
        MessageBox.onNotify = (message: string, title?: string, timeout?: number) => {
            let $alert = $(`                
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>${title}</strong> ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `);
            $("#alert-container").append($alert);
            setTimeout(() => {
                ($alert as any).alert("close");
            }, timeout || 6000);
        };
    }
}

class WarningOpenOnPC extends App {
    launch() {
        if (!sessionStorage.getItem("warningFlag")) {
            sessionStorage.setItem("warningFlag", "unknown");
        }
    }

    run() {
        let flag = sessionStorage.getItem("warningFlag");
        if (flag == "unknown" && !PlatformInfo.IsMobile) {
            sessionStorage.setItem("warningFlag", "known");
            let warning = GalleryTexts.Warnings.OpenOnPC;
            MessageBox.show(warning.Content, warning.Title, 6000);
        }
    }
}

class LayerProgress extends App {
    run() {
        setTimeout(() => {
            let layer = $("#game-layer-progress");
            layer.removeClass("show");
            setTimeout(() => {
                layer.remove();
            }, 150);
        }, 850);
    }
}

class GalleryGames extends App {
    private box: GameBox;
    private starter: GalleryStarter = new GalleryStarter();

    launch() {
        window.addEventListener("resize", () => {
            this.box.stop();
            this.run();
        });

        $("#button-restart").click(() => {
            this.box.stop();
            this.run();
        });

        $("#button-fullscreen").click(() => {
            Utilities.requestFullScreen(true, document.querySelector("#gallery-game"));
        });
    }

    run() {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.width = window.document.body.clientWidth;
        canvas.height = window.document.body.clientHeight;

        this.box = this.starter.launch(document.getElementById("game-layer-canvas"), canvas);
        this.box.frameManager.onRateChanged = (rate: number) => {
            let frame = $("#text-frame")
            if (frame) {
                frame.text(rate);
            }
        };
        this.box.run();
    }
}