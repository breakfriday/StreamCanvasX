interface IAvcTrack {
    codec: string;
    width: number;
    height: number;
    profileIdc: number | null;
    profileCompatibility: number | null;
    levelIdc: number | null;
    pps: IUnit[];
    sps: IUnit[];
    frames: AvcFrame[];
}
interface IUnit {
}
interface IPes {
    data: IUnit[];
    pts: number;
    dts: number;
}
declare class AvcFrame {
    pts: number;
    dts: number;
    units: IUnit[];
    frame: boolean;
    key: boolean;
    duration: number;
    constructor(pts: number, dts: number);
}
declare class TsDemuxer {
    prevAvcFrame: AvcFrame | null;
    constructor();
    demux(data: Uint8Array): {
        video: IAvcTrack;
    };
    static parsePES(data: Uint8Array): IPes | undefined;
    createAvcFrames(track: IAvcTrack, units: IUnit[], pts: number, dts: number): void;
    static getSyncOffset(data: Uint8Array): number;
}
