import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Form, Input, Radio } from 'antd';
// import { HttpFlvStreamLoader } from 'streamcanvasx/es2017/services/stream/fetch_stream_loader';

 import { createPlayerServiceInstance } from 'streamcanvasx/src/serviceFactories/index';
 import OfflineVideo from './aa';


const MpegPlay = () => {
 const containerRef = useRef<{filesData: File}>(null);
 const playerRef = useRef(null);


 const [data, setData] = useState<any>([]);
    return (
      <>

        <OfflineVideo
          url={"https://117.71.59.159:44007/minio/aqim/2024-09-23/09c36645-56a1-4708-a086-0f22013b4409.ts"}
        />


      </>


    );
};

export default MpegPlay;