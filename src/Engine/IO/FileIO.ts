import { Exception } from "../Common/Exception";

export class FileIO {
    static openFileDialog(onLoaded: (event: Event) => void, accept = "") {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", accept);
        input.onchange = (event) => {
            onLoaded && onLoaded(event);
            input.remove();
        };
        input.oncancel = () => {
            input.remove();
        }
        input.style.display = "none";
        document.body.appendChild(input);
        input.click();
    }

    static readAllText(file: File, onLoaded: Function) {
        this.readByFileReader(file, onLoaded, (reader: FileReader, file: File) => {
            reader.readAsText(file);
        });
    }

    static readAsDataURL(file: File, onLoaded: Function) {
        this.readByFileReader(file, onLoaded, (reader: FileReader, file: File) => {
            reader.readAsDataURL(file);
        });
    }

    private static readByFileReader(file: File, onLoaded: Function, action: (reader: FileReader, file: File) => void) {
        const reader = new FileReader();
        action(reader, file);
        reader.onload = () => {
            onLoaded && onLoaded(reader.result);
        };
        reader.onerror = () => {
            throw new Exception("Could not read file, error: " + reader.error);
        };
    }
}