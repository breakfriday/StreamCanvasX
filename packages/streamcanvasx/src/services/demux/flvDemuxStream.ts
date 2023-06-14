
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import Emitter from '../../utils/emitter';
import { Idemux } from '../../types/services/index';
import BaseDemux from './baseDemux';
import PlayerService from '../player';
const MEDIA_TYPE = {
    audio: 1,
    video: 2,
};


const FLV_MEDIA_TYPE = {
    audio: 8,
    video: 9,
};


const FLV_HEADER_SIZE = 9;
const FLV_PACKET_HEADER_SIZE = 15;

  interface IPlayer {
    debug: any;
    _opt: any;
    decoderWorker: any;
    webcodecsDecoder: any;
    mseDecoder: any;
  }


@injectable()
class fLVDemux extends BaseDemux {
    private flvDemux: (data: ArrayBuffer) => void;
    private input: Generator<number>;
    private flvStream: TransformStream;

    constructor() {
        super();
        this.createFlvStream();
    }
    createFlvStream() {
        let buffer: Uint8Array = null; // Move
        const tmp = new ArrayBuffer(4);
        const tmp8 = new Uint8Array(tmp);
        const tmp32 = new Uint32Array(tmp);
        const $this = this;
        this.flvStream = new TransformStream({
            start(controller) {
                // Initial setup, if needed
              },
              transform(chunk: ArrayBuffer, controller) {
                // 将输入的ArrayBuffer转换成Uint8Array
                let data = new Uint8Array(chunk);
                // 如果存在未处理完的缓冲区数据（在上次的transform调用中），将其与新的数据拼接起来
                if (buffer) {
                    let combined = new Uint8Array(buffer.length + data.length);
                    combined.set(buffer);
                    combined.set(data, buffer.length);
                    data = combined;
                    buffer = null;
                }

                // 去除FLV文件头部，前9个字节是文件头部
                if (data.length >= FLV_HEADER_SIZE) {
                    const header = data.slice(0, FLV_HEADER_SIZE);
                    // 在此处处理头部数据...  （可以获取头部数据里的一些信息）
                    // 切掉已处理的头部数据，保留剩余数据以处理后续的FLV数据包
                    data = data.slice(FLV_HEADER_SIZE);
                }

                  // 循环处理剩余的FLV数据包，每个数据包至少包含15个字节的包头部 ,Process packets
                    while (data.length >= FLV_PACKET_HEADER_SIZE) {
                        // 获取当前数据包的头部信息
                        const packetHeader = data.slice(0, FLV_PACKET_HEADER_SIZE);
                        // 在此处处理包头数据...

                        // 利用包头数据中的信息计算数据包的长度
                        tmp8[3] = 0;
                        // 获取数据包的类型， 第五个字节
                        const type = packetHeader[4];
                        tmp8[0] = packetHeader[7];
                        tmp8[1] = packetHeader[6];
                        tmp8[2] = packetHeader[5];
                        const length = tmp32[0];

                        // 如果剩余的数据长度小于数据包的长度，则退出循环，将剩余数据存入缓冲区，等待下次的transform调用
                        if (data.length < length + FLV_PACKET_HEADER_SIZE) {
                            break;
                        }

                        // 提取出数据包的payload
                        const payload = data.slice(FLV_PACKET_HEADER_SIZE, length + FLV_PACKET_HEADER_SIZE);

                        // 根据数据包的类型，对payload进行处理
                        switch (type) {
                            case FLV_MEDIA_TYPE.audio:
                                // 处理音频数据
                                $this.processAudioPayload({ payload, type: MEDIA_TYPE.audio, ts });
                                break;
                            case FLV_MEDIA_TYPE.video:
                                // 处理视频数据
                                $this.processVideoPayload({ payload, type: MEDIA_TYPE.audio, ts });
                                break;
                        }

                        // 切掉已处理的数据包，保留剩余数据以处理后续的FLV数据包
                        data = data.slice(length + FLV_PACKET_HEADER_SIZE);
                    }
              },
              flush(controller) {
                // final processing, if needed
            },
        });
    }

    processAudioPayload(data: {payload: Uint8Array; type: number; ts: number}) {
        this._doDecode(data);
    }

    processVideoPayload(data: {payload: Uint8Array; type: number; ts: number}) {
        this._doDecode(data);
    }

    dispatch(data: ArrayBuffer) {
        const writer = this.flvStream.writable.getWriter();
        writer.write(data);
        writer.releaseLock();
    }
}


export default fLVDemux;