export class Utilities {
    static requestFullScreen(mode = false, element?: HTMLElement) {
        let methods = ["ms", "moz", "webkit"].map(v => v + (mode ? "RequestFullscreen" : "ExitFullscreen"));
        methods.forEach(v => {
            if (mode) {
                element[v] && element[v]();
            }
            else {
                document[v] && document[v]();
            }
        });
    }

    static isFullScreen() {
        let methods = ["ms", "moz", "webkit"].map(v => v + "IsFullScreen");

        let result = false;
        methods.forEach(v => {
            if (document[v]) {
                result = true;
            }
        })
        return result;
    }
}