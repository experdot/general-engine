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

export type GameWorldSymbols = {
    [name: string]: typeof GameWorld
}

export class GalleryCollection {
    symbols: GameWorldSymbols;

    constructor() {
        this.symbols = {};
        this.addSymbol("flyer", ParticlesFlyerWorld);
        this.addSymbol("walker", ParticlesWalkerWorld);
        this.addSymbol("tree", ParticlesTreeWorld);
        this.addSymbol("lsystemtree", LSystemTreeWorld);
        this.addSymbol("gameoflife", GameOfLifeWorld);
        this.addSymbol("audiovisualizer", AudioVisualizerWorld);
        this.addSymbol("endlessabyss", EndlessAbyssWorld);
        this.addSymbol("autopaint", AutoPaintWorld);
    }

    addSymbol(name: string, symbol: typeof GameWorld) {
        this.symbols[name] = symbol;
    }

    getSymbolByName(name: string) {
        return this.symbols[name];
    }
}