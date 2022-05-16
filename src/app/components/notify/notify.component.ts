import { Component, OnInit } from '@angular/core';
import { PaymentHubDto } from 'src/app/models/hubs/PaymentHubDto';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  private hubConnection: signalR.HubConnection;
  dataSource: PaymentHubDto[];

  constructor(private commonService: CommonService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.signalRConnection();
  }

  private signalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalConnection + 'notify', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start()
      .then(res => {
        console.log(res);
      })
      .then(() => {
        this.triggerNotify();
      });

    this.hubConnection.on('handlerNotify', data => {
      let currentUserName = this.authService.getUserName();
      if (currentUserName != null && currentUserName != '' && currentUserName != undefined) {
        let body = <PaymentHubDto[]>data;
        this.dataSource = body.filter(x => x.hostName == currentUserName);
        this.commonService.setLocalStorage(environment.notify, this.dataSource?.length)
      }
    });
  }

  display(model: PaymentHubDto) {
    if (model?.actionType == 1) {
      return `${model?.userName} bought ${model?.quantity} ${model?.name}`;
    }
    else if (model?.actionType == 2) {
      return `${model?.name} has ${model?.quantity} in stock`;
    }
    else {
      return `Your order has been confirmed`;
    }
  }

  private triggerNotify() {
    this.hubConnection.invoke('GetNotification')
  }
}
