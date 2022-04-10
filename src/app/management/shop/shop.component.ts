import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopDto } from 'src/app/models/admin/ShopDto';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ShopManagementService } from 'src/app/services/management/shop-management.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  defaultShopImage: string = 'assets/img/default-shop-image.jpg';
  buttonTitle: string = 'Create';
  dataSource: ShopDto = null;
  shopId?: number = null;
  imageFile: any = null;
  imageUrl: any;
  shopFormGroup = new FormGroup({
    shopName: new FormControl('', [
      Validators.required
    ]),
    hostName: new FormControl('', [
      Validators.required
    ]),
    facebook: new FormControl(),
    youtube: new FormControl(),
    description: new FormControl(),
  });

  constructor(private shopManagementService: ShopManagementService,
    private authService: AuthService,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.getShopDetail();

  }

  submitEvent() {
    if (this.dataSource == null) {
      this.createShop();
    }
    else {
      this.updateShop();
    }
  }

  deleteEvent() {
    this.shopManagementService.deleteShop(this.shopId)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar('Delete success', 'Close');
          window.location.href = 'management/product';
        }
      })
  }

  upload(target: any) {
    this.loadImage(target);
    this.imageFile = target.files[0];
  }

  private loadImage(target: any) {
    var reader = new FileReader();
    reader.readAsDataURL(target.files[0]);

    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('image', this.imageFile);

    formData.append('userId', this.authService.getUserId());
    this.shopManagementService.uploadShopImage(formData, this.shopId)
      .subscribe(x => {
        if (x) {
          this.commonService.displaySnackBar('Upload image success', 'Close');
          if (this.dataSource != null) {
            this.getShopDetail();
            this.imageFile = null;
            this.imageUrl = null;
          }
        }
      });
  }

  private createShop() {
    let model: ShopDto = {
      userId: this.authService.getUserId(),
      hostName: this.shopFormGroup.value['hostName'],
      shopName: this.shopFormGroup.value['shopName'],
      facebook: this.shopFormGroup.value['facebook'],
      youtube: this.shopFormGroup.value['youtube'],
      description: this.shopFormGroup.value['description'],
    };

    this.shopManagementService.createShop(model)
      .subscribe(x => {
        this.commonService.displaySnackBar('Create success', 'Close');
        window.location.href = 'management/product';
      });
  }

  private updateShop() {
    let model: ShopDto = {
      userId: this.authService.getUserId(),
      hostName: this.shopFormGroup.value['hostName'],
      shopName: this.shopFormGroup.value['shopName'],
      facebook: this.shopFormGroup.value['facebook'],
      youtube: this.shopFormGroup.value['youtube'],
      description: this.shopFormGroup.value['description'],
    };

    this.shopManagementService.updateShop(model)
      .subscribe(x => {
        this.commonService.displaySnackBar('Update success', 'Close');
      });
  }

  private getShopDetail() {
    this.shopManagementService.getShopInfo()
      .subscribe(x => {
        this.dataSource = x.body
        this.shopId = x.body.shopId;
        this.imageUrl = x.body.image;
        this.setFormValue(x.body);
        this.handlerButtonTitle();
      });
  }

  private setFormValue(model: ShopDto) {
    this.shopFormGroup.setValue({
      shopName: model.shopName,
      hostName: model.hostName,
      facebook: model.facebook,
      youtube: model.youtube,
      description: model.description
    });
  }

  private handlerButtonTitle() {
    if (this.shopId == null) {
      this.buttonTitle = 'Create';
    }
    else {
      this.buttonTitle = 'Update';
    }
  }
}
