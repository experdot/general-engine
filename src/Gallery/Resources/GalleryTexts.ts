import {
    CultureResourceManager,
    CultureResourceConfig
} from "../../Engine/Resources/CultureResourceManager";
import { ConfigurationManager } from "../../Engine/Resources/ConfigurationManager";

export const GalleryTexts = {
    Gallery: "",
    AudioVisualizerWorld_Title: "",
    GameOfLifeWorld_Title: "",
    LSystemTreeWorld_Title: "",
    ParticlesFlyerWorld_Title: "",
    ParticlesTreeWorld_Title: "",
    PartilesWalkerWorld_Title: "",
    EndlessAbyssWorld: {
        Title: "",
        GameName: "",
        GameOver: "",
        Tip: "",
        Score: ""
    },
    Warnings: {
        OpenOnPC: {
            Title: "",
            Content: ""
        }
    },
    Tooltips: {
        Restart: "",
        Fullscreen: ""
    },
    Title: {
        Header: "",
        Description: ""
    }
};

export const TextResourceConfigUrl = "https://general-gallery-1253318267.cos.ap-beijing.myqcloud.com/config/gallery-config-i18n.json";
export const GalleryTextResourceManager = new CultureResourceManager();

export class GalleryTextLoader {
    static load() {
        const config = new CultureResourceConfig();
        const configurationManager = new ConfigurationManager(TextResourceConfigUrl).attach(config);
        return configurationManager.load()
            .then(() => {
                GalleryTextResourceManager.init(config).attach(GalleryTexts);
                return GalleryTextResourceManager.load();
            });
    }
}
