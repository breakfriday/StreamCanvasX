
class AudioPlayer {
    private option: any;
    private samples: Float32Array;
    
    constructor() {

    }

    init() {
        let defaults = {
            encoding: '16bitInt',
            channels: 1,
            sampleRate: 8000,
            flushingTime: 1000,
        };
        this.option = Object.assign({}, defaults, option);
        this.samples = new Float32Array();
        this.flush = this.flush.bind(this);
        this.interval = setInterval(this.flush, this.option.flushingTime);
        this.maxValue = this.getMaxValue();
        this.typedArray = this.getTypedArray();
    }
}

export default AudioPlayer;