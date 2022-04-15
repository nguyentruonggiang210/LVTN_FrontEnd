import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomOption } from 'ngx-quill';
import { GenderType } from 'src/app/enums/GenderType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoDto } from 'src/app/models/UserInfoDto';
import { UserDetailService } from 'src/app/services/detail/user-detail.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common/common.service';
import { AuthService } from 'src/app/services/common/auth.service';

const DialogMessage = "Update successfull";
const ActionString = "Close";
const DefaultAvatar = "assets/img/my-default-avatar.png";


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  genderArray: any = Object.values(GenderType)
    .filter(value => typeof value === "string")
    .map((value, index) => ({ value: value as string, index: index }));
  richTextEditor: string;
  selectedValue: number = 1;
  dataSource: UserInfoDto;
  options: CustomOption[] = [
    {
      import: "attributors/style/size",
      whitelist: void 0
    }
  ];
  snackBarTimeout: any;
  userForm = new FormGroup({
    userId: new FormControl(),
    userName: new FormControl(),
    name: new FormControl(),
    email: new FormControl(),
    age: new FormControl(),
    address: new FormControl(),
    description: new FormControl(),
    gender: new FormControl(),
  });

  constructor(private userDetailService: UserDetailService,
    private snackBar: MatSnackBar,
    private location: Location,
    private commonService: CommonService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserDetail();
  }

  updateUserInfo(): void {
    let model: UserInfoDto = {
      userId: this.dataSource.userId,
      userName: this.dataSource.userName,
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
      age: this.userForm.get('age').value,
      address: this.userForm.get('address').value,
      description: this.userForm.get('description').value,
      gender: this.userForm.get('gender').value,
    };

    this.userDetailService.updateUserInf(model)
      .subscribe(x => {
        if (x && x.body == true) {
          clearTimeout(this.snackBarTimeout);
          this.snackBar.open(DialogMessage, ActionString);
          this.snackBarTimeout = setTimeout(() => {
            this.snackBar.dismiss();
          }, 3000);
        }
      });
    console.log(this.userForm.get('description').value);
  }

  upload(target: any) {
    let file = target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('userName', this.dataSource.userName);
    this.userDetailService.uploadImage(formData)
      .subscribe(x => {
        if (x) {
          let body = x.body;
          this.dataSource.avatar = body;
          this.commonService.displaySnackBar('Upload image success', 'Close');
        }
      });
  }

  handlerDisplayImage() {
    return this.dataSource.avatar == null || this.dataSource.avatar === '' ? DefaultAvatar : this.dataSource.avatar;
  }

  private getUserDetail() {
    this.userDetailService.getUserInf(this.authService.getUserName())
      .subscribe(user => {
        if (user) {
          // set value 
          let body = user.body;
          this.dataSource = body;
          this.userForm.setValue({
            userId: body.userId,
            userName: body.userName,
            name: body.name,
            email: body.email,
            age: body.age,
            address: body.address,
            description: body.description,
            gender: body.gender
          });
          // disable user name
          this.userForm.get('userName').disable();
        }
      })
  }
}
