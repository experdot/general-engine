let unique = 0;

class Identifier {
    static get Unique() {
        return unique++;
    }
}

export {
    Identifier
};