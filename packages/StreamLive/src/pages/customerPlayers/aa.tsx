
import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, InputNumber } from 'antd';
// import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
import { createPlayerServiceInstance,createPlayerServicePromise } from 'streamcanvasx/src/index';
import { PlayCircleFilled } from '@ant-design/icons';
// import records from '../canvasToVideo/mp4';
import RecodDialog from './recordDialog';
import PlayerService from 'streamcanvasx/src/services/player';

interface IVideoComponent {
  url: string;
  key: string | number;
  hasVideo: boolean;
  hasAudio?: boolean;
  showAudio?: boolean;
  useOffScreen?: boolean;
  audioDrawType?: number ; // You might want to replace 'string' with the actual type here
  renderPerSecond?: number;
  updataBufferPerSecond?: number;
  fftsize?: number;
  bufferSize?: number;
  degree?: number;
  isLive?: boolean;
  streamType?: string;
  fileData?: File;
  enable_crypto?: boolean;
  key_v?: string;
}

const VideoComponents: React.FC<IVideoComponent> = (props) => {
  const streamPlayer = useRef<PlayerService>(null);
  const [info, setInfo] = useState<any>();

  const [info1, setInfo1] = useState<any>();


  const [showDownButton, setShowDownButton] = useState<boolean>(true);

  const [audioInfo, setAudioInfo] = useState<any>();

  const [degree, setDegree] = useState<any>();

  const [recordTextContent, setRecordTextContent] = useState('');
  const [recordDialogState, setRecordDialogState] = useState(false);

  const [recordOption, setRecordOptions] = useState();


  useEffect(() => {
    // setTimeout(() => {
    //   records();
    // }, 200);


    let { url, showAudio = false, hasAudio = false, hasVideo = true, useOffScreen = false, audioDrawType = 1, fftsize, updataBufferPerSecond, renderPerSecond, bufferSize, degree, streamType, isLive, fileData, key_v = '', enable_crypto = '2' } = props;

    let data_img = 'data:image/jpeg;base64,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';

    let config = {
      url,
      contentEl: containerRef.current!,
      showAudio,
      hasAudio,
      hasVideo,
      errorUrl: data_img,
      useOffScreen,
      audioDraw: audioDrawType,
      fftsize,
      updataBufferPerSecond,
      renderPerSecond,
      bufferSize,
      degree,
      streamType,
      isLive,
      fileData,
      crypto: enable_crypto === '1' ? {
        key: key_v,
        enable: true,
        wasmModulePath: '',
        useWasm: true,
      } : null,
      hasControl: true
    };

    let player: any;

     async function asyncCreatePlayer() {
      let player = await createPlayerServicePromise(config,["http://localhost:8080/esm/vendor.bundle.esm.js","http://localhost:8080/esm/main.bundle.esm.js"]);

      streamPlayer.current = player;

      // player.createFlvPlayer({});

      player.createPlayer({});

      player.on('otherInfo', (data) => {
        let { speed } = data;
        setInfo({ speed });
      });

      // player.on('mediaInfo', (data) => {
      //   debugger;
      // });

      player.on('errorInfo', (data) => {
        console.log('--------------------');
        console.info(data);
        console.log('--------------------');
      });

      player.on('performaceInfo', (data) => {
        setInfo1(data);
      });

      // player.on('mediaInfo', (data) => {
      //    let data1 = data;
      //    alert(JSON.stringify(data1));
      //    debugger;
      // });


      player.on('audioInfo', (data) => {
        setAudioInfo(data);
      });

      player.on('recordTextContent', (text) => {
        setRecordTextContent(text);
      });
     }


     function cratePlayer() {
              player = createPlayerServiceInstance(config);

              streamPlayer.current = player;

              // player.createFlvPlayer({});

              player.createPlayer({});

              player.on('otherInfo', (data) => {
                let { speed } = data;
                setInfo({ speed });
              });

              // player.on('mediaInfo', (data) => {
              //   debugger;
              // });

              player.on('errorInfo', (data) => {
                console.log('--------------------');
                console.info(data);
                console.log('--------------------');
              });

              player.on('performaceInfo', (data) => {
                setInfo1(data);
              });

              // player.on('mediaInfo', (data) => {
              //    let data1 = data;
              //    alert(JSON.stringify(data1));
              //    debugger;
              // });


              player.on('audioInfo', (data) => {
                setAudioInfo(data);
              });

              player.on('recordTextContent', (text) => {
                setRecordTextContent(text);
              });
     }

    //  cratePlayer();
     asyncCreatePlayer();

    return () => {
      player.destroy();
    };

    // let canvas_el = player.canvasVideoService.getCanvas2dEl();

    // containerRef.current!.append(canvas_el);


    // loadMediaEvent();
  }, []);


  const containerRef = useRef(null);


  return (
    <div >
      <div style={{ width: '800px', height: '500px', border: '1px' }} ref={containerRef} />
      <div>{JSON.stringify(info)} </div>
      <div>{JSON.stringify(info1)}</div>
      <div>{JSON.stringify(audioInfo)}</div>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.setError();
      }}
      >setError</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
        let data = play.getStatus();
      }}
      >getstatus</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
        play.forceReload();
      }}
      >force reload</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
        play.destroy();
      }}
      >destroy</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
        play.canvasVideoService.setCover(true);
      }}
      >cover</Button>

      <Button onClick={() => {
        let play = streamPlayer.current;
        play.canvasVideoService.setCover(false);
      }}
      >no cover</Button>

      <Button onClick={() => {
        let play = streamPlayer.current;
       play.audioProcessingService.mute(true);
      }}
      >mute-true</Button>
      <Button onClick={() => {
        let play = streamPlayer.current;
       play.audioProcessingService.mute(false);
      }}
      >mute-false</Button>
      <div>
        <RecodDialog
          open={recordDialogState}
          options={recordOption}
          handleClose={() => {
            setRecordDialogState(false);
        }}
          handleOk={(data = {}) => {
            let player = streamPlayer.current;
            player.canvasToVideoSerivce.startRecord(data);
            setRecordDialogState(false);
        }}
        />

        <Button onClick={() => {
          let player = streamPlayer.current;
          let { options } = player.canvasToVideoSerivce;

          setRecordOptions(options);


          setRecordDialogState(true);
        }}
        >
          start Recording
        </Button>

        <Button
          id="end-recording"
          onClick={() => {
            let player = streamPlayer.current;
            player.canvasToVideoSerivce.endRecording();
		  }}
        >stop Recording</Button>
        <p id="recording-status" >{recordTextContent}</p>
      </div>
      <br />
      <Space>
        <Input
          min={-180}
          max={180}
          value={degree}
          onChange={e => {
          setDegree(e.target.value);
          // console.log(degree);
        }}
        />
        <Button onClick={() => {
          let play = streamPlayer.current;
          // console.log(degree);
          play.canvasVideoService.drawTrasform(degree);
          // play.canvasVideoService.drawRotate(degree);
        }}
        >transform</Button>

        <Button onClick={() => {
          let play = streamPlayer.current!;
          // console.log(degree);
          let { imageUrl,width,height }= play.canvasVideoService.captureShot();

         debugger;
          // play.canvasVideoService.drawRotate(degree);
        }}
        >captureShot</Button>

        <Button onClick={() => {
          let play = streamPlayer.current;
          // console.log(degree);
          // play.canvasVideoService.drawTrasform(degree);
          play.canvasVideoService.transformReset();
        }}
        >transformReset</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawRotate(degree);
        }}
        >rotate</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.rotateReset();
        }}
        >rotateReset</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawVerticalMirror();
        }}
        >VerticalMirror</Button>
        <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawHorizontalMirror();
        }}
        >HorizontalMirror</Button>
      </Space>
      <br />
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawWatermark({ fillStyle: 0 });
        }}
      >drawWatermark1</Button>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawWatermark({ fillStyle: 1 });
        }}
      >drawWatermark2</Button>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.drawWatermark({ value: '' });
        }}
      >clearWatermark</Button>
      <br />
      <p>invisible watermark</p>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.isDrawingWatermark = true;
        }}
      >drawWatermark</Button>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.isDrawingWatermark = false;
        }}
      >stopDraw</Button>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.isGettingWatermark = true;
        }}
      >getWatermark</Button>
      <Button onClick={() => {
          let play = streamPlayer.current;
          play.canvasVideoService.isGettingWatermark = false;
        }}
      >stopGet</Button>
      <br />
      {
        showDownButton ? (
          <Button onClick={() => {
            let player = streamPlayer.current;

             player.httpFlvStreamService.downLoad();
             setShowDownButton(false);
        }}
          >download</Button>
        ) : (
          <Button onClick={() => {
            let player = streamPlayer.current;
           player.httpFlvStreamService.abortDownLoad();
           setShowDownButton(true);
        }}
          >abort download</Button>
        )
      }

    </div>);
};

export default VideoComponents;