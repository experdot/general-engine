export class Identifier {
    private static uniqueCount: number = 1;

    static get unique() {
        return Identifier.uniqueCount++;
    }
}

