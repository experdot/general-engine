export class ArrayExtensions {
    static bind(target: any = Array.prototype) {
        if (!target.findIndex) {
            target.findIndex = function (match) {
                for (let index = 0; index < this.length; index++) {
                    const element = this[index];
                    if (match(element)) {
                        return index;
                    }
                }
                return -1;
            };
        }

        target.find = function (match) {
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                if (match(element)) {
                    return element;
                }
            }
            return undefined;
        };

        target.first = function () {
            return this[0];
        };

        target.last = function () {
            return this[this.length - 1];
        };

        /**
         * Retrieves all the elements that match the conditions defined by the specified predicate.
         * @param {any} match - The match that defines the conditions of the elements to search for.
         */
        target.findAll = function (match) {
            let result = [];
            for (let index = 0; index < this.length; index++) {
                const element = this[index];
                if (match(element)) {
                    result.push(element);
                }
            }
            return result;
        };

        /**
         * Searches for an element that matches the conditions defined by the specified predicate, and returns the last occurrence within the entire Array.
         * @param {*} match - The match that defines the conditions of the last element to search for.
         */
        target.findLast = function (match) {
            return this.findAll(match).last();
        };

        /**
         * Determines whether the Array contains elements that match the conditions defined by the specified predicate.
         * @param {any} match - The match that defines the conditions of the elements to search for.
         */
        target.exists = function (match) {
            return this.findIndex(match) >= 0;
        };

        /**
         * Determines whether an element is in the Array.
         * @param {any} element 
         */
        target.contains = function (element) {
            return this.findIndex(e => e === element) >= 0;
        };

        /**
         * Removes the first occurrence of a specific object from the Array.
         * @param {any} element 
         */
        target.remove = function (element) {
            let index = this.findIndex(e => e === element);
            if (index >= 0) {
                this.splice(index, 1);
            }
            return this;
        };

        /**
         * Removes all the elements that match the conditions defined by the specified predicate.
         * @param {any} match - The match that defines the conditions of the elements to search for.
         */
        target.removeAll = function (match) {
            let index = this.findIndex(match);
            while (index > -1) {
                this.splice(index, 1);
                index = this.findIndex(match);
            }
            return this;
        };
    }
}