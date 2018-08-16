import { ConfigurationManager } from "../../Engine/Resources/ConfigurationManager";

export const GalleryImages = {
    Bird: "",
    Galaxy: ""
}

export const ImageResourceConfigUrl = "https://resources.general-engine.com/image/gallery-image.json";
export const GalleryImageResourceManager = new ConfigurationManager(ImageResourceConfigUrl).attach(GalleryImages);