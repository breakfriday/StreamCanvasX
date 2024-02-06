export default PCMPlayer;
declare class PCMPlayer {
    constructor(option: any);
    init(option: any): void;
    option: any;
    samples: any;
    flush(): void;
    interval: number;
    maxValue: any;
    typedArray: any;
    getMaxValue(): any;
    getTypedArray(): any;
    createContext(): void;
    audioCtx: any;
    gainNode: any;
    startTime: any;
    isTypedArray(data: any): boolean;
    feed(data: any): void;
    getFormatedValue(data: any): Float32Array;
    volume(volume: any): void;
    destroy(): void;
}
