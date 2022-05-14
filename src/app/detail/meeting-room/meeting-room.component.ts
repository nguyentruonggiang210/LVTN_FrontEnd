import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignalrService } from 'src/app/services/signalr/signalr.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Conversation, UserAgent, Session, Stream } from '@apirtc/apirtc'
import { environment } from 'src/environments/environment';
import { VideoService } from 'src/app/services/room/video.service';
import { RoomValidateDto } from 'src/app/models/RoomValidateDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/common/auth.service';
import * as signalR from '@aspnet/signalr';
import { UserEnterRequest } from 'src/app/models/hubs/UserEnterRequest';
import { GroupChatDto } from 'src/app/models/hubs/GroupChatDto';
import { SendChatMessageDto } from 'src/app/models/hubs/SendChatMessageDto';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent implements OnInit {

  @ViewChild("localVideo") videoRef: ElementRef;
  @ViewChild("myTable") table: ElementRef;
  groupChatData: GroupChatDto[] = [];
  validateResponse: RoomValidateDto = {
    isValid: false,
    isHost: false,
    isStarted: false
  };
  roomId?: number;
  chatContent: string;
  conversationFormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required])
  });

  displayedColumns = [
    'content',
  ];
  private hubConnection: signalR.HubConnection;

  constructor(private fb: FormBuilder,
    private videoService: VideoService,
    private commonService: CommonService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(x => {
      if (x && x?.roomId) {
        this.conversationFormGroup.patchValue({
          name: x?.roomId
        })
      }
    });
  }

  chat() {
    if (this.chatContent == null || this.chatContent == '') {
      return;
    }

    let model: SendChatMessageDto = {
      chatContent: this.chatContent,
      userId: this.authService.getUserId(),
      roomId: this.roomId
    };
    this.hubConnection.invoke('Chat', JSON.stringify(model));

    this.chatContent = '';
  }

  get conversationNameFc(): FormControl {
    return this.conversationFormGroup.get('name') as FormControl;
  }

  conversation: any;
  remotesCounter = 0;

  getOrcreateConversation() {
    this.commonService.displaySpinner();
    // validate room number
    this.validateRoom().subscribe(async x => {
      if (!x.body.isValid) {
        this.commonService.displaySnackBar('Room code is invalid', 'Close');
        return;
      }
      this.validateResponse = x.body;
      this.getChatList();
      await this.signalRConnection();
      this.handleStreaming();
      this.commonService.distroySpinner();
      await this.onConnectHandler(this.authService.getUserId(), this.roomId);
      console.log(x.body);
    });
  }

  private handleStreaming() {
    var localStream = null;

    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var userAgent = new UserAgent({
      uri: 'apiKey:' + environment.rtcApiKey
    });

    //==============================
    // 2/ REGISTER
    //==============================
    userAgent.register().then((session: Session) => {

      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      const conversation: Conversation = session.getConversation(this.conversationNameFc.value);
      this.conversation = conversation;

      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      conversation.on('streamListChanged', (streamInfo: any) => {
        console.log("streamListChanged :", streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            conversation.subscribeToMedia(streamInfo.streamId)
              .then((stream: Stream) => {
                console.log('subscribeToMedia success', stream);
              }).catch((err) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
      //=====================================================
      conversation.on('streamAdded', (stream: Stream) => {
        this.videoService.setStream(this.roomId, stream.streamId.toString())
         .subscribe(x => console.log(x));
        this.remotesCounter += 1;
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
        let video = document.getElementById('remote-media-' + stream.streamId);
        video.setAttribute('width', '100%');
      }).on('streamRemoved', (stream: any) => {
        this.remotesCounter -= 1;
        stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
      });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      userAgent.createStream({
        constraints: {
          audio: true,
          video: true
        }
      })
        .then((stream: Stream) => {

          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;

          // Display stream
          localStream.attachToElement(this.videoRef.nativeElement);

          //==============================
          // 6/ JOIN CONVERSATION
          //==============================
          conversation.join()
            .then(() => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              conversation.publish(localStream).then((stream: Stream) => {
                console.log('published', stream);
              }).catch((err: any) => {
                console.error('publish error', err);
              });
            }).catch((err: any) => {
              console.error('Conversation join error', err);
            });
        }).catch((err: any) => {
          console.error('create stream error', err);
        });
    });
  }

  private validateRoom() {
    let token = this.commonService.getLocalStorage(environment.tokenName);
    let decodeToken = this.authService.getDecodedAccessToken(token)
    let userid = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    let room = this.conversationFormGroup.value['name'];
    this.roomId = room;
    return this.videoService.validateCourse(Number(room), userid);
  }

  private async signalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalConnection + 'videocall', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    await this.hubConnection.start()
      .then(res => {
        console.log(res);
      });

    this.hubConnection.on('UserConnectHandler', (name) => {
      this.commonService.displaySnackBar(`${name} joined`, 'Close');
    });

    this.hubConnection.on('userJoined', (name) => {
      this.commonService.displaySnackBar(`${name} joined`, 'Close');
    });

    this.hubConnection.on('userOut', (name) => {
      this.commonService.displaySnackBar(`${name} leaved`, 'Close');
    });

    this.hubConnection.on('receiveChat', (msg, name, time) => {
      debugger
      let model: GroupChatDto = {
        message: msg,
        name: name,
        createDate: time
      }

      this.groupChatData.push(model);

      this.groupChatData = [...this.groupChatData];
      // this.autoScroll();
    });
  }

  private async onConnectHandler(userId: string, roomId: number) {
    let model: UserEnterRequest = {
      userId: userId,
      roomId: roomId
    }
    await this.hubConnection.invoke('UserConnectHandler', JSON.stringify(model));
  }

  private autoScroll() {
    this.table.nativeElement.scrollBy(0, this.table.nativeElement.height);
  }

  private async getChatList() {
    this.videoService.getChatList(this.roomId).subscribe(x => {
      if (x) {
        this.groupChatData = x.body;
        // this.autoScroll();
      }
    });
  }
}