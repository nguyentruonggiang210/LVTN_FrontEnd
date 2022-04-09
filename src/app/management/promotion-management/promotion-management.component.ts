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
import { PromotionDto } from 'src/app/models/admin/PromotionDto';
import { PromotionService } from 'src/app/services/management/promotion.service';

const blankSpace = ' ';
const contentDelete = "Are you sure to delete course ";
const contentDelete1 = "!.";
const Action = "Close";
const DeleteMessageSuccess = "Delete Success";

@Component({
  selector: 'app-promotion-management',
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.scss']
})
export class PromotionManagementComponent implements OnInit {

  // variables
  dataSource: PromotionDto[] = [];

  constructor(private router: Router,
    public dialog: MatDialog,
    private promotionService: PromotionService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getPromotionList();
  };

  private getPromotionList() {
    this.promotionService.getPromotions()
      .subscribe(x => {
        this.dataSource == x.body
      })
  }


}
