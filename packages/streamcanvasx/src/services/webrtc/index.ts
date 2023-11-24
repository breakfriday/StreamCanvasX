import _ from 'lodash';
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import { TYPES } from '../../serviceFactories/symbol';


import { WHEPClient } from './whep.js';

import { IRTCPlayerConfig } from '../../types/services';
import VideoService from '../video/videoService';
import WebRTCStreamAdaptor from './webRTCStreamAdaptor';


@injectable()
class RTCPlayer {
    private mediaStream: MediaStream;
    private deviceList: {
        videoInputs: MediaDeviceInfo[];
        audioInputs: MediaDeviceInfo[];
        audioOutputs?: MediaDeviceInfo[];
    };

    audioSource?: string;
    videoSource?: string;

    meidiaEl: HTMLVideoElement;
    config?: IRTCPlayerConfig;
    contentEl?: HTMLDivElement;
    videoService?: VideoService;
    webRTCStreamAdaptor: WebRTCStreamAdaptor;
    constructor(
      @inject(TYPES.IVideoService) videoService: VideoService,
    ) {
      this.videoService = videoService;
      this.webRTCStreamAdaptor = null;
    }
    createVideo() {
      this.meidiaEl = document.createElement('video');
    }
    async init(config: IRTCPlayerConfig) {
      this.config = config;
      let { contentEl } = this.config;

      this.videoService.init(this);
    }

    async getMedia(parm?: {audioSource?: string; videoSource?: string}) {
        this.stopStream();

        let { audioSource = '', videoSource = '' } = parm || {};

        const constraints = {
          audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
          video: { deviceId: videoSource ? { exact: videoSource } : undefined },
  };


        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);


        this.localPlay();
    }

    async getdisplaymedia() {
      this.stopStream();
      const options = { audio: true, video: true };
      try {
        this.mediaStream = await navigator.mediaDevices.getDisplayMedia(options);


        this.localPlay();
      } catch (err) {
        console.error(err);
      }
    }

    async getDeviceLIst() {
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
      let devices = await navigator.mediaDevices.enumerateDevices();


      let { videoInputs, audioInputs } = getVideoList(devices);

      return { videoInputs, audioInputs };
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
        let video: HTMLVideoElement = this.videoService.meidiaEl;
        video.autoplay = true;
        video.srcObject = this.mediaStream;
    }

    check_permission() {
        navigator.permissions.query({ name: 'camera' }).then(permissionStatus => {
            if (permissionStatus.state === 'granted') {
              console.log('Camera access granted.');
            } else if (permissionStatus.state === 'denied') {
              alert('Camera access denied.');
            } else {
              alert('Camera permission not determined.');
            }
          });
    }

    pushWhip(value: {url?: string; token?: string}) {
      let { url = '' } = value;
      let stream = this.mediaStream;
      if (this.webRTCStreamAdaptor === null) {
        this.webRTCStreamAdaptor = new WebRTCStreamAdaptor({ role: 'sender' });
      }
      this.webRTCStreamAdaptor.addTrack(stream);
      this.webRTCStreamAdaptor.publish({ url });
    }

    runWhep(value: {url?: string; token?: string}) {
      let { url = '' } = value;
      let video: HTMLVideoElement = this.videoService.meidiaEl;

      if (this.webRTCStreamAdaptor === null) {
        this.webRTCStreamAdaptor = new WebRTCStreamAdaptor({ role: 'receiver' });
      }
      this.webRTCStreamAdaptor.runWhep({ url });

      this.webRTCStreamAdaptor.peer.ontrack = (event) => {
        if (event.track.kind == 'video') {
           video.srcObject = event.streams[0];
         }
      };
    }

    // runwhep(value: {url?: string; token?: string }) {
    //   let { url = '', token = '' } = value;
    //   // let video = this.meidiaEl;
    //   let video: HTMLVideoElement = this.videoService.meidiaEl;
    //   const pc = new RTCPeerConnection();

    //   // Add recv only transceivers
    //   pc.addTransceiver('audio');
    //   pc.addTransceiver('video');


    //   pc.ontrack = (event) => {
    //       if (event.track.kind == 'video') {
    //           video.srcObject = event.streams[0];
    //       }
    //   };

    //   const whep = new WHEPClient();
    //   whep.view(pc, url, token);
    // }

    stop() {
       this.stopStream();
       this.webRTCStreamAdaptor.close();
    }
    stopStream() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }

    destroy() {

    }
}


export default RTCPlayer;