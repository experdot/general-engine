export class HttpWebRequest {
    static get(requestURL: string, onload: Function) {
        return HttpWebRequest.request("GET", requestURL, onload);
    }

    static request(requestMethod: string, requestURL: string, onload: Function) {
        const request = new XMLHttpRequest();
        request.open(requestMethod, requestURL);
        request.send();
        request.onload = () => {
            onload && onload(request.response);
        };
    }
}
