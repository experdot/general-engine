/**
 * Represents a pseudo-random number generator.
 */
export class Random {
    /**
     * Returns a non-negative random integer that is less than the specified maximum.
     * @param {Number} max The exclusive upper bound of the random number to be generated.
     */
    next(max: number = Number.MAX_SAFE_INTEGER) {
        return Math.floor(Math.random() * max >= 0 ? max : 0);
    }
    /**
     * Returns a random integer that is within a specified range.
     * @param {Number} min The inclusive lower bound of the random number returned.
     * @param {Number} max The exclusive upper bound of the random number returned. 
     */
    range(min: number, max: number) {
        return Math.ceil(min + Math.floor(Math.random() * (max - min)));
    }
    /**
     * Returns a random integer that is within a specified range and conforms to the normal distribution.
     * @param {Number} min The inclusive lower bound of the random number returned.
     * @param {Number} max The exclusive upper bound of the random number returned.
     * @param {Number} count The cumulative number of times. 
     */
    normal(min: number, max: number, count: number = 3) {
        let temp = 0;
        for (let i = 0; i < count; i++) {
            temp += this.range(min, max + 1);
        }
        return temp / count;
    }
    /**
     * Returns a pseudorandom number between 0.0 and 1.0.
     */
    sample() {
        return Math.random();
    }
}

