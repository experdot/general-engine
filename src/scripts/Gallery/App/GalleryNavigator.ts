import { App } from "../../Engine/Application/AppObject/App";
import { GalleryResources } from "../Resources/GalleryResource";
import { GalleryStarter } from "../GalleryStarter";

export class GalleryNavigator extends App {
    constructor() {
        super();
        this.joint(new NavigatorTitle());
        this.joint(new NavigatorTooltips());
        this.joint(new NavigatorDropdown());
    }
}

class NavigatorTitle extends App {
    run() {
        $("#title-header").text(GalleryResources.Title.Header);
        $("#title-description").text(GalleryResources.Title.Description);
    }
}

class NavigatorTooltips extends App {
    run() {
        $("#button-restart").attr("title", GalleryResources.Tooltips.Restart);
        $("#button-fullscreen").attr("title", GalleryResources.Tooltips.Fullscreen);
        $(function () {
            ($("[data-toggle='tooltip']") as any).tooltip();
        });
    }
}

class NavigatorDropdown extends App {
    private static HasRun: boolean;

    run() {
        if (!NavigatorDropdown.HasRun) {
            NavigatorDropdown.HasRun = true;
            let baseUrl = "./gallery.html?scene="
            let $dropdown = $("#dropdown-gallery");
            let worlds = GalleryStarter.Symbols;
            for (let key in worlds) {
                $dropdown.append($(`<a class="dropdown-item" href="${baseUrl}${key}">${worlds[key].Title}</a>`));
            }
        }
    }
}
