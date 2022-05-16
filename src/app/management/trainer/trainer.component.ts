import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotifyComponent } from 'src/app/components/delete-notify/delete-notify.component';
import { PageEvent } from '@angular/material/paginator';
import { OdataService } from 'src/app/services/common/odata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseManagementDto } from 'src/app/models/admin/CourseManagementDto';
import { CourseManagementService } from 'src/app/services/management/course-management.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { BillDto } from 'src/app/models/admin/BillDto';
import { BillDetailComponent } from 'src/app/components/bill-detail/bill-detail.component';
import * as signalR from '@aspnet/signalr';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { environment } from 'src/environments/environment';

const blankSpace = ' ';
const contentDelete = "Are you sure to delete course ";
const contentDelete1 = "!.";
const Action = "Close";
const DeleteMessageSuccess = "Delete Success";

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {

  // variables
  searchValue: string;
  courseName: string;
  trainerName: string;
  startDate: Date;
  endDate: Date;
  sortByList: any[] = [
    {
      value: 1,
      display: 'Course Name Increase'
    },
    {
      value: 2,
      display: 'Course Name Descrease'
    },
    {
      value: 3,
      display: 'Start Date Increase'
    },
    {
      value: 4,
      display: 'Start Date Descrease'
    },
    {
      value: 5,
      display: 'End Date Increase'
    },
    {
      value: 6,
      display: 'End Date Descrease'
    },
  ];

  sortBy: number = 1;

  // bar chart
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], label: 'Bought Course' },
  ];



  public createCourseChartData: ChartDataSets[] = [
    { data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], label: 'Create Course' },
  ];

  public turnOverCourseChartData: ChartDataSets[] = [
    { data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], label: 'Turn Over' },
  ];

  total: number;
  billTotal: number;
  billDataSource: BillDto[] = [];
  originalBillDataSource: BillDto[] = [];
  dataSource: CourseManagementDto[] = [];
  skip: number = 0;
  take: number = 10;
  billSkip: number = 0;
  private hubConnection: signalR.HubConnection;

  constructor(private router: Router,
    public dialog: MatDialog,
    private courseManagementService: CourseManagementService,
    private odataService: OdataService,
    private paymentService: PaymentService,
    private commonService: CommonService,
    private authService: AuthService) {
    this.signalRConnection();
  }

  ngOnInit() {
    this.getCourseList();
    this.getInitStatistic();
  };

  navigateCreatePage() {
    this.router.navigate(['/management/course/create']);
  }

  public handlerStatus(status) {
    if (status) {
      return 'text-primary';
    }
    else {
      return 'text-danger';
    }
  }

  confirmBill(billId: number, status: boolean) {
    this.paymentService.updateBillStatus(billId, status)
      .subscribe(x => {
        if (x && x.body) {
          let bill = this.billDataSource.find(x => x.billId == billId);
          bill.isConfirmed = status;
          bill = this.originalBillDataSource.find(x => x.billId == billId);
          bill.isConfirmed = status;
          this.triggerNotify();
          this.commonService.displaySnackBar("Update successfully", "Close");
        }
      });
  }

  openDetaiBilllDialog(id: number) {
    var billDetailData = this.billDataSource.find(x => x.billId == id);
    const dialogRef = this.dialog.open(BillDetailComponent, {
      minWidth: '500px',
      width: '80%'
    });

    dialogRef.componentInstance.data = JSON.stringify(billDetailData.details);
  }

  printEvent() {
    document.getElementById("hiden-component").style.display = "none";

    window.print();

    document.getElementById("hiden-component").style.display = "block";
  }

  navigateUpdatePage(userName) {
    this.router.navigate(['management/course/update/' + userName], {
      state: {
        userNameState: userName
      }
    });
  }

  confirmDelete(id: any) {
    const dialogRef = this.dialog.open(DeleteNotifyComponent, {
      width: '400px',
      maxWidth: '800px',
      minWidth: '350px',
    });

    if (typeof (id) == "number") {
      dialogRef.componentInstance.data = contentDelete + id + contentDelete1;
    }
    else {
      dialogRef.componentInstance.data = "Are you sure to delete all courses !.";

    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (typeof (id) == "number") {
          this.deleteEvent(id);
        }
        else {
          this.deleteEvent(null);
        }
      }
    });
  }

  private getCourseList(otherFilter: string = '') {
    this.commonService.displaySpinner();

    let filter = `?$top=${this.take}&$skip=${this.skip}&$filter=` + this.odataService.addFilterEqual('trainerUsername', this.authService.getUserName(), true) + otherFilter;

    filter = this.odataService.adjustUrl(filter);

    filter = this.odataService.removeFilter(filter);

    filter += this.sortByQuery();

    // console.log(filter);

    this.courseManagementService.getAllCourse(filter)
      .subscribe(x => {
        if (x) {
          this.commonService.distroySpinner();
          this.dataSource = x.items;
          this.total = x.count;
        }
      })
  }

  getPaginatorData(event?: PageEvent) {
    this.skip = event.pageIndex * this.take;
    this.getCourseList();
  }

  getBillPaginatorData(event?: PageEvent) {
    this.billSkip = event.pageIndex * this.take;
    this.billDataSource = this.originalBillDataSource.slice(this.billSkip, this.take + this.billSkip);
  }

  applyFilter() {
    let filter = this.courseNameQuery();
    filter += this.trainerNameQuery();
    filter += this.startDateQuery();
    filter += this.endDateQuery();
    // filter += this.dateCreateQuery();
    this.getCourseList(filter);
  }

  courseNameQuery() {
    if (this.courseName && this.courseName != '' && this.courseName != null && this.courseName != undefined) {
      return this.odataService.addFilterIn('courseName', [this.courseName]) + blankSpace;
    }

    return '';
  }

  trainerNameQuery() {
    if (this.trainerName && this.trainerName != '' && this.trainerName != null && this.trainerName != undefined) {
      return this.odataService.addFilterIn('trainerName', [this.trainerName]) + blankSpace;
    }

    return '';
  }

  startDateQuery() {
    if (this.startDate && this.startDate != null && this.startDate != undefined) {
      this.odataService.addFilterEqual('startDate', this.startDate.toString()) + blankSpace;
    }

    return '';
  }

  endDateQuery() {
    if (this.endDate && this.endDate != null && this.endDate != undefined) {
      this.odataService.addFilterEqual('endDate', this.endDate.toString()) + blankSpace;
    }

    return '';
  }

  sortByQuery() {
    switch (this.sortBy) {
      case 1:
        return this.odataService.sortBy('courseName', false);
      case 2:
        return this.odataService.sortBy('courseName', true);
      case 3:
        return this.odataService.sortBy('startDate', false);
      case 4:
        return this.odataService.sortBy('startDate', true);
      case 5:
        return this.odataService.sortBy('endDate', false);
      case 6:
        return this.odataService.sortBy('endDate', true);
      default:
        return this.odataService.sortBy('courseName', false);
    }
  }

  deleteEvent(id: number) {
    if (id) {
      // delete one record
      this.courseManagementService.deleteOneCourse(id)
        .subscribe(x => {
          if (x && x.body == true) {
            this.commonService.displaySnackBar(DeleteMessageSuccess, Action);
            this.getCourseList();
          }
        });
    }
    else {
      // delete all
      let courseIds = this.dataSource.map(x => x.courseId);
      this.courseManagementService.deleteCourse(courseIds)
        .subscribe(x => {
          if (x && x.body == true) {
            this.commonService.displaySnackBar(DeleteMessageSuccess, Action);
            this.getCourseList();
          }
        });
    }
  }

  private triggerNotify() {
    this.hubConnection.invoke('GetNotification')
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
      });
  }

  private getInitStatistic() {
    this.courseManagementService.getBills()
      .subscribe(x => {
        if (x) {
          this.originalBillDataSource = x.body;
          this.billDataSource = x.body.slice(this.billSkip, this.take);
          this.billTotal = x.body.length;
        }
      })
    this.courseManagementService.getBoughtCourseByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.number);
        let tmpObj = { data: dataArray, label: 'Bought Course' };
        this.barChartData = [tmpObj];
      });
    this.courseManagementService.getCreateCourseByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.number);
        let tmpObj = { data: dataArray, label: 'Create Course' };
        this.createCourseChartData = [tmpObj];
      });
    this.courseManagementService.getTurnOverCourseByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.amount);
        let tmpObj = { data: dataArray, label: 'Turn Over' };
        this.turnOverCourseChartData = [tmpObj];
      })
  }
}
