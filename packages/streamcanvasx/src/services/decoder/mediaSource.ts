import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';


class MseDecoder {
    mediaSource: MediaSource;
    sourceBuffer: SourceBuffer;
    mediaStream: MediaStream;
    inputMimeType: string;

    constructor() {

    }
    init() {
        this.inputMimeType = 'audio/aac';
        this.mediaSource = new MediaSource();

        // const sourceBuffer = this.mediaSoruce.addSourceBuffer('audio/aac');
        this.sourceBuffer = null;
    }
    appendBuffer(buffer: BufferSource) {
        let { inputMimeType } = this;
        if (this.sourceBuffer === null) {
            this.sourceBuffer = this.mediaSource.addSourceBuffer(inputMimeType);
        }

        try {
            this.sourceBuffer.appendBuffer(buffer);
        } catch (e) {

            }
    }

    abortSourceBuffer() {

    }


    removeSourceBuffer() {

    }
}


export default MseDecoder;