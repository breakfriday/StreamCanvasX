
class RTCStreamAdaptor {
  public peer: RTCPeerConnection;
  private resource: string;
  private eTag: string | undefined = undefined;
  private extensions: string[];
  private resourceResolve: (resource: string) => void;

  private mediaMids: Array<string> = [];

  private iceGatheringTimeout: any;
  private waitingForCandidates: boolean = false;
  private role?: string;
    constructor(parm: { role: string }) {
        let { role } = parm;
        this.role = role;
        this.init();
    }


    init() {
        this.peer = new RTCPeerConnection();
        if (this.role === 'sender') {


        } else if (this.role === 'receiver') {
            this.peer.addTransceiver('audio');
            this.peer.addTransceiver('video');
        }

        this.event();
    }


    event() {
        let pc = this.peer;
        pc.onconnectionstatechange = (event) => {
			switch (pc.connectionState) {
				case 'connected':
					// The connection has become fully connected
					break;
				case 'disconnected':
                    this.peer.close();
				case 'failed':
                     this.peer.close();
					// One or more transports has terminated unexpectedly or in an error
					break;
				case 'closed':
                    this.peer.close();
					// The connection has been closed
					break;
			}
		};
    }

    addTrack(stream: MediaStream) {
        for (const track of stream.getTracks()) {
            // You could add simulcast too here
            this.peer.addTrack(track);
        }
    }

    replaceTrack(stream: MediaStream) {
         // getSenders方法返回一个RTCRtpSender[]，其中包含了RTCPeerConnection目前正在发送的所有轨道的发送器对象
        const senders = this.peer.getSenders();


        stream.getTracks().forEach(track => {
          const sender = senders.find(s => s.track?.kind === track.kind);
          if (sender) {
            // 重新设置轨道
            sender.replaceTrack(track);
          } else {
            // 如果找不到对应的sender，可能是新的轨道类型，需要添加
            this.peer.addTrack(track, stream);
          }
        });
    }
    pauseAllTracks(): void {
        const senders = this.peer.getSenders();
        senders.forEach(sender => {
          // 将当前轨道替换为null，暂时停止发送
          sender.replaceTrack(null);
        });
      }

    async connect(parm: {url: string}) {
        let pc = this.peer;

        let { url = '' } = parm;
		const offer = await pc.createOffer();
        const headers = {
			'Content-Type': 'application/sdp',
		};

        const fetched = await fetch(url, {
			method: 'POST',
			body: offer.sdp,
			headers,
		});


        /// / Get the SDP answer
        const answer = await fetched.text();

        await pc.setLocalDescription(offer);


        await pc.setRemoteDescription({ type: 'answer', sdp: answer });
    }

    async publish(parm: {url: string}) {
        this.connect(parm);
    }

    async runWhep(parm: {url: string}) {
      this.connect(parm);
    }

    close() {
        this.peer.close();
        this.peer = null;
    }
}

export default RTCStreamAdaptor;