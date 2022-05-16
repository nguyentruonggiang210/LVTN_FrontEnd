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
import { BillDetailComponent } from 'src/app/components/bill-detail/bill-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { BillDto } from 'src/app/models/admin/BillDto';
import { PageEvent } from '@angular/material/paginator';

const DialogMessage = "Update successfull";
const ActionString = "Close";
const DefaultAvatar = "assets/img/my-default-avatar.png";


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  take: number = 10;
  billTotal: number;
  billSkip: number = 0;
  originalBillDataSource: BillDto[] = [];
  billDataSource: BillDto[] = [];

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
    private commonService: CommonService,
    private authService: AuthService,
    private dialog: MatDialog) { }

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
          this.commonService.displaySnackBar(DialogMessage, ActionString);
        }
      });
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
    return this.dataSource?.avatar == null || this.dataSource?.avatar === '' ? DefaultAvatar : this.dataSource?.avatar;
  }

  openDetaiBilllDialog(id: number) {
    var billDetailData = this.dataSource?.bills?.find(x => x.billId == id);
    const dialogRef = this.dialog.open(BillDetailComponent, {
      minWidth: '500px',
      width: '80%'
    });

    dialogRef.componentInstance.data = JSON.stringify(billDetailData.details);
  }

  getBillPaginatorData(event?: PageEvent) {
    this.billSkip = event.pageIndex * this.take;
    this.billDataSource = this.originalBillDataSource.slice(this.billSkip, this.take + this.billSkip);
  }

  private getUserDetail() {
    this.userDetailService.getUserInf(this.authService.getUserName())
      .subscribe(user => {
        if (user) {
          // set value 
          let body = user.body;
          this.dataSource = body;
          this.billTotal = body?.bills.length;
          this.billDataSource = body?.bills.slice(this.billSkip, this.take);
          this.originalBillDataSource = body?.bills;
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
