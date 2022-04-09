import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotifyComponent } from 'src/app/components/delete-notify/delete-notify.component';
import { PageEvent } from '@angular/material/paginator';
import { OdataService } from 'src/app/services/common/odata.service';
import { UserCreateDialogComponent } from 'src/app/components/user-create-dialog/user-create-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseManagementDto } from 'src/app/models/admin/CourseManagementDto';
import { CourseManagementService } from 'src/app/services/management/course-management.service';

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
    { data: [65, 59, 80, 81, 56, 55, 40, 50, 60, 45, 15, 65], label: 'Blocked Account' },
    { data: [28, 48, 40, 19, 86, 27, 90, 58, 56, 96, 58, 15], label: 'New Account' }
  ];

  // pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Member', 'Trainer', 'Business Man', 'Admin'];
  public pieChartData: SingleDataSet = [3000, 500, 100, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  total: number;
  dataSource: CourseManagementDto[] = [];
  skip: number = 0;
  take: number = 10;

  constructor(private router: Router,
    public dialog: MatDialog,
    private courseManagementService: CourseManagementService,
    private odataService: OdataService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getCourseList();
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
      let userNames = <number[]>id.toString();
      dialogRef.componentInstance.data = contentDelete + userNames + contentDelete1;

    }

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Y') {
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
    let filter = `?$top=${this.take}&$skip=${this.skip}&$filter=` + otherFilter;

    filter = this.odataService.adjustUrl(filter);
    filter = this.odataService.removeFilter(filter);

    filter += this.sortByQuery();

    // console.log(filter);

    this.courseManagementService.getAllCourse(filter)
      .subscribe(x => {
        if (x) {
          this.dataSource = x.items;
          this.total = x.count;
        }
      })
  }

  getPaginatorData(event?: PageEvent) {
    this.skip = event.pageIndex * this.take;
    this.getCourseList();
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
      this.courseManagementService.deleteCourse(new Array<number>(id));
    }
    else {
      // delete all
      let courseIds = this.dataSource.map(x => x.courseId);
      this.courseManagementService.deleteCourse(courseIds)
        .subscribe(x => {
          if (x && x.body == true) {
            this.snackBar.open(DeleteMessageSuccess, Action);
          }
        });
    }
  }

}
