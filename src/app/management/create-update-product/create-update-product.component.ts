import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductManagementDto } from 'src/app/models/admin/CreateProductManagementDto';
import { CreateUserManagementDto } from 'src/app/models/admin/CreateUserManagementDto';
import { CategoryService } from 'src/app/services/category/category.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserDetailService } from 'src/app/services/detail/user-detail.service';
import { ProductManagementService } from 'src/app/services/management/product-management.service';
import { UserManagementService } from 'src/app/services/management/user-management.service';

@Component({
  selector: 'app-create-update-product',
  templateUrl: './create-update-product.component.html',
  styleUrls: ['./create-update-product.component.scss']
})
export class CreateUpdateProductComponent implements OnInit {

  permitImage: boolean = false;
  productId?: number = null;
  dataSource: CreateUserManagementDto = null;
  title: string = 'Create product';
  buttonTitle: string = 'Create';
  buttonImage: string = 'Upload Image';
  defaultAvatar: string = "assets/img/default-avatar.png";
  imageUrl: any = null;
  imageFiles: any = null;
  difficultyList: number[] = [1, 2, 3, 4, 5];
  tagList: string[] = [];
  bodyFocusList: string[] = [];
  genderList: any = [
    {
      id: 0,
      value: 'Female'
    },
    {
      id: 1,
      value: 'Male'
    },
    {
      id: 2,
      value: 'Other'
    }
  ];
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

  constructor(private userManagementService: UserManagementService,
    private userDetailService: UserDetailService,
    private snackBar: MatSnackBar,
    private router: ActivatedRoute,
    private authService: AuthService,
    private categoryService: CategoryService,
    private productManagementService: ProductManagementService) {
    router.params
      .subscribe(x => {
        this.getUser(x.userName);
      });
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
    let file = this.imageFiles;
    const formData = new FormData();
    formData.append('images', file);
    formData.append('userId', this.authService.getUserId());
    this.productManagementService.uploadProductImage(formData, this.productId)
      .subscribe(x => {
        if (x) {
          this.snackBar.open('Create product success', 'Close');
        }
      });
  }

  private getUser(userName: string) {
    this.userManagementService.getUserByUserName(userName)
      .subscribe(b => {
        this.dataSource = b.body;
        this.imageFiles = b.body.avatar != null && b.body.avatar != '' ? b.body.avatar : this.defaultAvatar;
        this.title = this.dataSource == null ? 'Create User' : 'Update User';
        this.buttonTitle = this.dataSource == null ? 'Create' : 'Update';
        this.setFormValue(b.body);
      });
  }

  private setFormValue(model: CreateUserManagementDto) {
    this.managementFormGroup.setValue({
      name: model.name,
      userName: model.userName,
      role: model.roleNames,
      age: model.age,
      email: model.email,
      address: model.address,
      gender: model.gender,
      password: '',
      confirmPassword: '',
      status: model.status
    });
  }

  private createEvent() {

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
          this.snackBar.open('Create product success', 'Close');
          this.productId = b.body;
        }
      });
  }

  private updateEvent() {
    let model: CreateUserManagementDto = {
      userName: this.managementFormGroup.value['userName'],
      name: this.managementFormGroup.value['name'],
      password: this.managementFormGroup.value['password'],
      confirmPassword: this.managementFormGroup.value['confirmPassword'],
      age: this.managementFormGroup.value['age'] ?? 0,
      email: this.managementFormGroup.value['email'] ?? '',
      address: this.managementFormGroup.value['address'] ?? '',
      gender: this.managementFormGroup.value['gender'] ?? 0,
      status: this.managementFormGroup.value['status'],
      roleNames: this.managementFormGroup.value['role'],
      avatar: ''
    };
    this.userManagementService.updateUser(model)
      .subscribe(b => {
        if (b.body && b.body == true) {
          this.snackBar.open('Update user success', 'Close');
        }
      });
  }

  backEvent() {
    window.location.href = 'http://localhost:4200/management/product';
  }

  private getInitList() {
    this.categoryService.getAllTag()
      .subscribe(b => this.tagList = b.body);

    this.categoryService.getAllBodyFocus()
      .subscribe(b => this.bodyFocusList = b.body);
  }
}
