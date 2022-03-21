import { Component, OnInit, Inject } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, Color, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotifyComponent } from 'src/app/components/delete-notify/delete-notify.component';
import { UserManagementService } from 'src/app/services/management/user-management.service';
import { UserManagementDto } from 'src/app/models/admin/UserManagementDto';
import { ODataResponse } from 'angular-odata';
import { PageEvent } from '@angular/material/paginator';
import { OdataService } from 'src/app/services/common/odata.service';
import { UserCreateDialogComponent } from 'src/app/components/user-create-dialog/user-create-dialog.component';

const blankSpace = ' ';
const contentDelete = "Are you sure to delete user ";
const contentDelete1 = "!. You can't restore this account after that!";
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

  // user list
  userList: Array<any> = [];
  user = {
    id: '1523',
    name: 'Dakota Rice',
    role: 'admin',
    city: 'Can Tho',
    dateCreate: '6/10/2021',
    userStatus: true,
  }

  total: number;
  dataSource: UserManagementDto[] = [];
  skip: number = 0;
  take: number = 10;

  constructor(private router: Router,
    public dialog: MatDialog,
    private userManagementService: UserManagementService,
    private odataService: OdataService,
    private matDialog: MatDialog) {
    for (let i = 0; i < 10; i++) {
      this.userList.push(this.user);
    }
  }

  ngOnInit() {
    this.getProductList();
  };

  navigateCreateUser() {
    const dialogRef = this.dialog.open(UserCreateDialogComponent, {
      width: '50%',
      maxWidth: '800px',
      minWidth: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The UserCreateDialogComponent was closed');
      console.log(result);
    });
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
    // let originalContents = document.body.innerHTML;

    // document.body.innerHTML = printContents;

    window.print();

    document.getElementById("hiden-component").style.display = "block";
  }

  navigateUpdatePage(userName) {
    this.router.navigate(['detail/user'], {
      state: {
        userNameState: userName
      }
    });
  }
  confirmDelete(id) {
    const dialogRef = this.dialog.open(DeleteNotifyComponent, {
      width: '400px',
      maxWidth: '800px',
      minWidth: '350px',
    });

    dialogRef.componentInstance.data = contentDelete + id + contentDelete1;

  }

  private getProductList(otherFilter: string = '') {
    let filter = `?$top=${this.take}&$skip=${this.skip}&$filter=` + otherFilter;

    filter = this.odataService.adjustUrl(filter);
    filter = this.odataService.removeFilter(filter);

    filter += this.sortByQuery();

    console.log(filter);

    this.userManagementService.getAllUser(filter)
      .subscribe(x => {
        if (x) {
          this.dataSource = x.items;
          this.total = x.count;
        }
      })
  }

  getPaginatorData(event?: PageEvent) {
    this.skip = event.pageIndex * this.take;
    this.getProductList();
  }

  applyFilter() {
    let filter = this.userNameQuery();
    filter += this.nameQuery();
    filter += this.addressQuery();
    filter += this.dateCreateQuery();
    this.getProductList(filter);
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
    console.log(this.sortBy);
    switch (this.sortBy) {
      case 1:
        return this.odataService.sortBy('userName', false);
      case 2:
        return this.odataService.sortBy('userName', true);
      case 3:
        return this.odataService.sortBy('createDate', false);
      case 4:
        return this.odataService.sortBy('createDate', true);
      default:
    }
  }
}
