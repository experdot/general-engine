import {
    InvalidOperationException
} from "./Exception";

class Namespace {
    static combine(...args) {
        let result = {};
        args.forEach(element => {
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    const value = element[key];
                    if (result[key]) {
                        throw new InvalidOperationException("A key is conflict while combined namespaces.");
                    }
                    result[key] = value;
                }
            }
        });
        return result;
    }
}

export {
    Namespace
};