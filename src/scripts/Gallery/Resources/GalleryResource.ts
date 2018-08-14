import {
    CultureResourceManager,
    CultureResourceConfig
} from "../../Engine/Resources/CultureResourceManager";
import { ConfigurationManager } from "../../Engine/Resources/ConfigurationManager";

export const GalleryResources = {
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

export const CultureResourceConfigUrl = "../static/i18n/config.json";

export const GalleryResourceManager = new CultureResourceManager();

GalleryResourceManager.preload = (preloaded: Function) => {
    const config = new CultureResourceConfig();
    const configurationManager = new ConfigurationManager(CultureResourceConfigUrl).attach(config).load(() => {
        GalleryResourceManager.init(config).attach(GalleryResources);
        preloaded && preloaded();
    });
}
