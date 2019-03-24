import { App } from "../../../Engine/Application/AppObject/App";
import { PlatformInfo } from "../../../Engine/Platform/PlatformInfo";
import { GalleryTexts } from "../../Resources/GalleryTexts";
import { MessageBox } from "../../../Engine/Application/MessageBox";

const enum SessionStorageIds {
    WarningOpenOnPC = "Gallery-WarningOpenOnPC"
}

export class WarningOpenOnPC extends App {
    start() {
        if (PlatformInfo.isMobile) {
            const flag = sessionStorage.getItem(SessionStorageIds.WarningOpenOnPC);
            if (!flag) {
                sessionStorage.setItem(SessionStorageIds.WarningOpenOnPC, "set");
                const warning = GalleryTexts.Warnings.OpenOnPC;
                MessageBox.show(warning.Content, warning.Title, 6000);
            }
        }
    }
}