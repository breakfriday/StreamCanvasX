import { fLVDemux } from './flvDemux';


export default class Demux {
    constructor() {
        const demuxLoader = fLVDemux;
        return new fLVDemux();
    }
}
