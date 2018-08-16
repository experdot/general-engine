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

export const TextResourceConfigUrl = "https://resources.general-engine.com/i18n/gallery-i18n.json";

export const GalleryTextResourceManager = new CultureResourceManager();

GalleryTextResourceManager.preload = (preloaded: Function) => {
    const config = new CultureResourceConfig();
    const configurationManager = new ConfigurationManager(TextResourceConfigUrl).attach(config).load(() => {
        GalleryTextResourceManager.init(config).attach(GalleryTexts);
        preloaded && preloaded();
    });
}
