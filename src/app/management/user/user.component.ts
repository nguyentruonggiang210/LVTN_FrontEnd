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

  total: number;
  dataSource: UserManagementDto[] = [];
  skip: number = 0;
  take: number = 10;

  constructor(private router: Router,
    public dialog: MatDialog,
    private userManagementService: UserManagementService,
    private odataService: OdataService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getProductList();
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

    window.print();

    document.getElementById("hiden-component").style.display = "block";
  }

  navigateUpdatePage(userName) {
    this.router.navigate(['management/user/update/' + userName]);
  }

  confirmDelete(id: any) {
    const dialogRef = this.dialog.open(DeleteNotifyComponent, {
      width: '400px',
      maxWidth: '800px',
      minWidth: '350px',
    });

    if (typeof (id) == "string") {
      dialogRef.componentInstance.data = contentDelete + id + contentDelete1;
    }
    else {
      let userNames = <string[]>id.toString();
      dialogRef.componentInstance.data = contentDelete + userNames + contentDelete1;

    }

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Y') {
        if (typeof (id) == "string") {
          this.deleteEvent(id);
        }
        else {
          this.deleteEvent(null);
        }
      }
    });
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
        return this.odataService.sortBy('status', false);
      case 4:
        return this.odataService.sortBy('status', true);
      default:
        return this.odataService.sortBy('userName', false);
    }
  }

  deleteEvent(id: string) {
    if (id) {
      // delete one record
      this.userManagementService.deleteUser(new Array<string>(id));
    }
    else {
      // delete all
      let userNames = this.dataSource.map(x => x.userName);
      this.userManagementService.deleteUser(userNames)
        .subscribe(x => {
          if (x && x.body == true) {
            this.snackBar.open(DeleteMessageSuccess, Action);
          }
        });
    }
  }
}
