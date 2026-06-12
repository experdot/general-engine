import { App } from "@legacy/Engine/Application/AppObject/App";
import { GalleryTexts } from "../../Resources/GalleryTexts";
import { GalleryCollection } from "../../Collection/GalleryCollection";
import { byId, setText, setTitle } from "../../../dom";

export const enum GalleryNavigatorIds {
    TilteHeader = "gallery-navigator-title-header",
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
        setText(GalleryNavigatorIds.TilteHeader, GalleryTexts.Title.Header);
        setText(GalleryNavigatorIds.TilteDescription, GalleryTexts.Title.Description);
    }
}

class NavigatorTooltips extends App {
    start() {
        setTitle(GalleryNavigatorIds.ButtonRestart, GalleryTexts.Tooltips.Restart);
        setTitle(GalleryNavigatorIds.ButtonFullscreen, GalleryTexts.Tooltips.Fullscreen);
    }
}

class NavigatorDropdown extends App {
    collection: GalleryCollection;
    constructor(collection: GalleryCollection) {
        super();
        this.collection = collection;
    }

    start() {
        const baseUrl = "./gallery.html?scene=";
        const dropdown = byId<HTMLDivElement>(GalleryNavigatorIds.Dropdown);
        dropdown.replaceChildren();
        for (const key in this.collection.infos) {
            const link = document.createElement("a");
            link.className = "dropdown-item";
            link.href = `${baseUrl}${key}`;
            link.textContent = this.collection.infos[key].title;
            dropdown.appendChild(link);
        }
    }
}
