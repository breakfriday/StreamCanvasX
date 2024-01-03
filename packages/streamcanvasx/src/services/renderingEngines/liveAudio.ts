// class LiveAudio {
//     private audioContext: AudioContext;
//     private scriptProcessor: ScriptProcessorNode;
//     private audioQueue: Float32Array[];
//     private handleFn: (data: Float32Array) => void; // 处理函数

//     constructor(bufferSize: number = 4096, handleFn: (data: Float32Array) => void) {
//         this.audioContext = new AudioContext();
//         this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
//         this.audioQueue = [];
//         this.handleFn = handleFn; // 设置处理函数

//         this.scriptProcessor.onaudioprocess = (event: AudioProcessingEvent) => {
//             const outputData = event.outputBuffer.getChannelData(0);

//             if (this.audioQueue.length > 0) {
//                 // 如果队列中有数据，取出并处理
//                 const inputData = this.audioQueue.shift();
//                 outputData.set(inputData);
//             } else {
//                 // 如果没有数据，填充零
//                 outputData.fill(0);
//             }

//             // 使用传入的处理函数
//             this.handleFn(outputData);
//         };

//         this.scriptProcessor.connect(this.audioContext.destination);
//     }

//     // 从外部源接收并存储PCM数据
//     receiveData(pcmData: Float32Array) {
//         this.audioQueue.push(pcmData);
//     }
// }

// export default LiveAudio;


class LiveAudioProcessor {
    private audioContext: AudioContext;
    private scriptProcessor: ScriptProcessorNode;
    private audioQueue: Float32Array[][];
    private numChannels: number;

    constructor(bufferSize: number = 4096, numChannels: number = 32, handleFn: (data: Float32Array[]) => void) {
        this.audioContext = new AudioContext();
        this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, numChannels, numChannels);
        this.audioQueue = [];
        this.numChannels = numChannels;

        this.scriptProcessor.onaudioprocess = (event: AudioProcessingEvent) => {
            let inputData: Float32Array[];
            if (this.audioQueue.length > 0) {
                inputData = this.audioQueue.shift();
            } else {
                inputData = Array.from({ length: this.numChannels }, () => new Float32Array(bufferSize).fill(0));
            }

            for (let channel = 0; channel < this.numChannels; channel++) {
                const outputData = event.outputBuffer.getChannelData(channel);
                outputData.set(inputData[channel]);
            }

            handleFn(inputData);
        };

        this.scriptProcessor.connect(this.audioContext.destination);
    }

    // 从外部源接收并存储PCM数据
    receiveData(pcmData: Float32Array[]) {
        if (pcmData.length !== this.numChannels) {
            throw new Error('Received data does not match the number of channels');
        }
        this.audioQueue.push(pcmData);
    }

    destroy() {
        // 断开 scriptProcessor 与其连接的任何节点
        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect();
            // 对于某些浏览器，还需要断开 onaudioprocess 事件以确保垃圾回收
            this.scriptProcessor.onaudioprocess = null;
        }

        // 关闭 AudioContext，如果它还在运行的话
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }

        // 清空音频队列
        this.audioQueue = [];

        // 如果有其他需要清理的资源，也在这里处理
    }
}

export default LiveAudioProcessor;
