import { App } from "@legacy/Engine/Application/AppObject/App";
import { MessageBox } from "@legacy/Engine/Application/MessageBox";
import { byId } from "../../../dom";

const enum ContainerIds {
    Alert = "gallery-alert-container"
}

export class AttachAlert extends App {
    load() {
        MessageBox.onNotify = (message: string, title?: string, timeout?: number) => {
            const container = byId<HTMLDivElement>(ContainerIds.Alert);
            const alert = document.createElement("div");
            alert.className = "alert-card";
            alert.role = "alert";

            const strong = document.createElement("strong");
            strong.textContent = title ? `${title} ` : "";

            const text = document.createElement("span");
            text.textContent = message;

            const close = document.createElement("button");
            close.type = "button";
            close.className = "alert-close";
            close.ariaLabel = "Close";
            close.textContent = "x";
            close.addEventListener("click", () => alert.remove());

            alert.append(strong, text, close);
            container.appendChild(alert);
            setTimeout(() => {
                alert.remove();
            }, timeout || 6000);
        };
    }
}
