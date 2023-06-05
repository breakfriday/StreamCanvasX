import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select, Image } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { ImageDecoderService } from 'streamcanvasx/es2017/services/image_decode_webm_writer_service';


const ImageDecoder: React.FC = () => {
    const [imgUrlState, setImgUrlState] = useState('//localhost:3000/nichijo0.gif');
    const gifRef = useRef<HTMLImageElement>();
    const [videoUrl, setVideoUrl] = useState<string>('');

    const videoRef = useRef<HTMLVideoElement>();
    let Decoder_instance: ImageDecoderService;
    useEffect(() => {
        Decoder_instance = new ImageDecoderService();
    }, []);
  return (
    <>

      <Image
        ref={gifRef}
        width={500}
        src={imgUrlState}
      />

      <Select
        defaultValue="img1"
        style={{ width: 120 }}
        onChange={(val) => {
            setImgUrlState(val);
        }}
        options={[
        { value: '//localhost:3000/nichijo0.gif', label: 'img0' },
        { value: '//localhost:3000/nichijo1.gif', label: 'img1' },
        { value: '//localhost:3000/nichijo2.gif', label: 'img2' },
        { value: '//localhost:3000/nichijo3.gif', label: 'img3' },
        { value: '//localhost:3000/nichijo4.gif', label: 'img4' },
        { value: '//localhost:3000/nichijo5.gif', label: 'img5' },
        { value: '//localhost:3000/nichijo6.gif', label: 'img6' },
        { value: '//localhost:3000/nichijo7.gif', label: 'img7' },
        { value: '//localhost:3000/nichijo8.gif', label: 'img8' },

      ]}
      />

      <Button onClick={() => {
        let set_url = async () => {
            let blob_url = await Decoder_instance.transcode({ imgUrl: imgUrlState });


            videoRef.current!.src = blob_url;
             videoRef.current!.load();
        };

        set_url();
      }}
      >hello</Button>

      <video ref={videoRef} width={300} controls />


    </>


  );
};

export default ImageDecoder;


