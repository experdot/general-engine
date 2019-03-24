export class MessageBox {
    static show(message = "", title?: string, timeout?: number): void {
        MessageBox.onNotify(message, title, timeout);
    }

    static onNotify(message: string, title?: string, timeout?: number) {
        window.alert(message);
    };

    show(message = "", title?: string, timeout?: number) {
        this.onNotify(message, title, timeout);
    }

    onNotify(message: string, title?: string, timeout?: number) {
        window.alert(message);
    };
}