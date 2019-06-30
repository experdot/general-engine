export class ResourceSet {
    src: string;
    data: any;

    constructor(src: string) {
        this.src = src;
    }

    init(data: any) {
        this.data = data;
    }

    async load() {
        await fetch(this.src).then(response => response.json()).then(data => this.init(data));
    }
}
