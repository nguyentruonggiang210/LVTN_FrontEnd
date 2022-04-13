import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotifyComponent } from 'src/app/components/delete-notify/delete-notify.component';
import { PageEvent } from '@angular/material/paginator';
import { OdataService } from 'src/app/services/common/odata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductManagementService } from 'src/app/services/management/product-management.service';
import { ProductManagementDto } from 'src/app/models/ProductManagementDto';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';

const blankSpace = ' ';
const contentDelete = "Are you sure to delete product ";
const contentDelete1 = "!.";
const Action = "Close";
const DeleteMessageSuccess = "Delete Success";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  // variables
  isShopExist: boolean = false;
  shopTitle: string = "Create shop";
  searchValue: string;
  productName: string;
  dateImport: string;
  dateCreate: Date;
  sortByList: any[] = [
    {
      value: 1,
      display: 'Date Import Increase'
    },
    {
      value: 2,
      display: 'Date Import Descrease'
    },
    {
      value: 3,
      display: 'Price Increase'
    },
    {
      value: 4,
      display: 'Price Descrease'
    },
    {
      value: 5,
      display: 'Status Activated'
    },
    {
      value: 6,
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
    { data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], label: 'Bought Product' }
  ];

  // import product bar chart
  public importBarChartData: ChartDataSets[] = [
    { data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], label: 'Import Product' }
  ];

  // turnover product bar chart
  public turnOverBarChartData: ChartDataSets[] = [
    { data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], label: 'Turn Over' }
  ];

  // user list
  userList: Array<any> = [];

  total: number;
  dataSource: ProductManagementDto[] = [];
  skip: number = 0;
  take: number = 10;

  constructor(private router: Router,
    public dialog: MatDialog,
    private productManagementService: ProductManagementService,
    private authService: AuthService,
    private odataService: OdataService,
    private commonService: CommonService) {
  }

  ngOnInit() {
    this.getProductList();
    this.getInitStatistic();
    this.productManagementService.checkShopExist()
      .subscribe(x => {
        this.isShopExist = x.body;
        this.shopTitle = x.body ? "Update shop" : "Create shop";
      })
  };

  navigateProductCreate() {
    this.router.navigate(['management/product/create/']);
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

  navigateUpdatePage(productId: number) {
    this.router.navigate(['management/product/update/' + productId]);
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
      dialogRef.componentInstance.data = 'Are you sure to delete all products in this page.';
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

  private getProductList(otherFilter: string = '') {
    this.commonService.displaySpinner();

    let filter = `?$top=${this.take}&$skip=${this.skip}&$filter=` + this.odataService.addFilterEqual('userName', this.authService.getUserName(), true) + otherFilter;

    filter = this.odataService.adjustUrl(filter);

    filter = this.odataService.removeFilter(filter);

    filter += this.sortByQuery();

    console.log(filter);


    this.productManagementService.getAllProduct(filter)
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
    this.getProductList();
  }

  applyFilter() {
    let filter = this.productNameQuery();
    filter += this.dateImportQuery();
    this.getProductList(filter);
  }

  productNameQuery() {
    if (this.productName && this.productName != '' && this.productName != null && this.productName != undefined) {
      return this.odataService.addFilterIn('productName', [this.productName]) + blankSpace;
    }

    return '';
  }

  dateImportQuery() {
    if (this.dateImport && this.dateImport != null && this.dateImport != undefined) {
      return this.odataService.addFilterEqual('importDate', this.dateImport.toString()) + blankSpace;
    }

    return '';
  }

  sortByQuery() {
    switch (this.sortBy) {
      case 1:
        return this.odataService.sortBy('importDate', false);
      case 2:
        return this.odataService.sortBy('importDate', true);
      case 3:
        return this.odataService.sortBy('price', false);
      case 4:
        return this.odataService.sortBy('price', true);
      case 5:
        return this.odataService.sortBy('status', false);
      case 6:
        return this.odataService.sortBy('status', true);
      default:
        return this.odataService.sortBy('userName', false);
    }
  }

  navigateShop() {
    this.router.navigate(["management/shop"]);
  }

  deleteEvent(productId?: number) {
    debugger
    if (productId) {
      // delete one record
      this.productManagementService.deleteOneProduct(productId)
        .subscribe(x => {
          this.commonService.displaySnackBar(DeleteMessageSuccess, Action);
          this.getProductList();
        });
    }
    else {
      // delete all
      let productIds = this.dataSource.map(x => x.productId);
      this.productManagementService.deleteProduct(productIds)
        .subscribe(x => {
          if (x && x.body == true) {
            this.commonService.displaySnackBar(DeleteMessageSuccess, Action);
            this.getProductList();
          }
        });
    }
  }

  private getInitStatistic() {
    this.productManagementService.getBoughtProductByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.number);
        let tmpObj = { data: dataArray, label: 'Bought Product' };
        this.barChartData = [tmpObj];
      });

    this.productManagementService.getProductImportByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.number);
        let tmpObj = { data: dataArray, label: 'Import Product' };
        this.importBarChartData = [tmpObj];
      });

    this.productManagementService.getProductTurnOverByMonth()
      .subscribe(x => {
        let dataArray = x.body.map(x => x.amount);
        let tmpObj = { data: dataArray, label: 'Turn Over' };
        this.turnOverBarChartData = [tmpObj];
      })
  }
}
