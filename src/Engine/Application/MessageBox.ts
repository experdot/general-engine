export class MessageBox {
    static onNotify(message: string, title?: string, timeout?: number) {
        window.alert(message);
    };

    static show(message = "", title?: string, timeout?: number): void {
        MessageBox.onNotify(message, title, timeout);
    }
}