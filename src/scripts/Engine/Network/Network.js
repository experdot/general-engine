class Network {
    static get(requestURL, onload) {
        return Network.request("GET", requestURL, onload);
    }

    static request(requestMethod, requestURL, onload) {
        let request = new XMLHttpRequest();
        request.open(requestMethod, requestURL);
        request.send();
        request.onload = () => {
            onload && onload(request.response);
        };
    }
}

export {
    Network
};