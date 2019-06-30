
import { ResourceManager } from "./ResourceManager";
import { CultureInfo } from "../Globalization/CultureInfo";
import { ResourceSet } from "./ResourceSet";

export class CultureResourceManager extends ResourceManager {
    config: CultureResourceConfig;
    target: any;

    constructor(config?: CultureResourceConfig) {
        super();
        this.config = config;
    }

    init(config: CultureResourceConfig) {
        this.config = config;
        return this;
    }

    async load() {
        await super.load().then(() => {
            this.target && this.assign(this.target);
        });
    }

    attach(target: any, culture: CultureInfo = CultureInfo.Netural) {
        if (this.config) {
            this.add(new ResourceSet(this.config.get(culture.language)));
            this.target = target;
        }
        return this;
    }
}

export class CultureResourceConfig {
    template: string;
    languages: any[];
    replace: string;

    constructor(template?: string, languages?: string[], replacer = "{{language}}") {
        this.template = template;
        this.languages = languages;
        this.replace = replacer;
    }

    get(language: string) {
        if (this.languages.findIndex(v => v === language) < 0) {
            language = this.languages[0];
        }
        return this.template.replace(this.replace, language);
    }
}