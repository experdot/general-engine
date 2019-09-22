import { GameBox } from "../../Engine/Game/GameBox/GameBox";
import { GameWorld } from "../../Engine/Game/GameWorld/GameWorld";
import { ParticlesFlyerWorld } from "../Visuals/ParticlesFlyerWorld";
import { ParticlesWalkerWorld } from "../Visuals/ParticlesWalkerWorld";
import { ParticlesTreeWorld } from "../Visuals/ParticlesTreeWorld";
import { LSystemTreeWorld } from "../Visuals/LSystemTreeWorld";
import { GameOfLifeWorld } from "../Visuals/GameOfLifeWorld";
import { AudioVisualizerWorld } from "../Visuals/AudioVisualizerWorld";
import { EndlessAbyssWorld } from "../Games/EndlessAbyssWorld";
import { AutoPaintWorld } from "../Games/AutoPaintWorld";
import { GalleryTexts } from "../Resources/GalleryTexts";
import { App } from "../../Engine/Application/AppObject/App";

export type WorldInfo = {
    title: string;
    symbol: typeof GameWorld;
}

export type WorldInfos = {
    [name: string]: WorldInfo;
}

export class GalleryCollection extends App {
    infos: WorldInfos;

    start() {
        this.infos = {};
        this.addWorld("flyer", GalleryTexts.ParticlesFlyerWorld_Title, ParticlesFlyerWorld);
        this.addWorld("walker", GalleryTexts.PartilesWalkerWorld_Title, ParticlesWalkerWorld);
        this.addWorld("tree", GalleryTexts.ParticlesTreeWorld_Title, ParticlesTreeWorld);
        this.addWorld("lsystemtree", GalleryTexts.LSystemTreeWorld_Title, LSystemTreeWorld);
        this.addWorld("gameoflife", GalleryTexts.GameOfLifeWorld_Title, GameOfLifeWorld);
        this.addWorld("audiovisualizer", GalleryTexts.AudioVisualizerWorld_Title, AudioVisualizerWorld);
        this.addWorld("endlessabyss", GalleryTexts.EndlessAbyssWorld.Title, EndlessAbyssWorld);
        this.addWorld("autopaint", "AutoPaint", AutoPaintWorld);
    }

    addWorld(name: string, title: string, symbol: typeof GameWorld) {
        this.infos[name] = { title, symbol };
    }

    getSymbolByName(name: string) {
        return this.infos[name] && this.infos[name].symbol;
    }
}