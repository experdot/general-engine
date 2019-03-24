import { App } from "../../../Engine/Application/AppObject/App";
import { MessageBox } from "../../../Engine/Application/MessageBox";

const enum ContainerIds {
    Alert = "gallery-alert-container"
}

export class AttachAlert extends App {
    load() {
        MessageBox.onNotify = (message: string, title?: string, timeout?: number) => {
            const $alert = $(`                
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>${title}</strong> ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `);
            $(`#${ContainerIds.Alert}`).append($alert);
            setTimeout(() => {
                ($alert as any).alert("close");
            }, timeout || 6000);
        };
    }
}

