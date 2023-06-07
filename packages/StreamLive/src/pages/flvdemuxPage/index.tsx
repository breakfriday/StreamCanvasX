import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select, Image, Space } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';


const fetch_flv = new httpFlvStreamLoader();
const FlvDemux: React.FC = () => {
    const [imgUrlState, setImgUrlState] = useState('//localhost:3000/nichijo0.gif');


    useEffect(() => {

    }, []);
  return (
    <>
      <div onClick={() => {


      }}
      >load http_flv</div>

    </>


  );
};

export default FlvDemux;


