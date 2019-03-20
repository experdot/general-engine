import { InputBase, Inputs, InputEvents } from "./Inputs";
import { Vector2 } from "../Numerics/Vector2";

export class DragDropInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        this.registEvent("drop", InputEvents.Drop, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragenter", InputEvents.DragEnter, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragleave", InputEvents.DragLeave, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragover", InputEvents.DragOver, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }
}