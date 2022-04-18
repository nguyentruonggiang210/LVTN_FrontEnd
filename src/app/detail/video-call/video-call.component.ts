import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { CommonService } from 'src/app/services/common/common.service';
import { environment } from 'src/environments/environment';

const mediaConstrait = {
  audio: true,
  video: {
    width: 720,
    height: 540
  }
}

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})

export class VideoCallComponent implements AfterViewInit {

  // asp signalr
  private hubConnection: signalR.HubConnection;
  // web rtc
  private peerConnection: RTCPeerConnection;

  private localStream: MediaStream;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private commonService: CommonService) {
    this.startConnect();
  }

  ngAfterViewInit(): void {
    this.requestMediaDevice();
  }

  stopSharing() {
    this.localStream.getTracks()
      .forEach(track => track.enabled = false);

    this.localVideo.nativeElement.srcObject = null;
  }

  startSharing() {
    this.localStream.getTracks()
      .forEach(track => track.enabled = true);

    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  sendMessage(msg: Message) {
    this.hubConnection.invoke('message', msg);
  }

  async call(): Promise<void> {
    this.createPeerConnection();

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    try {
      const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer(offerOptions);
      await this.peerConnection.setLocalDescription(offer);
      this.sendMessage({ type: 'offer', data: offer })
    }
    catch (err) {
      this.handlerGetUserMediaErr(err);
    }
  }

  test() {
    this.sendMessage({ type: '', data: '' });
  }

  private createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.cablenet-as.net:3478']
        }
      ]
    });

    this.peerConnection.onicecandidate = this.handlerIceCandidateEvent;

    this.peerConnection.onicegatheringstatechange = this.handlerIceGatheringStateChange;

    this.peerConnection.onsignalingstatechange = this.handlerSignalingStateChange;

    this.peerConnection.ontrack = this.handlerTrackEvent;
  }

  private handlerGetUserMediaErr(err: Error) {
    switch (err.name) {
      case 'NotFoundErr':
        this.commonService.displaySnackBar('Unable to open call because no camera', 'Close');
        break;
      case 'SecurityErr':
      case 'PermissionDeniedErr':
        break;
      default:
        this.commonService.displaySnackBar('Error while opening camera', 'Close');
        break;
    }

    this.closeVideoCall();
  }

  private startConnect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalConnection + 'videocall', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start()
      .then(res => {
        console.log(res);
      });

    this.hubConnection.on('receiveMessage', (msg) => {
      switch (msg.type) {
        case 'offer':
          this.handlerOfferMessage(msg.data);
          break;
        case 'answer':
          this.handlerAnswerMessage(msg.data);
          break;
        case 'hangup':
          this.handlerHangupMessage(msg);
          break;
        case 'ice-candidate':
          this.handlerIceCandidateMessage(msg.data);
          break;
        default:
          this.commonService.displaySnackBar('Unknown message type ' + msg.type, 'Close');
          break;
      }
    });
  }

  hangUp() {
    this.sendMessage({ type: 'hangup', data: '' });
    this.closeVideoCall();
  }

  private async requestMediaDevice(): Promise<void> {
    this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstrait);
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  private closeVideoCall() {
    if (this.peerConnection) {
      this.peerConnection.ontrack = null;
      this.peerConnection.onsignalingstatechange = null;
      this.peerConnection.onicegatheringstatechange = null;
      this.peerConnection.onicecandidate = null;
    }

    this.peerConnection.getTransceivers()
      .forEach(trans => {
        trans.stop();
      });

    this.peerConnection.close();
    this.peerConnection = null;
  }

  private handlerIceCandidateEvent = (e: RTCPeerConnectionIceEvent) => {
    console.log(e);
    if (e.candidate) {
      this.sendMessage({ type: 'ice-candidate', data: e.candidate });
    }
  }

  private handlerIceGatheringStateChange = (e: Event) => {
    console.log(e);
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handlerSignalingStateChange = (e: Event) => {
    console.log(e);
    switch (this.peerConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handlerTrackEvent = (e: RTCTrackEvent) => {
    console.log(e);
    this.remoteVideo.nativeElement.srcObject = e.streams[0];
  }

  // receivable event handler asp net core
  private handlerOfferMessage(msg: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    if (!this.localStream) {
      this.startSharing();
    }

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg))
      .then(() => {
        this.localVideo.nativeElement.srcObject = this.localStream;

        this.localStream.getTracks()
          .forEach(track => this.peerConnection.addTrack(track, this.localStream));
      })
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        return this.peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        this.sendMessage({ type: 'answer', data: this.peerConnection.localDescription })
      })
      .catch(this.handlerGetUserMediaErr);
  }

  private handlerAnswerMessage(msg: RTCSessionDescriptionInit) {
    this.peerConnection.setRemoteDescription(msg);
  }

  private handlerHangupMessage(msg: Message) {
    this.closeVideoCall();
  }

  private handlerIceCandidateMessage(msg) {
    this.peerConnection.addIceCandidate(msg);
  }
}

export interface Message {
  type: string,
  data: any
}