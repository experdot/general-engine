class OffsetMap {
    constructor(offsets) {
        this.offsets = offsets;
    }

    setOffsets(offsets) {
        this.offsets = offsets;
        return this;
    }
    getLocations(location) {
        let result = [];
        this.offsets.forEach(offset => {
            result.push(location.add(offset));
        });
        return result;
    }
}

export {
    OffsetMap
};