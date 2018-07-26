class GeneralInterface {
    public processes: string[];

    constructor(processes: string[]) {
        this.processes = [...processes];
    }

    clone(): GeneralInterface {
        return new GeneralInterface(this.processes);
    }

    extends(processes: string[]) {
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