export class MessageBox {
    static onNotify: Function;

    static show(message = "") {
        MessageBox.onNotify && MessageBox.onNotify(message);
    }
}

MessageBox.onNotify = (message) => {
    window.alert(message);
};
