import {
    ResourceManager
} from "../../Engine/Resources/ResourceManager";

const langs = ["en-US", "zh-CN"];
const currentLang = langs.findIndex(v => v === navigator.language) >= 0 ? navigator.language : langs[0];

const json_url = `../static/i18n/gallery.${currentLang}.json`;

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

const GalleryResourceManager = new ResourceManager().load(json_url, GalleryResources);

export {
    GalleryResourceManager,
    GalleryResources
};