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


const FlvDemux = () => {
 const containerRef = useRef(null);
 const playerRef = useRef(null);

 const [data, setData] = useState<any>([]);
    return (
      <>

        <Form
          name="basic"
          autoComplete="off"
          onFinish={(value) => {
            let { url, key, enable_crypto,
            } = value;


            let temp = Object.assign([], data);
            temp.push({ url, key, enable_crypto });


            setData(temp);
          }}
        >
          <Form.Item
            initialValue={'http://localhost:3000/out.aac'}
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


          <Form.Item label="enable crypto" name="enable_crypto" initialValue={'2'}>
            <Radio.Group>
              <Radio value="1"> true </Radio>
              <Radio value="2"> false</Radio>
            </Radio.Group>
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
          return data.map((item) => {
            return (
              <div>

                <LiveVideo url={item.url} />


              </div>

            );
            });
          })()
        }


      </>


    );
};

export default FlvDemux;