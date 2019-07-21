import { GeneralNode } from "../../Core/GeneralNode";
import { GameVsiualInterface } from "../GameInterface/GameInterface";
import { Events } from "../../Common/Events";
import { GameWorld } from "../GameWorld/GameWorld";

export class GameVisual extends GeneralNode<GameVsiualInterface> {
    events: Events;
    world: GameWorld;

    constructor() {
        super();
        this.implements(new GameVsiualInterface());
        this.events = new Events();
    }

    on(eventName: string, handler: Function) {
        this.events.addHandler(eventName, handler);
    }

    off(eventName: string, handler: Function) {
        this.events.removeHandler(eventName, handler);
    }

    dispatch(eventName: string, ...args: any[]) {
        this.events.raiseEvent(eventName, ...args);
        this.children.forEach(element => {
            (element as GameVisual).dispatch(eventName, ...args);
        });
    }

    dispose(source?: any) {
        this.events.dispose();
    }
}