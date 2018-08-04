export class MessageBox {
    static onNotify: (message: string) => void;

    static show(message = ""): void {
        MessageBox.onNotify(message);
    }
}

MessageBox.onNotify = (message) => {
    window.alert(message);
};
