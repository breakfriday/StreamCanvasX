import React, { useRef, useEffect, useState } from 'react';
import { Divider, Space, Button, Checkbox, Form, Input, Radio, Switch, Slider, Col, Row, Modal, Tabs } from 'antd';
import UseRTCPlayer from './hooks/UseRTCPlayer';


interface Iprops{
 whepUrl?: string;
 whipUrl?: string;
}
//
const RtcPlayer: React.FC<Iprops> = (props) => {
    const [playerRef, createPlayer] = UseRTCPlayer();
    let containerRef = useRef(null);
    let { whepUrl, whipUrl } = props;

    useEffect(() => {
        createPlayer(containerRef);
    }, []);

    useEffect(() => {
      if (whepUrl) {
        playerRef.current?.runwhep({ url: whepUrl });
      } else {
        playerRef.current?.destroy();
      }
    }, [whepUrl]);

    useEffect(() => {
      if (whipUrl) {
        playerRef.current?.runwhip({ url: whipUrl });
      } else {
        playerRef.current?.destroy();
      }
    }, [whipUrl]);


    return (
      <div ref={containerRef} />
      );
};

export default RtcPlayer;