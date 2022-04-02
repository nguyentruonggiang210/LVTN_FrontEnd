import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SignalInfo } from 'src/app/models/webrtc/SignalInfo';
import { UserInfo } from 'src/app/models/webrtc/UserInfo';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

const VideoCallSignal = "videocall";

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  private hubConnection: signalR.HubConnection;

  private signal = new Subject<SignalInfo>();
  public signal$ = this.signal.asObservable();

  constructor() { }

  public async startConnect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalConnection + VideoCallSignal, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.start()
      .then(res => {
        console.log(res);
      });

    this.hubConnection.on('action', data => {
      this.signal.next(data);
    });
  }

  public sendMessage(type: number, content: string, userName: string) {
    this.hubConnection.invoke('Action', type, content, userName);
  }
}
