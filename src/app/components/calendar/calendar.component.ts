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
import { CarouselService } from 'src/app/services/home/carousel.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
/* Month being +1 */
export class CalendarComponent implements OnInit {
  date: Date = new Date();
  public selecteddatavalue: Date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  public currentviewdata: View = 'Month';
  public data: object[];
  public eventSettings: EventSettingsModel;
  constructor(private carouselService: CarouselService) { }
  ngOnInit(): void {
    this.getSchedule();
  }

  private getSchedule() {
    this.carouselService.geSchedule()
      .subscribe(x => {
        this.data = x.body.map(x => <Object>{
          id: x.meetingRoomId,
          eventName: x.courseName,
          startTime: x.startTime,
          endTime: x.endTime,
          isAllDay: false
        });

        this.eventSettings = {
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
      });
  }
}
