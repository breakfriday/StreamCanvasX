async function decodeVideo2(buffer) {
    let videoDecoder = new VideoDecoder({
        output: function(frame) {
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            context.drawImage(frame, 0, 0);
            frame.close();
        },
        error: function(e) {
            console.error(e);
        }
    });
    await videoDecoder.configure({
        codec: 'vp8'
    }); // configure with appropriate codec
    videoDecoder.decode(new EncodedVideoChunk({
        type: 'key',
        timestamp: 0,
        data: buffer
    }));
}
class DecodeVide {
    async startDeconding() {}
    constructor(){}
}

 //# sourceMappingURL=webcodecsPlayer.js.map