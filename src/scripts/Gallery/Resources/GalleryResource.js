import {
    CultureResourceManager,
    CultureResourceConfig
} from "../../Engine/Resources/ResourceManager";

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
    }
};

const config = new CultureResourceConfig("../static/i18n/gallery.{{language}}.json", ["en-US", "zh-CN"]);

const GalleryResourceManager = new CultureResourceManager(config).load(GalleryResources);

export {
    GalleryResourceManager,
    GalleryResources
};