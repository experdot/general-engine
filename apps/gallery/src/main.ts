import "./gallery.css";
import { GalleryApp } from "./Gallery/App/GalleryApp";

const panelToggle = document.getElementById("gallery-panel-toggle");
const panel = document.getElementById("gallery-panel");

if (panelToggle instanceof HTMLButtonElement && panel instanceof HTMLDivElement) {
    panelToggle.addEventListener("click", () => {
        const expanded = panelToggle.getAttribute("aria-expanded") === "true";
        panelToggle.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
    });
}

const app = new GalleryApp();
app.processes.load.process();
