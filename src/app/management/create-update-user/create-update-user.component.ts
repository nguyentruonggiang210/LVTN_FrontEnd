import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-update-user',
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.scss']
})
export class CreateUpdateUserComponent implements OnInit {

  title: string = 'Create User';
  buttonTitle: string = 'Create';
  buttonImage: string = 'Upload Image';
  imageUrl: any = null;
  imageFile: any = null;
  defaultAvatar: string = "assets/img/default-avatar.png";
  roleList: string[] = ["Admin", "Trainer" ,"Member" ,"Shop"];
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

  managementFormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/),
    ]),
    role: new FormControl(null, [
      Validators.required
    ]),
    age: new FormControl(),
    email: new FormControl(),
    address: new FormControl(),
    gender: new FormControl(),

  }, {
    validators: this.matchPassword
  });

  constructor() { }

  ngOnInit(): void {
  }

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

  submitEvent(){
    console.log(this.managementFormGroup);
    
  }

  uploadImage(){
    // let file = this.imageFile;
    // const formData = new FormData();
    // formData.append('file', file, file.name);
    // formData.append('userName', this.dataSource.userName);
    // this.userDetailService.uploadImage(formData)
    //   .subscribe(x => {
    //     if (x) {
    //       let body = x.body;
    //       this.dataSource.avatar = body;
    //     }
    //   });
  }

}
