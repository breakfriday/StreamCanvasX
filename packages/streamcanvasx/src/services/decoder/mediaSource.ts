import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import CodecParser from 'codec-parser';

const MEDIA_SOURCE_STATE = {
  ended: 'ended',
  open: 'open',
  closed: 'closed',
};

@injectable()
class MseDecoder {
    mediaSource: MediaSource;
    sourceBuffer: SourceBuffer;
    mediaStream: MediaStream;
    inputMimeType: string;
    $videoElement: HTMLAudioElement;
    streamParser: CodecParser;
    private _mediaSourceCreated: Promise<void>;
    private _mediaSourceCreatedNotify: () => void;
    private _mediaSourceOpenNotify: () => void; // 这是一个可选的函数类型
    private _mediaSourceOpen: Promise<void>;


    constructor() {

    }

    get state() {
      return this.mediaSource && this.mediaSource.readyState;
  }


    get isStateOpen() {
        return this.state === MEDIA_SOURCE_STATE.open;
    }
   async init() {
        this.inputMimeType = 'audio/aac';
        this.initStreamParser();
        this.createAudioEl();

        this._mediaSourceCreated = new Promise((resolve) => {
          this._mediaSourceCreatedNotify = resolve;
        });


        this._mediaSourceOpen = new Promise((resolve) => {
          this._mediaSourceOpenNotify = resolve;
        });


        // const sourceBuffer = this.mediaSoruce.addSourceBuffer('audio/aac');
        this.sourceBuffer = null;
    }

    initStreamParser() {
      const mimeType = 'audio/aac';

      const options = {
          onCodec: () => {},
          onCodecUpdate: () => {},
          enableLogging: true,
      };

      this.streamParser = new CodecParser(mimeType, options);
    }

    createMediaSource() {
        this.mediaSource = new MediaSource();
        this._mediaSourceCreatedNotify();

        this.mediaSource.addEventListener('sourceopen', () => {
          let mimeType = this.inputMimeType;
          this.mediaSource.addSourceBuffer(mimeType).mode = 'sequence';
          this._mediaSourceOpenNotify();
        });
    }

    createAudioEl() {
      this.$videoElement = document.createElement('audio');
      this.$videoElement.controls = true;
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

    async addFrames(codecFrames: IAACfames['frames']) {
        // 将一个 Uint8Array 数组中的所有缓冲区（buffers）连接成一个单一的 Uint8Array
        const concatBuffers = (buffers: Array<Uint8Array>) => {
            // 计算所有缓冲区的总长度
            const buffer = new Uint8Array(
              buffers.reduce((acc, buf) => acc + buf.length, 0),
            );

            // 填充新的 Uint8Array:
            buffers.reduce((offset, buf) => {
              buffer.set(buf, offset);
              return offset + buf.length;
            }, 0);

            return buffer;
          };

        let buffersArray: Array<Uint8Array> = codecFrames.map((value) => {
            return value.data;
        });


        let buffer: Uint8Array = concatBuffers(buffersArray);


        this._appendSourceBuffer(buffer);
    }

    async _appendSourceBuffer(buffer: Uint8Array) {
        this.appendBuffer(buffer);
    }

    attachMediaSource() {
        this.$videoElement.loop = false;
        let mediaUrl = URL.createObjectURL(this.mediaSource);
        this.$videoElement.src = mediaUrl;
        return mediaUrl;
    }

   async start() {
      if (!this.mediaSource) {
        this.init();
      }

      this.createMediaSource();

      await this._mediaSourceCreated;

       this.attachMediaSource();

       await this._mediaSourceOpen;
    }

    abortSourceBuffer() {
      if (this.isStateOpen) {
        if (this.sourceBuffer) {
            this.sourceBuffer.abort();
            this.sourceBuffer = null;
        }
      }
    }


    removeSourceBuffer() {

    }

    endOfStream() {
      const { $videoElement } = this;
      if (this.isStateOpen && $videoElement && $videoElement.readyState >= 1) {
          try {
              this.mediaSource.endOfStream();
          } catch (e) {
              console.warn('MediaSource', 'endOfStream() error', e);
          }
      }
    }


    async onstream(frames: IAACfames['frames']) {
      await this.addFrames(frames); // wait for the source buffer
    }

   removeBuffer(start: number, end: number) {
    this.sourceBuffer.remove(start, end);
   }
}


export default MseDecoder;