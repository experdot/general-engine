import { IRule } from "./RuleBase";

class RuleSet<T> {

    rules: IRule<T>[];

    constructor() {
        this.rules = [];
    }

    add(rule: IRule<T>) {
        this.rules.push(rule);
        this.rules.sort((a, b) => a.priority - b.priority);
    }
}
export {
    RuleSet
};