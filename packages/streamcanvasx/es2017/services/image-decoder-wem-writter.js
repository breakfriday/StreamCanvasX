// @ts-ignore
import WebMWriter from 'webm-writer';
const fetchImageByteStream = async (gifURL)=>{
    const response = await fetch(gifURL);
    return response.body;
};
const createImageDecoder = async (imageByteStream)=>{
    const imageDecoder = new ImageDecoder({
        data: imageByteStream,
        type: 'image/gif'
    });
    await imageDecoder.tracks.ready;
    await imageDecoder.completed;
    return imageDecoder;
};
const decodeGifToWebM = async (imageDecoder)=>{
    const { frameCount  } = imageDecoder.tracks.selectedTrack;
    const { image: headFrame  } = await imageDecoder.decode({
        frameIndex: 0
    });
    const frameDuration = headFrame.duration / 1000;
    console.log({
        headFrame,
        frameCount,
        frameDuration
    });
    const canvas = document.createElement('canvas');
    canvas.width = headFrame.codedWidth;
    canvas.height = headFrame.codedHeight;
    const canvasContext = canvas.getContext('2d');
    const videoWriter = new WebMWriter({
        quality: 1,
        fileWriter: null,
        fd: null,
        // You must supply one of:
        frameDuration,
        frameRate: 1000 / frameDuration,
        transparent: true,
        alphaQuality: 1
    });
    const writeVideoFrame = async (frameIndex = 0)=>{
        if (frameIndex >= frameCount) return;
        const result = await imageDecoder.decode({
            frameIndex
        });
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(result.image, 0, 0);
        videoWriter.addFrame(canvas);
        await writeVideoFrame(frameIndex + 1);
    };
    await writeVideoFrame();
    const webMBlob = await videoWriter.complete();
    return URL.createObjectURL(webMBlob);
};
export function setupImageDecodeWriteWebm(options) {
    const startTranscode = async ()=>{
        options.time.innerText = '开始转码...';
        const startTime = new Date();
        const image = options.inputGif;
        const imageByteStream = await fetchImageByteStream(image.src);
        const imageDecoder = await createImageDecoder(imageByteStream);
        const webmBlobURL = await decodeGifToWebM(imageDecoder);
        options.video.src = webmBlobURL;
        const endTime = new Date();
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;
        options.time.innerText = `转码完成，用时 ${duration}s`;
    };
    options.button.addEventListener('click', startTranscode, false);
}
