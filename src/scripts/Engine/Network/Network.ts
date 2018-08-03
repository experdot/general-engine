export class HttpWebRequest {
    static get(requestURL, onload) {
        return HttpWebRequest.request("GET", requestURL, onload);
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
