/**
 * Represents a pseudo-random number generator.
 */
class Random {
    /**
     * Returns a random integer that is within a specified range.
     * @param {Number} min The inclusive lower bound of the random number returned.
     * @param {Number} max The exclusive upper bound of the random number returned. 
     */
    next(min, max) {
        return parseInt(min + Math.floor(Math.random() * (max - min)));
    }
    /**
     * Returns a random integer that is within a specified range and conforms to the normal distribution.
     * @param {Number} min The inclusive lower bound of the random number returned.
     * @param {Number} max The exclusive upper bound of the random number returned.
     * @param {Number} count The cumulative number of times. 
     */
    nextNorm(min, max, count = 3) {
        let temp = 0;
        for (let i = 0; i < count; i++) {
            temp += this.next(min, max + 1);
        }
        return temp / count;
    }
}

export {
    Random
};