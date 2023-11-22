import { injectable, inject, Container, LazyServiceIdentifer } from 'inversify';
import _ from 'lodash';

@injectable()
class RTCStreamAdaptor {
  private peer: RTCPeerConnection;
  private resource: string;
  private eTag: string | undefined = undefined;
  private extensions: string[];
  private resourceResolve: (resource: string) => void;

  private mediaMids: Array<string> = [];

  private peerConnectionFactory: (configuration: RTCConfiguration) => RTCPeerConnection;
  private iceGatheringTimeout: any;
  private waitingForCandidates: boolean = false;
  private role?: string;
    constructor() {

    }
    init() {
        this.peer = new RTCPeerConnection();
        if (this.role === 'sender') {


        } else if (this.role === 'receiver') {
            this.peer.addTransceiver('audio');
            this.peer.addTransceiver('video');
        }
    }

    connectPeer() {

    }

    async publish(url: string) {
        let pc = this.peer;

		const offer = await pc.createOffer();
        const headers = {
			'Content-Type': 'application/sdp',
		};

        const fetched = await fetch(url, {
			method: 'POST',
			body: offer.sdp,
			headers,
		});


        pc.onconnectionstatechange = (event) => {
			switch (pc.connectionState) {
				case 'connected':
					// The connection has become fully connected
					break;
				case 'disconnected':
				case 'failed':
					// One or more transports has terminated unexpectedly or in an error
					break;
				case 'closed':
					// The connection has been closed
					break;
			}
		};

        /// / Get the SDP answer
        const answer = await fetched.text();

        await pc.setLocalDescription(offer);

        await pc.setRemoteDescription({ type: 'answer', sdp: answer });
    }

    close() {
        this.peer.close();
        this.peer = null;
    }
}

export default RTCStreamAdaptor;