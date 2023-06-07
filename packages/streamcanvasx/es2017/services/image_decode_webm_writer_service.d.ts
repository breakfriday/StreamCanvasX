/// <reference types="dom-webcodecs" />
declare class ImageDecoderService {
    private imageDecoderProcess;
    constructor();
    createImageDecoder(imageByteStream: ImageBufferSource): Promise<ImageDecoder>;
    blobToArrayBuffer(file: Blob): Promise<ArrayBuffer>;
    fetchImageByteStream(gifURL: string): Promise<ReadableStream<Uint8Array>>;
    decodeGifToWebM(imageDecoder: ImageDecoder): Promise<string>;
    getImageDataByByUrl(options: {
        imgUrl: string;
    }): Promise<ReadableStream<Uint8Array>>;
    getImageDataByFile(file: Blob): Promise<ArrayBuffer>;
    decoderByData(data: ImageBufferSource): Promise<void>;
    getFrameResultByFrameIndex(options: ImageDecodeOptions, imageDecoderPorocss: ImageDecoder): Promise<ImageDecodeResult>;
    compose1(options: {
        imgUrl: string;
    }): Promise<string>;
    compose2(options: {
        imgUrl: string;
    }): Promise<void>;
    renderCanvas(options: {
        imgUrl: string;
    }): Promise<void>;
}
export { ImageDecoderService };
