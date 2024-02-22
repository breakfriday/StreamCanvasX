export default TransmuxingEvents;
declare namespace TransmuxingEvents {
    let IO_ERROR: string;
    let DEMUX_ERROR: string;
    let INIT_SEGMENT: string;
    let MEDIA_SEGMENT: string;
    let LOADING_COMPLETE: string;
    let RECOVERED_EARLY_EOF: string;
    let MEDIA_INFO: string;
    let METADATA_ARRIVED: string;
    let SCRIPTDATA_ARRIVED: string;
    let TIMED_ID3_METADATA_ARRIVED: string;
    let SMPTE2038_METADATA_ARRIVED: string;
    let SCTE35_METADATA_ARRIVED: string;
    let PES_PRIVATE_DATA_DESCRIPTOR: string;
    let PES_PRIVATE_DATA_ARRIVED: string;
    let STATISTICS_INFO: string;
    let RECOMMEND_SEEKPOINT: string;
    let AUDIO_SEGMENT: string;
}
