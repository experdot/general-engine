export class Identifier {
    private static unique: number = 1;

    static get Unique() {
        return Identifier.unique++;
    }
}

