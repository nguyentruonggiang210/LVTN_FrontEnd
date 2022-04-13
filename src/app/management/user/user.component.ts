import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotifyComponent } from 'src/app/components/delete-notify/delete-notify.component';
import { UserManagementService } from 'src/app/services/management/user-management.service';
import { UserManagementDto } from 'src/app/models/admin/UserManagementDto';
import { PageEvent } from '@angular/material/paginator';
import { OdataService } from 'src/app/services/common/odata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common/common.service';

const blankSpace = ' ';
const contentDelete = "Are you sure to delete user ";
const contentDelete1 = "!. You can't restore this account after that!";
const Action = "Close";
const DeleteMessageSuccess = "Delete Success";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // variables
  searchValue: string;
  userName: string;
  name: string;
  address: string;
  dateCreate: Date;
  sortByList: any[] = [
    {
      value: 1,
      display: 'UserName Increase'
    },
    {
      value: 2,
      display: 'UserName Descrease'
    },
    {
      value: 3,
      display: 'Status Activated'
    },
    {
      value: 4,
      display: 'Status Disabled'
    },
    {
      value: 5,
      display: 'Date Create Increase'
    },
    {
      value: 6,
      display: 'Date Create Descrease'
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

  public barChartData: ChartDataSets[] = [{ data: [6, 5, 6, 3, 2, 1, 5, 0, 1, 5], label: 'New Account' }];

  // pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Admin', 'Member', 'Business Man', 'Trainer'];
  public pieChartData: SingleDataSet = [5, 4, 3, 2, 1];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // user list
  userList: Array<any> = [];

  total: number;
  dataSource: UserManagementDto[] = [];
  skip: number = 0;
  take: number = 10;

  constructor(private router: Router,
    public dialog: MatDialog,
    private userManagementService: UserManagementService,
    private odataService: OdataService,
    private commonService: CommonService) {
  }

  ngOnInit() {
    this.getUserList();
    this.getInitStatistic();
  };

  navigateCreateUser() {
    this.router.navigate(['management/user/create/']);
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
    document.getElementById("my-footer").style.display = "none";

    window.print();

    document.getElementById("hiden-component").style.display = "block";
    document.getElementById("my-footer").style.display = "block";
  }

  navigateUpdatePage(userName) {
    this.router.navigate(['management/user/update/' + userName]);
  }

  confirmDelete(userName: any) {
    const dialogRef = this.dialog.open(DeleteNotifyComponent, {
      width: '400px',
      maxWidth: '800px',
      minWidth: '350px',
    });

    if (typeof (userName) == "string") {
      dialogRef.componentInstance.data = contentDelete + userName + contentDelete1;
    }
    else {
      dialogRef.componentInstance.data = "Are you sure to delete all user on this page";
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (typeof (userName) == "string") {
          this.deleteEvent(userName);
        }
        else {
          this.deleteEvent(null);
        }
      }
    });
  }

  private getUserList(otherFilter: string = '') {
    this.commonService.displaySpinner();

    let filter = `?$top=${this.take}&$skip=${this.skip}&$filter=` + otherFilter;

    filter = this.odataService.adjustUrl(filter);

    filter = this.odataService.removeFilter(filter);

    filter += this.sortByQuery();

    this.userManagementService.getAllUser(filter)
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
    this.getUserList();
  }

  applyFilter() {
    let filter = this.userNameQuery();
    filter += this.nameQuery();
    filter += this.addressQuery();
    filter += this.dateCreateQuery();
    this.getUserList(filter);
  }

  userNameQuery() {
    if (this.userName && this.userName != '' && this.userName != null && this.userName != undefined) {
      return this.odataService.addFilterIn('userName', [this.userName]) + blankSpace;
    }

    return '';
  }

  nameQuery() {
    if (this.name && this.name != '' && this.name != null && this.name != undefined) {
      return this.odataService.addFilterIn('name', [this.name]) + blankSpace;
    }

    return '';
  }

  addressQuery() {
    if (this.address && this.address != '' && this.address != null && this.address != undefined) {
      return this.odataService.addFilterIn('address', [this.address]) + blankSpace;
    }

    return '';
  }

  dateCreateQuery() {
    if (this.dateCreate && this.dateCreate != null && this.dateCreate != undefined) {
      return this.odataService.addFilterEqual('createDate', this.dateCreate.toString()) + blankSpace;
    }

    return '';
  }

  sortByQuery() {
    switch (this.sortBy) {
      case 1:
        return this.odataService.sortBy('userName', false);
      case 2:
        return this.odataService.sortBy('userName', true);
      case 3:
        return this.odataService.sortBy('status', false);
      case 4:
        return this.odataService.sortBy('status', true);
      case 5:
        return this.odataService.sortBy('createDate', false);
      case 6:
        return this.odataService.sortBy('createDate', true);
      default:
        return this.odataService.sortBy('userName', false);
    }
  }

  deleteEvent(userName?: string) {
    if (userName) {
      // delete one record
      this.userManagementService.deleteOneUse(userName)
        .subscribe(x => {
          if (x && x.body) {
            this.commonService.displaySnackBar(DeleteMessageSuccess, Action);
            this.getUserList();
          }
        });
    }
    else {
      // delete all
      let userNames = this.dataSource.map(x => x.userName);
      this.userManagementService.deleteUser(userNames)
        .subscribe(x => {
          if (x && x.body) {
            this.commonService.displaySnackBar(DeleteMessageSuccess, Action);
            this.getUserList();
          }
        });
    }
  }

  private getInitStatistic() {
    this.userManagementService.getUserByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.number);
        let tmpObj = { data: dataArray, label: 'New Account' };
        this.barChartData = [tmpObj];
        this.barChartLegend = false;
        this.barChartType = 'bar';
      });

    this.userManagementService.getUserByRole()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.number);
        this.pieChartData = dataArray;
        this.pieChartType = 'pie';
        this.pieChartLegend = true;
      });
  }
}
