
import SignalClient from './signalClient';
import StreamSocketClient from './streamSocketClient';
import { IplayerConfig } from '../../../../types/services';
import Instance from './instance';
import { MessageType } from '../../const';

function generateUniqueId() {
    const now = Date.now();

    const maxInt = 900;

    // 生成一个0到最大安全整数之间的随机整数
    const randomInt = Math.floor(Math.random() * maxInt);


    // const random = Math.floor(Math.random()* in);

    const uniqueId = randomInt;

    return uniqueId;
}

class SocketClient {
    signalClient: SignalClient;
    streamSocketClient: StreamSocketClient;
    clientId: number;
    url: string
    singleton: Instance
    constructor(singleton: Instance) {
        this.singleton=singleton;
        this.signalClient=new SignalClient(this.singleton);
        this.streamSocketClient=new StreamSocketClient(this.singleton);
    }
    init(config: IplayerConfig) {
        this.clientId=generateUniqueId();
        this.url=config.url;


        this.signalClient.init(this.clientId);
        this.streamSocketClient.init(this.clientId);
    }
    async open() {
        // try{
        //     await this.signalClient.connect();
        //     console.log("signalClient 连接成功");
        //     await this.createPlayer();
        // }catch(e) {

        // }

        // try{
        //     await this.streamSocketClient.connect();
        //     console.log("dataClient 连接成功");
        // }catch(e) {
        //     return false;
        // }

        debugger;
        try {
            await Promise.all([this.signalClient.connect(),this.streamSocketClient.connect()]);
            console.log("signalClient 连接成功");
            console.log("dataClient 连接成功");
            await this.createPlayer();
        }catch(e) {
            console.error("ws client 连接失败");
        }
    }

    async createPlayer() {
        debugger;
        let { url } = this;
        try{
          let res1= await this.signalClient.callMethd("createPlayer",[url,5,0,1,0]);
          let res2= await this.signalClient.callMethd("play",[]);

          console.log("播放器创建成功");
          if(res1.code===200&&res2.code===200) {
            let info=await this.signalClient.getStreamInfo();
          }else{
            console.error("播放器创建失败-播放失败");
            self.postMessage({ type: MessageType.ADD_RELOAD_TASK });

            // this.reload();
          }
        }catch(e) {

        }
    }
    async reload() {
        this.signalClient.destroy();
        this.streamSocketClient.destroy();
        this.clientId=generateUniqueId();
        this.streamSocketClient.clientId=this.clientId;
        this.signalClient.clientId=this.clientId;
        await this.open();

        // debugger;

        // if(!this.signalClient.ws) {
        //    await this.signalClient.connect();
        // }
        // if(!this.streamSocketClient.ws) {
        //    await this.streamSocketClient.connect();
        // }
        try{
            // await this.signalClient.callMethd("stop",[]);

            // await this.createPlayer();
        }catch(e) {

        }
    }
    async play() {
        try{
            await this.signalClient.callMethd("play",[]);
        }catch(e) {

        }
    }

    async abort() {
        try{
            await this.signalClient.callMethd("stop",[]);
        }catch(e) {

        }
    }

   async destroy() {
    console.log("socket client destroy");

    try{
        this.streamSocketClient.stopHeartChceck();
        // await this.signalClient.callMethd("stop",[]);
         console.log("destroy call method stop");
    }catch(e) {

     }

        this.signalClient.destroy();
        this.streamSocketClient.destroy();
    }
}

export default SocketClient;