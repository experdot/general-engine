export const GalleryTexts = {
    Gallery: "General Engine",
    AudioVisualizerWorld_Title: "Audio Visualizer",
    GameOfLifeWorld_Title: "Game of Life",
    LSystemTreeWorld_Title: "L-System Tree",
    ParticlesFlyerWorld_Title: "Flyer",
    ParticlesTreeWorld_Title: "Tree",
    PartilesWalkerWorld_Title: "Walker",
    EndlessAbyssWorld: {
        Title: "Endless Abyss",
        GameName: "Endless Abyss",
        GameOver: "Game Over",
        Tip: "Press space or click to start.",
        Score: "Score: "
    },
    AutoPaintWorld: {
        Title: "Game - AutoPaint",
        GameName: "AutoPaint",
        GameOver: "Completed",
        Tip: "Drop an image or wait for auto paint.",
        Score: ""
    },
    Warnings: {
        OpenOnPC: {
            Title: "Best on desktop",
            Content: "This scene was designed for a larger screen and pointer input."
        }
    },
    Tooltips: {
        Restart: "Restart",
        Fullscreen: "Fullscreen"
    },
    Title: {
        Header: "General Engine",
        Description: "Build creative scenarios by general system."
    }
};

export class GalleryTextLoader {
    static async load() {
        return Promise.resolve(GalleryTexts);
    }
}
