class CultureInfo {
    static get Default() {
        return new CultureInfo(navigator.language || "en-US");
    }

    constructor(language) {
        this.language = language;
    }
}

const Languages = {
    "en-US": "English(United States)",
    "zh-CN": "简体中文"
};

export {
    CultureInfo,
    Languages
};