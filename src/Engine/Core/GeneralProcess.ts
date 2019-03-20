import { GeneralTask } from "./GeneralTask";

export class GeneralProcess<TThis,TArgs extends any[]> {
    thisArg: TThis;
    tasks: GeneralTask[];

    enabled: boolean = true;

    constructor(thisArg: TThis) {
        this.thisArg = thisArg;
        this.tasks = [];
    }

    process(source: TThis = this.thisArg, ...args: TArgs): this {
        if (this.enabled) {
            this.tasks.forEach(task => {
                task.run(this.thisArg, source, ...args);
            });
        }
        return this;
    }

    before(action: Function, identifier?: number): this {
        action && this.tasks.unshift(new GeneralTask(action, identifier));
        return this;
    }

    next(action: Function, identifier?: number): this {
        action && this.tasks.push(new GeneralTask(action, identifier));
        return this;
    }

    remove(identifier?: number): this {
        const tasks = this.tasks.filter(v => v.identifier === identifier);
        tasks.forEach(task => {
            const index = this.tasks.indexOf(task);
            if (index >= 0) {
                this.tasks.splice(index, 1);
            }
        });
        return this;
    }

    clear(): this {
        this.tasks = [];
        return this;
    }

    enable(): this {
        this.enabled = true;
        return this;
    }

    disable(): this {
        this.enabled = false;
        return this;
    }
}
