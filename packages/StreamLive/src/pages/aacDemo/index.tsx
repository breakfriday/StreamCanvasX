import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
 import LiveVideo from './aa';


//  function loadScript(url: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//       // 创建一个新的 script 元素
//       const script = document.createElement('script');
//       script.src = url;

//       // 当脚本加载并执行成功时，解析 Promise
//       script.onload = () => {
//           resolve();
//       };

//       // 当加载脚本发生错误时，拒绝 Promise
//       script.onerror = (error) => {
//           reject(new Error(`Script load error: ${error}`));
//       };

//       // 把 script 元素添加到文档中，开始加载脚本
//       document.head.append(script);
//   });
// }


// loadScript('/jessibuca.js');


//  loadScript('http://localhost:3000/decoder.js', () => {


//    });

function generateRandomId(length) { // length是你的id的长度，可自定义
  return Math.random().toString(36).substr(3, length);
}


const FlvDemux = () => {
 const containerRef = useRef<{filesData: File}>(null);
 const playerRef = useRef(null);


 const [data, setData] = useState<any>([]);
    return (
      <>

        <Form
          name="basic"
          autoComplete="off"
          onFinish={(value) => {
            let { url, key, enable_crypto, showAudio, streamType,
            } = value;

            let fileData = containerRef.current?.filesData;

            let temp = Object.assign([], data);


            temp.push({ url, key, enable_crypto, fileData, showAudio, streamType });


            setData(temp);
          }}
        >
          <Form.Item
            initialValue={'http://localhost:3001/out.aac'}
            label="url"
            name="url"
          >
            <Input />
          </Form.Item>


          <Form.Item
            initialValue={'ideteck_chenxuejian_test'}
            label="key"
            name="key"
          >
            <Input />
          </Form.Item>

          <Form.Item label="streamType" name="streamType" initialValue={'ACC'}>
            <Radio.Group>
              <Radio value="ACC"> ACC</Radio>
              <Radio value="FLV"> FLV</Radio>
              <Radio value="MPEG-TS"> MPEG-TS</Radio>
              <Radio value="MP4"> MP4</Radio>
            </Radio.Group>
          </Form.Item>


          <Form.Item label="enable crypto" name="enable_crypto" initialValue={'2'}>
            <Radio.Group>
              <Radio value="1"> true </Radio>
              <Radio value="2"> false</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="showAudio" name="showAudio" initialValue>
            <Radio.Group>
              <Radio value> true </Radio>
              <Radio value={false}> false</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="file" name="file">
            <input
              type="file"
              id="file-input"
              accept="*"
              onChange={(event) => {
                 // const files_data: File = event.target?.files?.[0]; // 返回file对象

                  const filesData: File = event.target!.files![0];
                  containerRef.current = {
                    filesData: filesData,
                  };
        }}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              fetch3
            </Button>


          </Form.Item>
        </Form>

        <div>{navigator.appVersion}</div>
        {JSON.stringify(data)}

        {
          (() => {
          return data.map((item, inx) => {
            return (
              <div key={inx}>

                <LiveVideo
                  url={item.url}
                  key_v={item.key}
                  enable_crypto={item.enable_crypto}
                  fileData={item.fileData}
                  showAudio={item.showAudio}
                  streamType={item.streamType}
                />


              </div>

            );
            });
          })()
        }


      </>


    );
};

export default FlvDemux;