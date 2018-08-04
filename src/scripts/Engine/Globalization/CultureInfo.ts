export class CultureInfo {
    static get Default() {
        return new CultureInfo(navigator.language || "en-US");
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

