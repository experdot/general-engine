import {
    Exception
} from "../Common/Exception";

class FileIO {
    static openFileDialog(onLoaded, accept = "") {
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", accept);
        input.onchange = (event) => {
            onLoaded && onLoaded(event);
        };
        input.click();
    }

    static readAllText(file, onLoaded) {
        this._readByFileReader(file, onLoaded, (reader, file) => {
            reader.readAsText(file);
        });
    }

    static readAsDataURL(file, onLoaded) {
        this._readByFileReader(file, onLoaded, (reader, file) => {
            reader.readAsDataURL(file);
        });
    }

    static _readByFileReader(file, onLoaded, action) {
        let reader = new FileReader();
        action(reader, file);
        reader.onLoaded = () => {
            onLoaded && onLoaded(reader.result);
        };
        reader.onerror = () => {
            throw new Exception("Could not read file, error code:" + reader.error.code);
        };
    }
}

export {
    FileIO
};