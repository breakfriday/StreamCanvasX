import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
 import LiveVideo from './aa';


 function loadScript(url, callback) {
  let script: HTMLScriptElement = document.createElement('script');
  script.type = 'text/javascript';

  // 跨浏览器兼容性处理
  if (script.readyState) { // IE
      script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              callback();
          }
      };
  } else { // 其他浏览器
      script.onload = function () {
          callback();
      };
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}


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
            let { url } = value;


            let temp = Object.assign([], data);
            temp.push({ url });


            setData(temp);
          }}
        >
          <Form.Item
            initialValue={'http://localhost:8080/live/livestream.flv'}
            label="url"
            name="url"
          >
            <Input />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              fetch
            </Button>


          </Form.Item>
        </Form>

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