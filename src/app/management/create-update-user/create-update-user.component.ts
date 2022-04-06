import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateUserManagementDto } from 'src/app/models/admin/CreateUserManagementDto';
import { UserDetailService } from 'src/app/services/detail/user-detail.service';
import { UserManagementService } from 'src/app/services/management/user-management.service';

@Component({
  selector: 'app-create-update-user',
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.scss']
})
export class CreateUpdateUserComponent implements OnInit {

  dataSource: CreateUserManagementDto = null;
  title: string = 'Create User';
  buttonTitle: string = 'Create';
  buttonImage: string = 'Upload Image';
  defaultAvatar: string = "assets/img/default-avatar.png";
  imageUrl: any = this.defaultAvatar;
  imageFile: any = null;
  roleList: string[] = ["Admin", "Trainer", "Member", "Shop"];
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
    userName: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      this.dataSource ? Validators.required : Validators.maxLength(2500),
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)
    ]),
    confirmPassword: new FormControl('', [
      this.dataSource ? Validators.required : Validators.maxLength(2500),
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/),
    ]),
    role: new FormControl(null, [
      Validators.required
    ]),
    age: new FormControl(),
    email: new FormControl(),
    address: new FormControl(),
    gender: new FormControl(),
    status: new FormControl()
  }, {
    validators: this.matchPassword
  });

  constructor(private userManagementService: UserManagementService,
    private userDetailService: UserDetailService,
    private snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    private router: Router) {
    let currentUrl = router.url;
    if (!currentUrl.includes('create')) {
      activateRoute.params
        .subscribe(x => {
          this.getUser(x.userName);
        });
    }
  }

  ngOnInit(): void { }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password").value;
    const confirm = control.get("confirmPassword").value;
    return (password != confirm) ? { 'confirm': true } : null;
  }

  upload(target: any) {
    let file = target.files[0];
    this.loadImage(target);
    this.imageFile = file;
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
    let file = this.imageFile;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userName', this.dataSource.userName);
    this.userDetailService.uploadImage(formData)
      .subscribe(x => {
        if (x) {
          let body = x.body;
          this.dataSource.avatar = body;
        }
      });
  }

  private getUser(userName: string) {
    this.userManagementService.getUserByUserName(userName)
      .subscribe(b => {
        this.dataSource = b.body;
        this.imageFile = b.body.avatar != null && b.body.avatar != '' ? b.body.avatar : this.defaultAvatar;
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
    let model: CreateUserManagementDto = {
      userName: this.managementFormGroup.value['userName'],
      name: this.managementFormGroup.value['name'],
      password: this.managementFormGroup.value['password'],
      confirmPassword: this.managementFormGroup.value['confirmPassword'],
      age: this.managementFormGroup.value['age'] ?? 0,
      email: this.managementFormGroup.value['email'] ?? '',
      address: this.managementFormGroup.value['address'] ?? '',
      gender: this.managementFormGroup.value['gender'] ?? 0,
      status: true,
      roleNames: this.managementFormGroup.value['role'],
      avatar: ''
    };

    this.userManagementService.createUser(model)
      .subscribe(body => {
        if (body) {
          this.snackBar.open('Create user success', 'Close');
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
    window.location.href = 'http://localhost:4200/management/user';
  }
}
