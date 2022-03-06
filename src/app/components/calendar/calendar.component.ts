import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  EventSettingsModel,
  View
} from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
/* Month being +1 */
export class CalendarComponent implements OnInit {
  date: Date = new Date();
  public selecteddatavalue: Date = new Date(2022, 3, 11);
  public currentviewdata: View = 'Month';
  public data: object[] = [{
    id: 2,
    eventName: 'Interview Meeting',
    startTime: new Date(this.date.getFullYear(), 1, 11, 10, 30),
    endTime: new Date(this.date.getFullYear(), 3, 11, 11, 50),
    isAllDay: false
  }];
  public eventSettings: EventSettingsModel = {
    dataSource: this.data,
    fields: {
      id: 'id',
      subject: {
        name: 'eventName'
      },
      isAllDay: {
        name: 'isAllDay'
      },
      startTime: {
        name: 'startTime'
      },
      endTime: {
        name: 'endTime'
      },
    }
  };
  constructor() { }
  ngOnInit(): void {

  }
}
