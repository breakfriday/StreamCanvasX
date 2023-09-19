
export class createRateLimitedReadableStream {
    stream: ReadableStream;
    controller: ReadableStreamDefaultController<any>;
    CHUNK_SIZE: number;
    residualBuffer: Uint8Array; // 用于存储溢出的数据
    constructor() {
        let $this = this;
        this.CHUNK_SIZE = 1024;
        this.stream = new ReadableStream({
            start(controller) {
                $this.controller = controller;
            },
        });
        this.residualBuffer = new Uint8Array(0);
    }

    async enqueue(chunk: Uint8Array) {
        let { controller, CHUNK_SIZE, residualBuffer } = this;

        let dataToEnqueue = new Uint8Array([...residualBuffer, ...chunk]);

        while (dataToEnqueue.length > 0) {
            const currentChunk = dataToEnqueue.slice(0, CHUNK_SIZE);
            controller.enqueue(currentChunk);
            dataToEnqueue = dataToEnqueue.slice(CHUNK_SIZE);


            if (dataToEnqueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 5));
            }
        }
        residualBuffer = dataToEnqueue;
    }
}