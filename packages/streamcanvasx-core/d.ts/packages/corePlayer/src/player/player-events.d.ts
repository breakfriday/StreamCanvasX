export default PlayerEvents;
declare namespace PlayerEvents {
    let ERROR: string;
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
    let DESTROYING: string;
}
