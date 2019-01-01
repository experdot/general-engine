export class CultureInfo {
    static get LanguageSessionKey() {
        return "General_SessionStorage_Language";
    }

    static get Netural() {
        return new CultureInfo(sessionStorage.getItem(CultureInfo.LanguageSessionKey) || navigator.language || "en-US");
    }

    static get en_US() {
        return new CultureInfo("en-US");
    }

    static get zh_CN() {
        return new CultureInfo("zh-CN");
    }

    static switch(language: string) {
        sessionStorage.setItem(CultureInfo.LanguageSessionKey, language);
    }

    get displayName(): string {
        return Languages[this.language];
    }

    language: string;

    constructor(language: string) {
        this.language = language;
    }

}

export const Languages = {
    "en-US": "English(United States)",
    "zh-CN": "简体中文"
};

