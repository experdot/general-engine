export function byId<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing required element: ${id}`);
    }
    return element as T;
}

export function setText(id: string, value: string) {
    byId(id).textContent = value;
}

export function setTitle(id: string, value: string) {
    byId(id).setAttribute("title", value);
}
