export class SimpleAutoPaintAI {
    convertImageData(imageData: ImageData) {
        const width = imageData.width;
        const height = imageData.height;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; x++) {
                const r = imageData.data[0];
                const g = imageData.data[0];
                const b = imageData.data[0];


            }
        }
    }
}


export class ImageDataHelper {
    static getImageData(image: HTMLImageElement, width: number = 0, height: number = 0) {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.width = width || image.width;
        canvas.height = height || image.height;

        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        return imageData;
    }

    static getThresholdImageData(imageData: ImageData, thresholding = 128) {
        const width = imageData.width;
        const height = imageData.height;
        const result = new ImageData(width, height);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const index = (y * width + x) * 4;
                const r = imageData.data[index + 0];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const average = (r + g + b) / 3;

                if (average > thresholding) {
                    result.data[index + 0] = 255;
                    result.data[index + 1] = 255;
                    result.data[index + 2] = 255;
                    result.data[index + 3] = 255;

                }
                else {
                    result.data[index + 0] = 0;
                    result.data[index + 1] = 0;
                    result.data[index + 2] = 0;
                    result.data[index + 3] = 255;
                }
            }
        }
        return result;
    }
}