# general-engine

General Engine is a small TypeScript framework for building connected, process-driven interactive scenes. This repository now ships as a modern `pnpm` workspace with:

- `packages/general-engine`: the reusable library package
- `apps/gallery`: the demo/gallery site built with Vite

## Live Gallery

- Gallery home: <https://experdot.github.io/general-engine/views/gallery.html?scene=tree>
- Flyer: <https://experdot.github.io/general-engine/views/gallery.html?scene=flyer>
- Walker: <https://experdot.github.io/general-engine/views/gallery.html?scene=walker>
- Tree: <https://experdot.github.io/general-engine/views/gallery.html?scene=tree>
- L-System Tree: <https://experdot.github.io/general-engine/views/gallery.html?scene=lsystemtree>
- Game of Life: <https://experdot.github.io/general-engine/views/gallery.html?scene=gameoflife>
- Audio Visualizer: <https://experdot.github.io/general-engine/views/gallery.html?scene=audiovisualizer>
- Endless Abyss: <https://experdot.github.io/general-engine/views/gallery.html?scene=endlessabyss>
- AutoPaint: <https://experdot.github.io/general-engine/views/gallery.html?scene=autopaint>

## What The Library Does

The core abstraction is a `GeneralObject` that declares named processes and can be joined with other objects. Once joined, matching processes are chained together, which makes it easy to model scene systems, effects, views, and game loops as collaborating objects instead of a single large controller.

## Install

For package consumers:

```bash
pnpm add general-engine
```

For repository development:

```bash
pnpm install
```

## Basic Usage

```ts
import { GeneralInterface, GeneralObject } from "general-engine";

class PrintInterface extends GeneralInterface {
    print = [];
}

class PrintBase extends GeneralObject<PrintInterface> {
    constructor() {
        super();
        this.implements(new PrintInterface());
    }
}

class PrintA extends PrintBase {
    print() {
        console.log("Hello World");
    }
}

class PrintB extends PrintBase {
    print() {
        console.log("Hello General Engine");
    }
}

new PrintA().joint(new PrintB()).processes.print?.process();
```

## Workspace Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm dev` starts the Vite-powered gallery app. `pnpm build` builds both the library package and the gallery site.

## License

[MIT](./LICENSE)
