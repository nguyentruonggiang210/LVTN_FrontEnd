import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-notify',
  templateUrl: './delete-notify.component.html',
  styleUrls: ['./delete-notify.component.scss']
})
export class DeleteNotifyComponent implements OnInit {
  public data: string;

  signalYes: string = 'Y';
  signalNo: string = 'N';
  constructor(
    public dialogRef: MatDialogRef<DeleteNotifyComponent>) { }

  ngOnInit(): void {
  }

  closeDialogEvent(signal: string): void {
    this.dialogRef.close(signal);
  }
}
