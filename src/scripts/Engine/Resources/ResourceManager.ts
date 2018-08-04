import { HttpWebRequest } from "../Network/Network";
import { CultureInfo } from "../Globalization/CultureInfo";

export class ResourceManager {
    data: any;
    loaded: boolean;

    constructor() {
        this.data = {};
    }

    get(key: string) {
        return this.data[key];
    }

    load(src: string, target: any) {
        this.loaded = false;
        HttpWebRequest.get(src, (response: any) => {
            this.data = JSON.parse(response);
            target && this._attach(target);
            this.loaded = true;
        });
        return this;
    }

    wait(callback: Function, timeout = 10) {
        let waitHandler = () => {
            if (this.loaded) {
                callback && callback();
            } else {
                setTimeout(waitHandler, timeout, callback);
            }
        };
        waitHandler();
    }

    _attach(target: any) {
        for (let key in target) {
            target[key] = this.data[key];
        }
    }
}

export class CultureResourceManager extends ResourceManager {
    config: CultureResourceConfig;

    constructor(config: CultureResourceConfig) {
        super();
        this.config = config;
    }

    load(target: any, culture = CultureInfo.Default) {
        return super.load(this.config.get(culture.language), target);
    }
}

export class CultureResourceConfig {
    template: string;
    languages: any[];
    replace: string;

    constructor(template: string, languages: string[], replace = "{{language}}") {
        this.template = template;
        this.languages = languages;
        this.replace = replace;
    }

    get(language: string) {
        if (this.languages.findIndex(v => v === language) < 0) {
            language = this.languages[0];
        }
        return this.template.replace(this.replace, language);
    }
}