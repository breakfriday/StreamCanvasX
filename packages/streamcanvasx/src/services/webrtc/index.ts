import _ from 'lodash';
import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';

import { TYPES } from '../../serviceFactories/symbol';

import { WHIPClient } from './whip.js';
import { WHEPClient } from './whep.js';

import { IRTCPlayerConfig } from '../../types/services';
import VideoService from '../video/videoService';

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
    constructor(
      @inject(TYPES.IVideoService) videoService: VideoService,
    ) {
      this.videoService = videoService;
    }
    createVideo() {
      this.meidiaEl = document.createElement('video');
    }
    async init(config: IRTCPlayerConfig) {
      this.config = config;
      let { contentEl } = this.config;

      this.videoService.init(this);
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
        let video: HTMLVideoElement = this.meidiaEl;
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

    runwhip(value: {url?: string; token?: string}) {
        let { url = '', token = '' } = value;
        let stream = this.mediaStream;

        // Create peerconnection
        const pc = new RTCPeerConnection();

        // Send all tracks
        for (const track of stream.getTracks()) {
            // You could add simulcast too here
            pc.addTrack(track);
        }

        // Create whip client
        const whip = new WHIPClient();

        // const url = 'https://whip.test/whip/endpoint';
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndoaXAgdGVzdCIsImlhdCI6MTUxNjIzOTAyMn0.jpM01xu_vnSXioxQ3I7Z45bRh5eWRBEY2WJPZ6FerR8';

        // Start publishing
        whip.publish(pc, url, token);
    }
    runwhep() {

    }
}


export default RTCPlayer;