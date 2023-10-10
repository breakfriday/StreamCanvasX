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
}

export default RTCStreamAdaptor;