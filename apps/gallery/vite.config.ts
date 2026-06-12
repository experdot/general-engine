import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import alias from "@rollup/plugin-alias";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: "./",
    publicDir: "public",
    resolve: {
        alias: {
            "@gallery": resolve(__dirname, "src"),
            "@gallery-core": resolve(__dirname, "src/Gallery"),
            "@legacy": resolve(__dirname, "../../packages/general-engine/src")
        }
    },
    plugins: [
        {
            ...alias({
                entries: [
                    {
                        find: "@legacy",
                        replacement: resolve(__dirname, "../../packages/general-engine/src")
                    }
                ]
            }),
            enforce: "pre"
        }
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                "views/gallery": resolve(__dirname, "views/gallery.html")
            }
        }
    }
});
