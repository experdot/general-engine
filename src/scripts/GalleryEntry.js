import {
    GalleryStarter
} from "./Gallery/GalleryStarter";
import {
    GalleryResourceManager,
    GalleryResources
} from "./Gallery/Resources/GalleryResource";

let gameStarter = null;
let gamebox = null;

initialize();

startGame();

/* eslint-disable */

function initialize() {
    window.addEventListener("resize", function () {
        gamebox.stop();
        startGame();
    });

    $("#button-restart").click(() => {
        gamebox.stop();
        startGame();
    });

    let mode = true;
    $("#button-fullscreen").click(() => {
        let methods = ["ms", "moz", "webkit"].map(v => v + (mode ? "RequestFullscreen" : "ExitFullscreen"));
        methods.forEach(v => {
            if (mode) {
                document.documentElement[v] && document.documentElement[v]();
            } else {
                document[v] && document[v]();
            }
        });
        mode = !mode;
    });

    if (!sessionStorage.getItem("warningFlag")) {
        sessionStorage.setItem("warningFlag", "unknown");
    }


}

function startGame() {
    let canvas = document.getElementById("canvas");
    canvas.width = window.document.body.clientWidth;
    canvas.height = window.document.body.clientHeight;

    GalleryResourceManager.wait(() => {
        gameStarter = new GalleryStarter()

        setTooltips();
        warningOpenOnPC();
        loadGalleryDropdown();

        gamebox = gameStarter.launch(document.getElementById("canvas-container"), canvas);
        gamebox.frameManager.onRateChanged = rate => {
            let frame = $("#text-frame")
            if (frame) {
                frame.text(rate);
            }
        };
        gamebox.run();
    });
}

function setTooltips() {
    $("#button-restart").attr("title", GalleryResources.Tooltips.Restart);
    $("#button-fullscreen").attr("title", GalleryResources.Tooltips.Fullscreen);
    $(function () {
        $("[data-toggle='tooltip']").tooltip();
    });
}

function warningOpenOnPC() {
    let flag = sessionStorage.getItem("warningFlag");
    if (flag == "unknown" && /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
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
            $alert.alert("close");
        }, 6000)
    }
}

let galleryDrowdownFlag = false;

function loadGalleryDropdown() {
    if (!galleryDrowdownFlag) {
        galleryDrowdownFlag = true;
        let baseUrl = "https://experdot.github.io/general-engine/views/gallery.html?scene="
        let $dropdown = $("#dropdown-gallery");
        let worlds = gameStarter.symbols
        for (let key in worlds) {
            $dropdown.append($(`<a class="dropdown-item" href="${baseUrl}${key}">${worlds[key].Title}</a>`));
        }
    }
}