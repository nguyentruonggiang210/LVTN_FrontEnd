import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as SimplePeer from 'simple-peer';
import { Instance } from 'simple-peer';
import { PeerData } from 'src/app/models/webrtc/PeerData';
import { UserInfo } from 'src/app/models/webrtc/UserInfo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RtcService {
  afDb: any;
  pc: any;
  setupWebRtc() {
    let senderId = this.guid();
    var channelName = '/webrtc';
    let channel = this.afDb.list(channelName);

    try {
      let pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.services.mozilla.com" },
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });
      return pc;
    }
    catch (error) {
      let pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.services.mozilla.com" },
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });

      return pc;
    }
  }

  guid() {
    return (this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4());
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}