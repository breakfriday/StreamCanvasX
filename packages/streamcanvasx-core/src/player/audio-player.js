class PCMPlayer {
    constructor(option) {
        this.init(option);
    }

    init(option) {
        const defaults = {
            encoding: '16bitInt',
            channels: 1,
            sampleRate: 8000,
            flushingTime: 200
        };
        this.option = Object.assign({}, defaults, option);
        this.samples = new Float32Array();
        this.flush = this.flush.bind(this);
        this.interval = setInterval(this.flush, 100);
        this.maxValue = this.getMaxValue();
        this.typedArray = this.getTypedArray();
        this.createContext();
    }

    getMaxValue() {
        const encodings = {
            '8bitInt': 128,
            '16bitInt': 32768,
            '32bitInt': 2147483648,
            '32bitFloat': 1
        }

        return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt'];
    }

    getTypedArray() {
        const typedArrays = {
            '8bitInt': Int8Array,
            '16bitInt': Int16Array,
            '32bitInt': Int32Array,
            '32bitFloat': Float32Array
        }

        return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt'];
    }

    createContext() {
        //debugger
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.audioCtx.resume();
        this.audioCtx.onstatechange = () => console.log(this.audioCtx.state);
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = 1;
        this.gainNode.connect(this.audioCtx.destination);
        this.startTime = this.audioCtx.currentTime;
    }

    isTypedArray(data) {
        return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer);
    }

    feed(data) {
        if (!this.isTypedArray(data)) return;
        data = this.getFormatedValue(data);
        const tmp = new Float32Array(this.samples.length + data.length);
        tmp.set(this.samples, 0);
        tmp.set(data, this.samples.length);
        this.samples = tmp;
    }

    getFormatedValue(data) {
        const formattedData = new this.typedArray(data.buffer);
        const float32 = new Float32Array(formattedData.length);
        
        for (let i = 0; i < formattedData.length; i++) {
            float32[i] = formattedData[i] / this.maxValue;
        }
        return float32;
    }

    volume(volume) {
        this.gainNode.gain.value = volume;
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.samples = null;
        this.audioCtx.close();
        this.audioCtx = null;
    }

    flush() {
        if (!this.samples.length) return;
        const bufferSource = this.audioCtx.createBufferSource();
        const length = this.samples.length / this.option.channels;
        const audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate);
        let audioData;
        
        for (let channel = 0; channel < this.option.channels; channel++) {
            audioData = audioBuffer.getChannelData(channel);
            let offset = channel;
            let decrement = 50;
            for (let i = 0; i < length; i++) {
                audioData[i] = this.samples[offset];
                /* fadein */
                if (i < 50) {
                    audioData[i] =  (audioData[i] * i) / 50;
                }
                /* fadeout*/
                if (i >= (length - 51)) {
                    audioData[i] =  (audioData[i] * decrement--) / 50;
                }
                offset += this.option.channels;
            }
        }
        
        if (this.startTime < this.audioCtx.currentTime) {
            this.startTime = this.audioCtx.currentTime;
        }
        console.log('start vs current ' + this.startTime + ' vs ' + this.audioCtx.currentTime + ' duration: ' + audioBuffer.duration);
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.gainNode);
        bufferSource.start(this.startTime);
        this.startTime += audioBuffer.duration;
        this.samples = new Float32Array();
    }
}


export default PCMPlayer


/*

function generateSineWave(frequency, sampleRate, duration) {
    const sampleCount = sampleRate * duration; 
    const angularFrequency = 2 * Math.PI * frequency;
    let samples = new Int16Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
        samples[i] = 32767 * Math.sin(angularFrequency * i / sampleRate);
    }
    
    return samples;
} 

const sampleRate = 44100; 
const sineWave = generateSineWave(440, sampleRate, 2); // 440 Hz frequency, 2 seconds duration


player = new PCMPlayer({
    encoding: '16bitInt',
    channels: 1,
    sampleRate: sampleRate,
    flushingTime: 1000
});

*/