class RuleSet {
    constructor() {
        this.rules = [];
    }
    add(rule) {
        this.rules.push(rule);
        this.rules.sort((a, b) => a.priority - b.priority);
    }
}
export {
    RuleSet
};