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

    static getSearchKeyValuePair() {
        const result: { [name: string]: string } = {};
        const search = location.search;
        if (search.indexOf("?") >= 0) {
            const str = search.substr(1);
            const pairs = str.split("&");
            for (let i = 0; i < pairs.length; i++) {
                result[pairs[i].split("=")[0]] = unescape(pairs[i].split("=")[1]);
            }
        }
        return result;
    }
}