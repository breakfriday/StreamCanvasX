import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';
import { WHIPClient } from './whis.js';
import { WHEPClient } from './whep.js';

interface Iplayer{
    url: string;

}
const Player: React.FC<Iplayer> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef(null);

    const [options, setOptions] = useState<{url: string; token: string}>({ url: '', token: '' });

    const [buttonStatus, setButtonStatus] = useState({ whip: false, whep: false });

    const runWhep = async (value) => {
        // Create peerconnection
     let { url, token } = value;
    const pc = window.pc = new RTCPeerConnection();

    // Add recv only transceivers
    pc.addTransceiver('audio');
    pc.addTransceiver('video');


    pc.ontrack = (event) => {
        console.log(event);
        if (event.track.kind == 'video') {
            videoRef.current.srcObject = event.streams[0];
        }
    };

    const whep = new WHEPClient();
    whep.view(pc, url, token);
    playerRef.current = { whep: whep };
};

    return (
      <>
        <div>
          <video ref={videoRef} height={300} width="100%" controls />
          <Input
            defaultValue=""
            addonBefore="url"
            onChange={(e) => {
                let { value = '' } = e.target;
                let options_temp = Object.assign({}, options, { url: value });

                setOptions(options_temp);
          }}
          />
          <Input
            defaultValue=""
            addonBefore="token"
            onChange={(e) => {
                let { value = '' } = e.target;
                let options_temp = Object.assign({}, options, { token: value });

                setOptions(options_temp);
            }}
          />
          <Button
            disabled={buttonStatus.whip}
            onClick={() => {
          const runWhip = async (value) => {
              // Get mic+cam
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

          let video = videoRef.current!;
          video.autoplay = true;
          video.srcObject = stream;


          let { url = '', token = '' } = value;

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

          debugger;

          let temp = Object.assign({}, buttonStatus, { whep: true });

          debugger;

          setButtonStatus(temp);
         };


         runWhip(options);

            //  openWebcam();
          }}
          >
            push whip
          </Button>
          <Button
            disabled={buttonStatus.whep}
            onClick={() => {
            let options_temp = options;

            runWhep(options_temp);
          }}
          >
            fetch whep
          </Button>
          <Button onClick={() => {
            let { whep } = playerRef.current;
            whep.close();
          }}
          >
            CLOSE
          </Button>
          <Button onClick={() => {
            let { whep } = playerRef.current;
            whep.restart();
          }}
          >
            RESTART
          </Button>
        </div>
      </>);
};


export default Player;