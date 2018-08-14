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

export const GalleryResourceManager = new CultureResourceManager();

const configUrl = "../static/i18n/config.json";
const config = new CultureResourceConfig();

export const GalleryResourceConfig = new ConfigurationManager(configUrl).attach(config).load(() => {
    GalleryResourceManager.init(config).attach(GalleryResources);
    GalleryResourceManager.onPrepared();
});
