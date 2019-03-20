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