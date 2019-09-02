import { App } from "../../../Engine/Application/AppObject/App";
import { GalleryTexts } from "../../Resources/GalleryTexts";
import { GalleryCollection, GameWorldSymbols } from "../../Collection/GalleryCollection";
import { GameWorld } from "../../../Engine/Game/GameWorld/GameWorld";

export const enum GalleryNavigatorIds {
    TilteHeader = "gallery-navigator-tiltle-header",
    TilteDescription = "gallery-navigator-title-description",
    ButtonRestart = "gallery-navigator-restart",
    ButtonFullscreen = "gallery-navigator-fullscreen",
    Dropdown = "gallery-navigator-dropdown",
    FrameText = "gallery-navigator-frame"
}

export class GalleryNavigator extends App {
    constructor(symbols: GameWorldSymbols) {
        super();
        this.joint(new NavigatorTitle());
        this.joint(new NavigatorTooltips());
        this.joint(new NavigatorDropdown(symbols));
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
    symbols: GameWorldSymbols;
    constructor(symbols: GameWorldSymbols) {
        super();
        this.symbols = symbols;
    }
    start() {
        const baseUrl = "./gallery.html?scene="
        const $dropdown = $(`#${GalleryNavigatorIds.Dropdown}`);
        $dropdown.empty();
        for (const key in this.symbols) {
            $dropdown.append($(`<a class="dropdown-item" href="${baseUrl}${key}">${this.symbols[key]["Title"]}</a>`));
        }
    }
}
