class MessageBox {
    static show(message = "") {
        MessageBox.onchange && MessageBox.onchange(message);
    }
}

MessageBox.onchange = (message) => {
    window.alert(message);
};

export {
    MessageBox
};