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
    private _sourceBufferQueue: Array<Uint8Array>;


    constructor() {

    }

    get state() {
      return this.mediaSource && this.mediaSource.readyState;
  }


    get isStateOpen() {
        return this.state === MEDIA_SOURCE_STATE.open;
    }
   async init() {
        this._sourceBufferQueue = [];
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
          this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
          this.sourceBuffer.mode = 'sequence';


          debugger;

          // this.mediaSource.sourceBuffers[0].

          this._mediaSourceOpenNotify();
          this.$videoElement.play();
        });
    }

    createAudioEl() {
      this.$videoElement = document.getElementById('aad');
    }
    async appendBuffer(buffer: Uint8Array) {
      let { inputMimeType } = this;

      if (this.sourceBuffer === null) {
        this.sourceBuffer = this.mediaSource.addSourceBuffer(inputMimeType);
        debugger;
       }

       debugger;
      if (this.mediaSource.sourceBuffers.length) {
        this._sourceBufferQueue.push(buffer);
      }
      try {
        while (this._sourceBufferQueue.length) {
          let $this = this;

          let data = this._sourceBufferQueue.shift();


          // if (!window.pp) {
          //   pp = data;
          // }
          // if (window.pp) {
          //   data = pp;
          // }


          debugger;
          this.sourceBuffer.appendBuffer(data);

          console.info('-----');

          console.info(data);
          console.log('-----------');
          debugger;


          await this.waitForSourceBuffer();
          debugger;
        }
      } catch (e) {
        let error = e;
        debugger;
      }
    }

   async waitForSourceBuffer() {
    return new Promise((resolve) => {
      const sourceBuffer = this.mediaSource.sourceBuffers[0];
     // eslint-disable-next-line no-negated-condition
      if (!sourceBuffer.updating) {
        debugger;
        resolve({});
      } else {
        sourceBuffer.addEventListener('updateend', () => {
          debugger;
          resolve({});
        }, {
          once: true,
        });
      }
    });
    }
    async addFrames(codecFrames: IAACfames['frames']) {
       // codecFrames = codecFrames.splice(100, 200);
       
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

   async attachMediaSource() {
       this.$videoElement.loop = false;
        let mediaUrl = URL.createObjectURL(this.mediaSource);
        this.$videoElement.src = mediaUrl;
        await this._mediaSourceOpen;
    }

   async start() {
      if (!this.mediaSource) {
        this.init();
      }

      this.createMediaSource();

      await this._mediaSourceCreated;

      await this.attachMediaSource();
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