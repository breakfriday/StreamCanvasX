export default FLVDemuxer;
declare class FLVDemuxer {
    static probe(buffer: any): {
        match: boolean;
    } | {
        needMoreData: boolean;
    };
    constructor(probeData: any, config: any);
    TAG: string;
    _config: any;
    _onError: any;
    _onMediaInfo: any;
    _onMetaDataArrived: any;
    _onScriptDataArrived: any;
    _onTrackMetadata: any;
    _onDataAvailable: any;
    _dataOffset: any;
    _firstParse: boolean;
    _dispatch: boolean;
    _hasAudio: any;
    _hasVideo: any;
    _hasAudioFlagOverrided: boolean;
    _hasVideoFlagOverrided: boolean;
    _audioInitialMetadataDispatched: boolean;
    _videoInitialMetadataDispatched: boolean;
    _mediaInfo: MediaInfo;
    _metadata: {};
    _audioMetadata: {};
    _videoMetadata: {};
    _naluLengthSize: number;
    _timestampBase: number;
    _timescale: number;
    _duration: number;
    _durationOverrided: boolean;
    _referenceFrameRate: {
        fixed: boolean;
        fps: number;
        fps_num: number;
        fps_den: number;
    };
    _flvSoundRateTable: number[];
    _mpegSamplingRates: number[];
    _mpegAudioV10SampleRateTable: number[];
    _mpegAudioV20SampleRateTable: number[];
    _mpegAudioV25SampleRateTable: number[];
    _mpegAudioL1BitRateTable: number[];
    _mpegAudioL2BitRateTable: number[];
    _mpegAudioL3BitRateTable: number[];
    _videoTrack: {
        type: string;
        id: number;
        sequenceNumber: number;
        samples: any[];
        length: number;
    };
    _audioTrack: {
        type: string;
        id: number;
        sequenceNumber: number;
        samples: any[];
        length: number;
    };
    _littleEndian: boolean;
    destroy(): void;
    bindDataSource(loader: any): this;
    set onTrackMetadata(callback: any);
    get onTrackMetadata(): any;
    set onMediaInfo(callback: any);
    get onMediaInfo(): any;
    set onMetaDataArrived(callback: any);
    get onMetaDataArrived(): any;
    set onScriptDataArrived(callback: any);
    get onScriptDataArrived(): any;
    set onError(callback: any);
    get onError(): any;
    set onDataAvailable(callback: any);
    get onDataAvailable(): any;
    set timestampBase(base: number);
    get timestampBase(): number;
    set overridedDuration(duration: number);
    get overridedDuration(): number;
    set overridedHasAudio(hasAudio: any);
    set overridedHasVideo(hasVideo: any);
    resetMediaInfo(): void;
    _isInitialMetadataDispatched(): boolean;
    parseChunks(chunk: any, byteStart: any): number;
    _parseScriptData(arrayBuffer: any, dataOffset: any, dataSize: any): void;
    _parseKeyframesIndex(keyframes: any): {
        times: number[];
        filepositions: any[];
    };
    _parseAudioData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any): void;
    _parseAACAudioData(arrayBuffer: any, dataOffset: any, dataSize: any): {
        packetType: number;
        data: Uint8Array | {
            config: any[];
            samplingRate: number;
            channelCount: number;
            codec: string;
            originalCodec: string;
        };
    };
    _parseAACAudioSpecificConfig(arrayBuffer: any, dataOffset: any, dataSize: any): {
        config: any[];
        samplingRate: number;
        channelCount: number;
        codec: string;
        originalCodec: string;
    };
    _parseMP3AudioData(arrayBuffer: any, dataOffset: any, dataSize: any, requestHeader: any): Uint8Array | {
        bitRate: number;
        samplingRate: number;
        channelCount: number;
        codec: string;
        originalCodec: string;
    };
    _parseVideoData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any): void;
    _parseAVCVideoPacket(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any): void;
    _parseHEVCVideoPacket(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any): void;
    _parseEnhancedHEVCVideoPacket(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any, packetType: any): void;
    _parseEnhancedAV1VideoPacket(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any, packetType: any): void;
    _parseAVCDecoderConfigurationRecord(arrayBuffer: any, dataOffset: any, dataSize: any): void;
    _parseHEVCDecoderConfigurationRecord(arrayBuffer: any, dataOffset: any, dataSize: any): void;
    _parseAV1CodecConfigurationRecord(arrayBuffer: any, dataOffset: any, dataSize: any): void;
    _parseAVCVideoData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any, cts: any): void;
    _parseHEVCVideoData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any, cts: any): void;
    _parseAV1VideoData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any, cts: any): void;
}
import MediaInfo from '../core/media-info.js';
