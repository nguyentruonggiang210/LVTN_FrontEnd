import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CourseOderDto } from 'src/app/models/CourseOderDto';

@Component({
  selector: 'app-order-form-dialog',
  templateUrl: './order-form-dialog.component.html',
  styleUrls: ['./order-form-dialog.component.scss']
})
export class OrderFormDialogComponent implements OnInit {

  public courseOderDto?: CourseOderDto[];

  orderFormGroup = new FormGroup({
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    ]),
    address: new FormControl('', [
      Validators.required,
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(public dialogRef: MatDialogRef<OrderFormDialogComponent>) { }

  ngOnInit(): void {
  }

  submitEvent() {
    this.dialogRef.close(this.orderFormGroup);
  }

  closeDialogEvent() {
    this.dialogRef.close();
  }
}
