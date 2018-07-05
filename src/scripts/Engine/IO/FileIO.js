import {
    Exception
} from "../Common/Exception";

class FileIO {
    static openFileDialog(changeCallback) {
        let inputFileElement = document.createElement("input");
        inputFileElement.setAttribute("type", "file");
        inputFileElement.onchange = (event) => {
            changeCallback && changeCallback(event);

        };
        inputFileElement.click();
    }

    static readAllText(file, loadedCallback) {
        this._readByFileReader(file, loadedCallback, (reader, file) => {
            reader.readAsText(file);
        });
    }

    static readAsDataURL(file, loadedCallback) {
        this._readByFileReader(file, loadedCallback, (reader, file) => {
            reader.readAsDataURL(file);
        });
    }

    static _readByFileReader(file, loadedCallback, action) {
        let reader = new FileReader();
        action(reader, file);
        reader.onload = () => {
            loadedCallback && loadedCallback(reader.result);
        };
        reader.onerror = () => {
            throw new Exception("Could not read file, error code:" + reader.error.code);
        };
    }
}

export {
    FileIO
};