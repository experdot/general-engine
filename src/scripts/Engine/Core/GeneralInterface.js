class GeneralInterface {
    constructor(processes) {
        this.processes = [...processes];
    }

    clone() {
        return new GeneralInterface(this.processes);
    }

    extends(processes) {
        processes.forEach(element => {
            if (this.processes.indexOf(element) < 0) {
                this.processes.push(element);
            }
        });
        return this;
    }
}

export {
    GeneralInterface
};