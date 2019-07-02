import {
    ParticlesFlyerWorld
} from "./Visuals/ParticlesFlyerWorld";
import {
    ParticlesWalkerWorld
} from "./Visuals/ParticlesWalkerWorld";
import {
    ParticlesTreeWorld
} from "./Visuals/ParticlesTreeWorld";
import {
    LSystemTreeWorld
} from "./Visuals/LSystemTreeWorld";
import {
    GameOfLifeWorld
} from "./Visuals/GameOfLifeWorld";
import {
    AudioVisualizerWorld
} from "./Visuals/AudioVisualizerWorld";
import {
    EndlessAbyssWorld
} from "./Games/EndlessAbyssWorld";
import {
    GameBox
} from "../Engine/Game/GameBox/GameBox";
import { ParticlesCircularWorld } from "./Visuals/ParticlesCircularWorld";
import { ParticlesFireWorld } from "./Visuals/ParticlesFireWorld";
import { AutoPaintWorld } from "./Games/AutoPaintWorld";
import { GameWorld } from "../Engine/Game/GameWorld/GameWorld";

export class GalleryStarter {
    static Symbols: {};

    symbols: { [name: string]: typeof GameWorld };

    constructor() {
        this.symbols = {};
        this.addSymbol("flyer", ParticlesFlyerWorld);
        this.addSymbol("walker", ParticlesWalkerWorld);
        this.addSymbol("tree", ParticlesTreeWorld);
        this.addSymbol("lsystemtree", LSystemTreeWorld);
        this.addSymbol("gameoflife", GameOfLifeWorld);
        this.addSymbol("audiovisualizer", AudioVisualizerWorld);
        this.addSymbol("endlessabyss", EndlessAbyssWorld);
        this.addSymbol("circular", ParticlesCircularWorld);
        this.addSymbol("fire", ParticlesFireWorld);
        this.addSymbol("autopaint", AutoPaintWorld);

        GalleryStarter.Symbols = this.symbols;
    }

    addSymbol(name: string, symbol: typeof GameWorld) {
        this.symbols[name] = symbol;
    }

    getSymbolByName(name: string) {
        return this.symbols[name];
    }

    launch(container: HTMLElement, canvas: HTMLCanvasElement) {
        const request = this.getSearchKeyValuePair();
        const World = this.getSymbolByName(request["scene"]);
        if (World) {
            document.title = World["Title"] || "<Blank>";
            return new GameBox(container, canvas, new World(canvas.width, canvas.height));
        } else {
            (window.location as any) = "../";
        }
    }

    private getSearchKeyValuePair() {
        const result: { [name: string]: string } = {};
        const search = location.search;
        if (search.indexOf("?") >= 0) {
            const str = search.substr(1);
            const pairs = str.split("&");
            for (let i = 0; i < pairs.length; i++) {
                result[pairs[i].split("=")[0]] = unescape(pairs[i].split("=")[1]);
            }
        }
        return result;
    }
}