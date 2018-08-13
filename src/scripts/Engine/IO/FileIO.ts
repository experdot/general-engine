import { Exception } from "../Common/Exception";

export class FileIO {
    static openFileDialog(onLoaded: Function, accept = "") {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", accept);
        input.onchange = (event) => {
            onLoaded && onLoaded(event);
        };
        input.style.display = "none";
        document.body.appendChild(input);
        input.click();//TODO
        input.remove();
    }

    static readAllText(file: File, onLoaded: Function) {
        this._readByFileReader(file, onLoaded, (reader: FileReader, file: File) => {
            reader.readAsText(file);
        });
    }

    static readAsDataURL(file: File, onLoaded: Function) {
        this._readByFileReader(file, onLoaded, (reader: FileReader, file: File) => {
            reader.readAsDataURL(file);
        });
    }

    static _readByFileReader(file: File, onLoaded: Function, action: (reader: FileReader, file: File) => void) {
        let reader = new FileReader();
        action(reader, file);
        reader.onload = () => {
            onLoaded && onLoaded(reader.result);
        };
        reader.onerror = () => {
            throw new Exception("Could not read file, error: " + reader.error);
        };
    }
}