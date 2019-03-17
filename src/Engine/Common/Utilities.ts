export class Utilities {
    private static browsersPrefix = ["ms", "moz", "webkit"];

    static requestFullScreen(mode = false, element: HTMLElement = document.documentElement) {
        const methods = Utilities.browsersPrefix.map(v => v + (mode ? "RequestFullscreen" : "ExitFullscreen"));
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
        const methods = Utilities.browsersPrefix.map(v => v + "IsFullScreen");
        return methods.some(v => document[v]);
    }
}