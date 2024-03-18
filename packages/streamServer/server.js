const fs = require('fs');
const WebSocket = require('ws');
const FILE_PATH = 'StreamLive/public/output3.yuv';
const FRAME_SIZE = 1920 * 1080 * 1.5; // 以YUV420为例，修改为实际的帧大小

const server = new WebSocket.Server({ port: 9991 });

server.on('connection', (ws) => {
    console.log('Client connected');

    const stream = fs.createReadStream(FILE_PATH, { highWaterMark: FRAME_SIZE });

    stream.on('readable', () => {
        let chunk;
        while (null !== (chunk = stream.read(FRAME_SIZE))) {
            ws.send(chunk, { binary: true });
        }
    });

    stream.on('end', () => {
        console.log('Finished reading file');
        ws.close();
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        stream.destroy();
    });
});

console.log('WebSocket server listening on ws://localhost:8080');
