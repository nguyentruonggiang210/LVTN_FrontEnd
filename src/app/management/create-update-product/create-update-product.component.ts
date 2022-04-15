import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductManagementDto } from 'src/app/models/admin/CreateProductManagementDto';
import { ImageDto } from 'src/app/models/ImageDto';
import { CategoryService } from 'src/app/services/category/category.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ProductManagementService } from 'src/app/services/management/product-management.service';

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.component.html',
  styleUrls: ['./create-update-product.component.scss']
})
export class CreateUpdateProductComponent implements OnInit {

  permitImage: boolean = false;
  productId?: number = null;
  originalProductName: string;
  dataSource: CreateProductManagementDto = null;
  title: string = 'Create product';
  buttonTitle: string = 'Create';
  buttonImage: string = 'Upload Image';
  defaultAvatar: string = "assets/img/default-avatar.png";
  imageUrl: any = null;
  carouselImages: ImageDto[] = null;
  imageFiles: any = null;
  difficultyList: number[] = [1, 2, 3, 4, 5];
  tagList: string[] = [];
  bodyFocusList: string[] = [];
  statusList: any = [
    {
      id: true,
      value: 'Active'
    },
    {
      id: false,
      value: 'Disabled'
    },
  ];

  managementFormGroup = new FormGroup({
    productName: new FormControl('', [
      Validators.required
    ]),
    weight: new FormControl('', [
      Validators.required
    ]),
    difficulty: new FormControl('', [
      Validators.required
    ]),
    userMaxWeight: new FormControl(''),
    languageSupport: new FormControl(''),
    price: new FormControl('',
      [
        Validators.required
      ]),
    importDate: new FormControl('',
      [
        Validators.required
      ]),
    importOriginal: new FormControl('', [
      Validators.required
    ]),
    importQuantity: new FormControl('', [
      Validators.required
    ]),
    importPrice: new FormControl('', [
      Validators.required
    ]),
    country: new FormControl('', [
      Validators.required
    ]),
    company: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl(),
    bodyFocus: new FormControl([], [
      Validators.required
    ]),
    tag: new FormControl([], [
      Validators.required
    ]),
  });

  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private productManagementService: ProductManagementService) {
    let currentUrl = router.url;
    if (!currentUrl.includes('create')) {
      commonService.displaySpinner();
      activateRoute.params
        .subscribe(x => {
          this.getProduct(x.productId);
        });
    }
  }

  ngOnInit(): void {
    this.getInitList();
  }

  upload(target: any) {
    this.loadImage(target);
    this.imageFiles = target.files;
  }

  private loadImage(target: any) {
    var reader = new FileReader();
    reader.readAsDataURL(target.files[0]);

    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
  }

  submitEvent() {
    if (this.dataSource == null) {
      this.createEvent();
    }
    else {
      this.updateEvent();
    }
  }

  uploadImage() {
    this.commonService.displaySpinner();

    let file = this.imageFiles;

    const formData = new FormData();

    for (const imageData of file) {
      formData.append('fileImages', imageData);
    }

    formData.append('userId', this.authService.getUserId());

    this.productManagementService.uploadProductImage(formData, this.productId)
      .subscribe(x => {
        if (x) {
          this.commonService.distroySpinner();
          this.commonService.displaySnackBar('Upload image success', 'Close');
          if (this.dataSource != null) {
            this.getProduct(this.productId);
            this.imageFiles = null;
            this.imageUrl = null;
          }
        }
      });
  }

  deleteImage(publicId: string) {
    this.commonService.displaySpinner();
    this.productManagementService.deleteImage(publicId)
      .subscribe(x => {
        if (x.body == true) {
          this.commonService.displaySnackBar('Delete image success', 'Close');
          this.getProduct(this.productId);
          this.commonService.distroySpinner();
        }
      });
  }

  private getProduct(productId: number) {
    this.productManagementService.getProductById(productId)
      .subscribe(b => {
        this.commonService.distroySpinner();
        this.dataSource = b.body;
        this.originalProductName = b.body.productName;
        this.productId = b.body.productId;
        this.title = this.dataSource == null ? 'Create Product' : 'Update Product';
        this.buttonTitle = this.dataSource == null ? 'Create' : 'Update';
        this.carouselImages = b.body.images;
        this.setFormValue(b.body);
      });
  }

  private setFormValue(model: CreateProductManagementDto) {
    this.managementFormGroup.setValue({
      productName: model.productName,
      weight: model.weight,
      difficulty: model.difficulty,
      userMaxWeight: model.userMaxWeight,
      languageSupport: model.languageSupport,
      price: model.price,
      importDate: formatDate(model.importDate, "yyyy-MM-dd", "en"),
      importOriginal: model.importOriginal,
      importQuantity: model.importQuantity,
      importPrice: model.importPrice,
      country: model.country,
      company: model.company,
      description: model.description,
      bodyFocus: model.bodyFocus,
      tag: model.tag
    });
  }

  private createEvent() {
    this.commonService.displaySpinner();
    let userid = this.authService.getUserId();

    let model: CreateProductManagementDto = {
      productName: this.managementFormGroup.value['productName'],
      weight: this.managementFormGroup.value['weight'],
      userMaxWeight: this.managementFormGroup.value['userMaxWeight'],
      difficulty: this.managementFormGroup.value['difficulty'],
      languageSupport: this.managementFormGroup.value['languageSupport'],
      price: this.managementFormGroup.value['price'],
      bodyFocus: this.managementFormGroup.value['bodyFocus'],
      tag: this.managementFormGroup.value['tag'],
      importDate: this.managementFormGroup.value['importDate'],
      importOriginal: this.managementFormGroup.value['importOriginal'],
      importQuantity: this.managementFormGroup.value['importQuantity'],
      importPrice: this.managementFormGroup.value['importPrice'],
      country: this.managementFormGroup.value['country'],
      company: this.managementFormGroup.value['company'],
      description: this.managementFormGroup.value['description'],
      userId: userid
    };

    this.productManagementService.createProduct(model)
      .subscribe(b => {
        if (b) {
          this.commonService.distroySpinner();
          this.commonService.displaySnackBar('Create product success', 'Close');
          this.productId = b.body;
        }
      });
  }

  private updateEvent() {
    this.commonService.displaySpinner();
    let userid = this.authService.getUserId();
    let model: CreateProductManagementDto = {
      productId: this.productId,
      productName: this.managementFormGroup.value['productName'],
      weight: this.managementFormGroup.value['weight'],
      userMaxWeight: this.managementFormGroup.value['userMaxWeight'],
      difficulty: this.managementFormGroup.value['difficulty'],
      languageSupport: this.managementFormGroup.value['languageSupport'],
      price: this.managementFormGroup.value['price'],
      bodyFocus: this.managementFormGroup.value['bodyFocus'],
      tag: this.managementFormGroup.value['tag'],
      importDate: this.managementFormGroup.value['importDate'],
      importOriginal: this.managementFormGroup.value['importOriginal'],
      importQuantity: this.managementFormGroup.value['importQuantity'],
      importPrice: this.managementFormGroup.value['importPrice'],
      country: this.managementFormGroup.value['country'],
      company: this.managementFormGroup.value['company'],
      description: this.managementFormGroup.value['description'],
      userId: userid
    };
    this.productManagementService.updateProduct(model)
      .subscribe(b => {
        if (b.body && b.body == true) {
          this.commonService.distroySpinner();
          this.commonService.displaySnackBar('Update product success', 'Close');
          this.getProduct(this.productId);
        }
      });
  }

  backEvent() {
    window.location.href = 'http://localhost:4200/management/product';
  }

  validateProductName() {
    let value = this.managementFormGroup.value['productName'];
    if (value == '' || value == null || value == this.originalProductName) {
      return;
    }
    this.productManagementService.checkProductExist(value)
      .subscribe(x => {
        if (x.body) {
          debugger
          this.commonService.displaySnackBar('Product name exist', 'Close');
          this.managementFormGroup.controls['productName'].setErrors({ serverValidationError: true });
        }
      });
  }

  private getInitList() {
    this.categoryService.getAllTag()
      .subscribe(b => this.tagList = b.body);

    this.categoryService.getAllBodyFocus()
      .subscribe(b => this.bodyFocusList = b.body);
  }
}
