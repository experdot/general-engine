
import { ResourceManager } from "./ResourceManager";
import { CultureInfo } from "../Globalization/CultureInfo";
import { ResourceSet } from "./ResourceSet";

export class CultureResourceManager extends ResourceManager {
    config: CultureResourceConfig;
    target: any;

    constructor(config: CultureResourceConfig) {
        super();
        this.config = config;
    }

    load(loaded?: Function) {
        return super.load(() => {
            this.target && this.assign(this.target);
            loaded && loaded();
        });
    }

    attach(target: any, culture: CultureInfo = CultureInfo.Netural) {
        this.add(new ResourceSet(this.config.get(culture.language)));
        this.target = target;
        return this;
    }

    switch(culture: CultureInfo = CultureInfo.Netural, loaded?: Function) {
        this.sets = [];
        this.attach(this.target, culture).load(loaded);
        return this;
    }

    assign(target: any) {
        this.sets.forEach(element => {
            for (let key in target) {
                let value = element.data[key]
                if (value !== undefined) {
                    target[key] = element.data[key];
                }
            }
        });
        return this;
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