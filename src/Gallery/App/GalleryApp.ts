import { App } from "../../Engine/Application/AppObject/App";
import { GalleryTextResourceManager, GalleryTexts, GalleryTextLoader } from "../Resources/GalleryTexts";
import { GalleryNavigator } from "./Navigator/GalleryNavigator";
import { GalleryImageResourceManager } from "../Resources/GalleryImages";
import { GalleryGame } from "./Game/GalleryGame";
import { AttachAlert } from "./Alert/AttachAlert";
import { WarningOpenOnPC } from "./Alert/WarningOpenOnPC";
import { ProgressCover } from "./Progress/ProgressCover";
import { GalleryCollection } from "../Collection/GalleryCollection";

export class GalleryApp extends App {
    collection: GalleryCollection = new GalleryCollection();
    constructor() {
        super();
        this.joint(this.collection);
        this.joint(new AttachAlert());
        this.joint(new GalleryNavigator(this.collection));
        this.joint(new WarningOpenOnPC());
        this.joint(new ProgressCover);
        this.joint(new GalleryGame(this.collection));
    }

    load() {
        GalleryTextLoader.load().then(() => {
            GalleryImageResourceManager.load().then(() => {
                this.processes.start.process();
            });
        });
    }
}

