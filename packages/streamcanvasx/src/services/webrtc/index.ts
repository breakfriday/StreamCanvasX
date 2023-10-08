import _ from 'lodash';
class webRtcPlayer {
    private mediaStream: MediaStream;
    private deviceList: {
        videoInputs: MediaDeviceInfo[];
        audioInputs: MediaDeviceInfo[];
        audioOutputs?: MediaDeviceInfo[];
    };
    audioSource?: string;
    videoSource?: string;
    constructor() {

    }


    async init() {

    }

    async getMedia() {
        const getVideoList = (devices: MediaDeviceInfo[]) => {
            let data = devices;

            let videoInputs = _.filter(data, { kind: 'videoinput' });
            let audioInputs = _.filter(data, { kind: 'audioinput' });


            videoInputs = _.map(videoInputs, (item: MediaDeviceInfo & { value?: string }) => {
              item.value = item.deviceId;
              return item;
            });

            audioInputs = _.map(audioInputs, (item: MediaDeviceInfo & { value?: string }) => {
              item.value = item.deviceId;
              return item;
            });


            return { videoInputs, audioInputs };
          };
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        let devices = await navigator.mediaDevices.enumerateDevices();

        let { videoInputs, audioInputs } = getVideoList(devices);
        this.deviceList = { videoInputs, audioInputs };

        this.localPlay();
    }

    async changeMedia(parm: {audioSource?: string; videoSource?: string}) {
        let { audioSource, videoSource } = parm;
        this.audioSource = audioSource;
        this.videoSource = videoSource;


        const constraints = {
            audio: { deviceId: this.audioSource ? { exact: this.audioSource } : undefined },
            video: { deviceId: this.videoSource ? { exact: this.videoSource } : undefined },
    };
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    }


    localPlay() {
        let video: HTMLVideoElement = '';
        video.autoplay = true;
        video.srcObject = this.mediaStream;
    }

    runwhip() {

    }
    runwhep() {

    }
}


export default webRtcPlayer;