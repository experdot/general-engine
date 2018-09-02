export class Utilities {
    static requestFullScreen(mode = false, element?: HTMLElement) {
        let methods = ["ms", "moz", "webkit"].map(v => v + (mode ? "RequestFullscreen" : "ExitFullscreen"));
        methods.forEach(v => {
            if (mode) {
                if ((element as any)[v]) {
                    (element as any)[v]();
                }
            }
            else {
                if ((document as any)[v]) {
                    (document as any)[v]();
                }
            }
        });
    }
}