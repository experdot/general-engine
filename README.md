# general-engine
[![npm][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![codebeat badge][codebeat-image]][codebeat-url]

> *General Engine* is a framework to build web applications or games.

## Gallery
To check out live examples created with general-engine, please visit [gallery][repo-gallery] website.

 🌳 [Tree](https://general-engine.com/views/gallery.html?scene=tree)

 🕊 [Flyer](https://general-engine.com/views/gallery.html?scene=flyer)
 
 💥 [Walker](https://general-engine.com/views/gallery.html?scene=walker)
 
 🌀 [Endless Abyss](https://general-engine.com/views/gallery.html?scene=endlessabyss)
 
 ⚔ [Game of life](https://general-engine.com/views/gallery.html?scene=gameoflife)
 
 🌿 [L-System Tree](https://general-engine.com/views/gallery.html?scene=lsystemtree)
 
 🎵 [Audio Visualizer](https://general-engine.com/views/gallery.html?scene=audiovisualizer)

## Install
Download a [stable release][repo-releases] and include the script in your web page:
``` html
<script src="general-engine.js" type="text/javascript"></script>
```
You can also install using the package manager [NPM][npm-url].
``` bash
$ npm install general-engine
```
## Hello World
The following is a simple hello-world example.

```ts
import { GeneralInterface, GeneralObject } from "../src/Engine/Core/GeneralObject";

class IPrintInterface extends GeneralInterface {
    print = [];
}

class PrintBase extends GeneralObject<IPrintInterface>{
    constructor() {
        super();
        this.implements(new IPrintInterface());
    }
}

class PrintA extends PrintBase {
    print() {
        console.log("Hello World");
    }
}

class PrintB extends PrintBase {
    print() {
        console.log("Hello General-Engine");
    }
}

new PrintA().joint(new PrintB()).processes.print.process();

// Output:
// Hello World
// Hello General-Engine
```

## Building 
To build you must first install [node.js](http://nodejs.org/) and [gulp](http://gulpjs.com/), then run
``` bash
$ npm install
```
This will install the required build dependencies, then run
``` bash
$ gulp watch
```
to spawn a development server.

## License
- [MIT](./LICENSE)

[repo-releases]: https://github.com/experdot/general-engine/releases
[repo-gallery]: https://experdot.github.io/general-engine/views/gallery.html?scene=endlessabyss

[npm-url]: https://www.npmjs.com/package/general-engine
[npm-image]: https://img.shields.io/npm/v/general-engine.svg

[travis-url]: https://travis-ci.org/experdot/general-engine
[travis-image]: https://travis-ci.org/experdot/general-engine.svg?branch=master

[codebeat-url]: https://codebeat.co/projects/github-com-experdot-general-engine-master
[codebeat-image]: https://codebeat.co/badges/7c21280a-03fb-4abc-90eb-a4f50c3e2760
