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

@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent implements OnInit {

  @ViewChild("localVideo") videoRef: ElementRef;

  validateResponse: RoomValidateDto = {
    isValid: false,
    isHost: false,
    isStarted: false
  };

  conversationFormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required])
  });

  displayedColumns = [
    'content',
  ];
  dataSource = ELEMENT_DATA;

  constructor(private fb: FormBuilder,
    private signalService: SignalrService,
    private videoService: VideoService,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    private authService: AuthService) {
  }
  ngOnInit(): void {

    this.signalService.startConnect();
  }

  get conversationNameFc(): FormControl {
    return this.conversationFormGroup.get('name') as FormControl;
  }

  conversation: any;
  remotesCounter = 0;

  getOrcreateConversation() {
    // validate room number
    this.validateRoom();
    if (!this.validateResponse.isValid) {
      this.snackBar.open('Room code is invalid', 'Close');
      return;
    }

    if(!this.validateResponse.isStarted){
      this.snackBar.open('Waiting for host', 'Close');
      return;
    }


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
        this.remotesCounter += 1;
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
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


  validateRoom() {
    let token = this.commonService.getLocalStorage(environment.tokenName);
    let decodeToken = this.authService.getDecodedAccessToken(token)
    let userid = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    let room = this.conversationFormGroup.value['name'];
    this.videoService.validateCourse(Number(room), userid)
      .subscribe(body => {
        if (body) {
          this.validateResponse = body.body;
        }
      });
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
