import { App } from "../../Engine/Application/AppObject/App";
import { GalleryResourceManager, GalleryResources } from "../Resources/GalleryResource";
import { PlatformInfo } from "../../Engine/Platform/PlatformInfo";
import { GameBox } from "../../Engine/Game/GameBox/GameBox";
import { GalleryStarter } from "../GalleryStarter";
import { GalleryNavigator } from "./GalleryNavigator";

export class GalleryApp extends App {
    constructor() {
        super();
        this.joint(new GalleryNavigator());
        this.joint(new WarningOpenOnPC());
        this.joint(new GalleryGames());
    }

    launch() {
        GalleryResourceManager.load(() => {
            this.$run.process();
        })
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
        if (flag == "unknown" && PlatformInfo.IsMobile) {
            sessionStorage.setItem("warningFlag", "known");
            let warning = GalleryResources.Warnings.OpenOnPC;
            let $alert = $(`                
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>${warning.Title}</strong> ${warning.Content}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `);
            $("#alert-container").append($alert);
            setTimeout(() => {
                ($alert as any).alert("close");
            }, 6000)
        }
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

        let mode = true;
        $("#button-fullscreen").click(() => {
            let methods = ["ms", "moz", "webkit"].map(v => v + (mode ? "RequestFullscreen" : "ExitFullscreen"));
            methods.forEach(v => {
                if (mode) {
                    if ((document.documentElement as any)[v]) {
                        (document.documentElement as any)[v]();
                    }
                }
                else {
                    if ((document as any)[v]) {
                        (document as any)[v]();
                    }
                }
            });
            mode = !mode;
        });
    }

    run() {
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.width = window.document.body.clientWidth;
        canvas.height = window.document.body.clientHeight;

        this.box = this.starter.launch(document.getElementById("canvas-container"), canvas);
        this.box.frameManager.onRateChanged = (rate: number) => {
            let frame = $("#text-frame")
            if (frame) {
                frame.text(rate);
            }
        };
        this.box.run();
    }
}