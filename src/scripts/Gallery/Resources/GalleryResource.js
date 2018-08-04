import {
    CultureResourceManager,
    CultureResourceConfig
} from "../../Engine/Resources/CultureResourceManager";

const GalleryResources = {
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
    }
};

const config = new CultureResourceConfig("../static/i18n/gallery.{{language}}.json", ["en-US", "zh-CN"]);

const GalleryResourceManager = new CultureResourceManager(config).attach(GalleryResources);

export {
    GalleryResourceManager,
    GalleryResources
};