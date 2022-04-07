import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Model } from 'angular-odata';
import { CreateRoomDto } from 'src/app/models/admin/CreateRoomDto';
import { UserCourseDto } from 'src/app/models/admin/UserCourseDto';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CourseManagementService } from 'src/app/services/management/course-management.service';

@Component({
  selector: 'app-create-update-room',
  templateUrl: './create-update-room.component.html',
  styleUrls: ['./create-update-room.component.scss']
})
export class CreateUpdateRoomComponent implements OnInit {

  dropdownSettings = {};
  buttonTitle: string = 'Create';
  title: string = 'Create Room';
  isUpdate: boolean = false;
  courseId: number;
  roomId?: number = null;
  dataSource: CreateRoomDto = null;
  userCourseDtos: UserCourseDto[] = null;

  public message: string;
  roomFormGroup = new FormGroup({
    maxMember: new FormControl('', [
      Validators.required
    ]),
    startTime: new FormControl('', [
      Validators.required
    ]),
    endTime: new FormControl('', [
      Validators.required
    ]),
    userIds: new FormControl([]),
  });

  constructor(private commonService: CommonService,
    public dialogRef: MatDialogRef<CreateUpdateRoomComponent>,
    private authService: AuthService,
    private courseManagementService: CourseManagementService) { }

  ngOnInit(): void {
    let splitData = this.message.split('-');
    this.courseId = Number(splitData[0]);
    this.isUpdate = splitData[1] == "true";
    if (this.isUpdate) {
      this.roomId = Number(splitData[2]);
      this.getData();
    }
  }

  submitEvent() {
    if (this.dataSource == null) {
      this.createRoom();
    }
    else {
      this.updateRoom();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private getData() {
    this.buttonTitle = this.isUpdate ? 'Update' : 'Create';
    this.title = this.isUpdate ? 'Update Room' : 'Create Room';
    console.log(this.isUpdate);

    this.courseManagementService.getRoomById(this.roomId)
      .subscribe(x => {
        if (x) {
          this.dataSource = x.body;
          this.bindDataToForm(x.body)
        }
      })

    this.courseManagementService.getUserInCourse(this.courseId)
      .subscribe(x => {
        if (x) {
          this.userCourseDtos = x.body;
        }
      })
  }

  private bindDataToForm(model: CreateRoomDto) {
    this.roomFormGroup.setValue({
      maxMember: model.maxMember,
      startTime: model.startTime,
      endTime: model.endTime,
      userIds: model.userIds
    });
  }

  private createRoom() {
    let userId = this.authService.getUserId();
    let model: CreateRoomDto = {
      maxMember: this.roomFormGroup.value["maxMember"],
      startTime: this.roomFormGroup.value["startTime"],
      endTime: this.roomFormGroup.value["endTime"],
      userIds: null,
      courseId: this.courseId,
      userId: userId
    };

    this.courseManagementService.createRoom(model)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar('Create room success', 'Close');
          this.closeDialog();
        }
      });
  }

  private updateRoom() {
    let userId = this.authService.getUserId();
    let model: CreateRoomDto = {
      maxMember: this.roomFormGroup.value["maxMember"],
      roomId: this.roomId,
      startTime: this.roomFormGroup.value["startTime"],
      endTime: this.roomFormGroup.value["endTime"],
      userIds: this.roomFormGroup.value["userIds"],
      courseId: this.courseId,
      userId: userId
    };

    this.courseManagementService.updateRoom(model)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar('Update room success', 'Close');
          this.closeDialog();
        }
      });
  }
}
