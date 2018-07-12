class MessageBox {
    static show(message = "") {
        MessageBox.onNotify && MessageBox.onNotify(message);
    }
}

MessageBox.onNotify = (message) => {
    window.alert(message);
};

export {
    MessageBox
};