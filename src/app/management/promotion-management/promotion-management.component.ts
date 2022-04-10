import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteNotifyComponent } from 'src/app/components/delete-notify/delete-notify.component';
import { PromotionDto } from 'src/app/models/admin/PromotionDto';
import { PromotionService } from 'src/app/services/management/promotion.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DisplayPromotion } from 'src/app/models/admin/DisplayPromotion';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/common/auth.service';

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

  promotionFormGroup = new FormGroup({
    promotionName: new FormControl('', [
      Validators.required
    ]),
    quantity: new FormControl('', [
      Validators.required
    ]),
    unit: new FormControl('', [
      Validators.required
    ]),
    amount: new FormControl(),
    appliedDate: new FormControl('', [
      Validators.required
    ]),
    dueDate: new FormControl('', [
      Validators.required
    ]),
    coursePromotion: new FormControl([]),
    productPromotion: new FormControl([]),
    description: new FormControl(),
  });

  unitList: any[] = [
    {
      id: 1,
      value: 'Money'
    },
    {
      id: 2,
      value: 'Percentage'
    },
    {
      id: 3,
      value: 'Equipment'
    }
  ];
  // variables
  currentPromotionId?: number;
  buttonTitle = "Create";
  dataSource: PromotionDto[] = [];
  coursePromotionList: DisplayPromotion[] = [];
  productPromotionList: DisplayPromotion[] = [];
  isCreate: boolean = true;

  constructor(private router: Router,
    public commonService: CommonService,
    private promotionService: PromotionService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.getPromotionList();
    this.getInitPromotionCourseProducts();
  };

  changeFormValue(id: number) {
    this.currentPromotionId = id;
    this.isCreate = false;
    this.buttonTitle = "Update";
    let currentValue = this.dataSource.find(x => x.promotionId == id);
    this.promotionFormGroup.setValue({
      promotionName: currentValue.promotionName,
      quantity: currentValue.quantity,
      unit: currentValue.lkUnitId,
      amount: currentValue.amount,
      appliedDate: currentValue.appliedDate,
      dueDate: currentValue.dueDate,
      description: currentValue.promotionDescription,
      coursePromotion: currentValue.coursePromotions.map(x => x.objectId),
      productPromotion: currentValue.productPromotions.map(x => x.objectId)
    });

  }

  triggerCreate() {
    this.buttonTitle = "Create";
    this.isCreate = true;
    this.currentPromotionId = null;
  }

  submitForm() {
    if (this.isCreate) {
      this.createPromotion();
    }
    else {
      this.updatePromotion();
    }
  }

  deletePromotion() {
    if (this.currentPromotionId == null) {
      return;
    }
    this.promotionService.deletePromotion(this.currentPromotionId)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar("Delete success", "Close");
          this.getPromotionList();
          this.currentPromotionId = null;
        }
      });
  }

  private createPromotion() {
    let model: PromotionDto = {
      promotionName: this.promotionFormGroup.value["promotionName"],
      promotionDescription: this.promotionFormGroup.value["description"],
      quantity: this.promotionFormGroup.value["quantity"],
      lkUnitId: this.promotionFormGroup.value["unit"],
      amount: this.promotionFormGroup.value["unit"] == 3 ? null : this.promotionFormGroup.value["amount"],
      appliedDate: this.promotionFormGroup.value["appliedDate"],
      dueDate: this.promotionFormGroup.value["dueDate"],
      userId: this.authService.getUserId()
    };

    this.promotionService.createPromotion(model)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar("Create success", "Close");
          this.getPromotionList();
        }
      });
  }

  private updatePromotion() {
    let model: PromotionDto = {
      promotionId: this.currentPromotionId,
      promotionName: this.promotionFormGroup.value["promotionName"],
      promotionDescription: this.promotionFormGroup.value["description"],
      quantity: this.promotionFormGroup.value["quantity"],
      lkUnitId: this.promotionFormGroup.value["unit"],
      amount: this.promotionFormGroup.value["unit"] == 3 ? null : this.promotionFormGroup.value["amount"],
      appliedDate: this.promotionFormGroup.value["appliedDate"],
      dueDate: this.promotionFormGroup.value["dueDate"],
      updateCoursePromotions: this.promotionFormGroup.value["coursePromotion"],
      updateProductPromotions: this.promotionFormGroup.value["productPromotion"],
      userId: this.authService.getUserId()
    };

    this.promotionService.updatePromotion(model)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar("Create success", "Close");
          this.getPromotionList();
        }
      });
  }

  private getPromotionList() {
    this.promotionService.getPromotions()
      .subscribe(x => {
        this.dataSource = x.body
      })
  }

  private getInitPromotionCourseProducts() {
    this.promotionService.getCoursePromotion()
      .subscribe(x => {
        this.coursePromotionList = x.body;
      });

    this.promotionService.getProductPromotion()
      .subscribe(x => {
        this.productPromotionList = x.body;
      });
  }
}
