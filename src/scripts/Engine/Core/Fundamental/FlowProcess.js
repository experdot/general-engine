class Task {
    constructor(func, name = "", enabled = true) {
        this.func = func;
        this.name = name;
        this.enabled = enabled;
    }
}

class FlowProcess {
    constructor(context) {
        this.context = context;
        this.tasks = [];
    }

    process() {
        this.tasks.forEach(element => {
            element.enabled && element.func && element.func.call(this.context, ...arguments);
        });
    }
    unshift(func) {
        this.tasks.push(new Task(func));
        return this;
    }
    next(func, index = -1) {
        if (index < 0) {
            index = this.tasks.length;
        }
        this.tasks.splice(index, 0, new Task(func));
        return this;
    }
}
export {
    FlowProcess
};