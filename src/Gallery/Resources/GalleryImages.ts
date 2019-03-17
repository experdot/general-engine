import { ConfigurationManager } from "../../Engine/Resources/ConfigurationManager";

export const GalleryImages = {
    Bird: "",
    Galaxy: "",
    Cloud: ""
}

export const ImageResourceConfigUrl = "https://general-gallery-1253318267.cos.ap-beijing.myqcloud.com/config/gallery-config-image.json";
export const GalleryImageResourceManager = new ConfigurationManager(ImageResourceConfigUrl).attach(GalleryImages);