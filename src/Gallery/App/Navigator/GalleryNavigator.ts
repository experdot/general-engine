import { App } from "../../../Engine/Application/AppObject/App";
import { GalleryTexts } from "../../Resources/GalleryTexts";
import { WorldInfos, GalleryCollection } from "../../Collection/GalleryCollection";

export const enum GalleryNavigatorIds {
    TilteHeader = "gallery-navigator-tiltle-header",
    TilteDescription = "gallery-navigator-title-description",
    ButtonRestart = "gallery-navigator-restart",
    ButtonFullscreen = "gallery-navigator-fullscreen",
    Dropdown = "gallery-navigator-dropdown",
    FrameText = "gallery-navigator-frame"
}

export class GalleryNavigator extends App {
    constructor(collection: GalleryCollection) {
        super();
        this.joint(new NavigatorTitle());
        this.joint(new NavigatorTooltips());
        this.joint(new NavigatorDropdown(collection));
    }
}

class NavigatorTitle extends App {
    start() {
        $(`#${GalleryNavigatorIds.TilteHeader}`).text(GalleryTexts.Title.Header);
        $(`#${GalleryNavigatorIds.TilteDescription}`).text(GalleryTexts.Title.Description);
    }
}

class NavigatorTooltips extends App {
    start() {
        $(`#${GalleryNavigatorIds.ButtonRestart}`).attr("title", GalleryTexts.Tooltips.Restart);
        $(`#${GalleryNavigatorIds.ButtonFullscreen}`).attr("title", GalleryTexts.Tooltips.Fullscreen);
        $(function () {
            ($("[data-toggle='tooltip']") as any).tooltip();
        });
    }
}

class NavigatorDropdown extends App {
    collection: GalleryCollection;
    constructor(collection: GalleryCollection) {
        super();
        this.collection = collection;
    }
    start() {
        const baseUrl = "./gallery.html?scene="
        const $dropdown = $(`#${GalleryNavigatorIds.Dropdown}`);
        $dropdown.empty();
        for (const key in this.collection.infos) {
            $dropdown.append($(`<a class="dropdown-item" href="${baseUrl}${key}">${this.collection.infos[key].title}</a>`));
        }
    }
}
