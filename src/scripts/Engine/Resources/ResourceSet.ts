export class ResourceSet {
    src: string;
    loaded: boolean;
    data: any;

    constructor(src: string) {
        this.src = src;
    }

    init(data: any) {
        this.data = data;
        this.loaded = true;
    }
}
