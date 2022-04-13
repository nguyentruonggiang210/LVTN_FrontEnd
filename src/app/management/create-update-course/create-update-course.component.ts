import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoDialogComponent } from 'src/app/components/video-dialog/video-dialog.component';
import { CourseTypeDto } from 'src/app/models/admin/CourseTypeDto';
import { CreateCourseManagementDto } from 'src/app/models/admin/CreateCourseManagementDto';
import { formatDate } from "@angular/common";
import { ImageDto } from 'src/app/models/ImageDto';
import { CategoryService } from 'src/app/services/category/category.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CourseManagementService } from 'src/app/services/management/course-management.service';
import { ProductManagementService } from 'src/app/services/management/product-management.service';
import { CreateUpdateRoomComponent } from 'src/app/components/create-update-room/create-update-room.component';
import { CreateRoomDto } from 'src/app/models/admin/CreateRoomDto';

@Component({
  selector: 'app-create-update-course',
  templateUrl: './create-update-course.component.html',
  styleUrls: ['./create-update-course.component.scss']
})
export class CreateUpdateCourseComponent implements OnInit {

  courseId?: number = null;
  dataSource: CreateCourseManagementDto = null;
  title: string = 'Create course';
  buttonTitle: string = 'Create';
  buttonImage: string = 'Upload Image';
  defaultAvatar: string = "assets/img/default-avatar.png";
  carouselImages: ImageDto[] = null;
  imageFiles: any = null;
  imageUrl: any = null;
  videoFiles: any = null;
  videoUrl: any = null;
  difficultyList: number[] = [1, 2, 3, 4, 5];
  tagList: string[] = [];
  bodyFocusList: string[] = [];
  courseTypeList: CourseTypeDto[] = [];
  roomDtos: CreateRoomDto[] = null;

  managementFormGroup = new FormGroup({
    courseName: new FormControl('', [
      Validators.required
    ]),
    startDate: new FormControl('', [
      Validators.required
    ]),
    endDate: new FormControl('', [
      Validators.required
    ]),
    teacherName: new FormControl('', [
      Validators.required
    ]),
    member: new FormControl('', [
      Validators.required
    ]),
    difficulty: new FormControl('',
      [
        Validators.required
      ]),
    courseType: new FormControl('',
      [
        Validators.required
      ]),
    price: new FormControl('',
      [
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
    private courseManagementService: CourseManagementService,
    private productManagementService: ProductManagementService,
    public dialog: MatDialog) {

    let currentUrl = router.url;

    if (!currentUrl.includes('create')) {
      activateRoute.params
        .subscribe(x => {
          commonService.displaySpinner();
          this.getCourse(x.courseId);
          this.loadRoom(x.courseId);
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

  uploadVideo(target: any) {
    this.loadVideo(target);
    this.videoFiles = target.files;
  }

  private loadVideo(target: any) {
    var reader = new FileReader();
    reader.readAsDataURL(target.files[0]);

    reader.onload = (_event) => {
      this.videoUrl = reader.result;
    }
  }

  uploadVideoToServer() {
    this.commonService.displaySpinner();

    let file = this.videoFiles;

    const formData = new FormData();
    
    formData.append('fileVideo', file[0]);

    formData.append('userId', this.authService.getUserId());

    this.courseManagementService.uploadVideo(formData, this.courseId)
      .subscribe(x => {
        if (x) {
          this.commonService.displaySnackBar('Upload video success', 'Close');
          this.commonService.distroySpinner();
        }
      });
  }

  openVideoDialog() {
    const dialogRef = this.dialog.open(VideoDialogComponent);
    dialogRef.componentInstance.videoUrl = this.videoUrl;

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateOrUpdateRoomDialog(isUpdate: boolean = false, roomId: number = null) {
    const dialogRef = this.dialog.open(CreateUpdateRoomComponent);
    let message = this.courseId + '-' + isUpdate;
    message += roomId != null ? '-' + roomId : '';
    dialogRef.componentInstance.message = message;

    dialogRef.afterClosed().subscribe(result => {
      this.loadRoom(this.courseId);
    });
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

    this.courseManagementService.uploadCourseImage(formData, this.courseId)
      .subscribe(x => {
        if (x) {
          this.commonService.distroySpinner();
          this.commonService.displaySnackBar('Upload image success', 'Close');
          if (this.dataSource != null) {
            this.getCourse(this.courseId);
            this.imageFiles = null;
            this.imageUrl = null;
          }
        }
      });
  }

  deleteImage(publicId: string) {
    this.courseManagementService.deleteImage(publicId)
      .subscribe(x => {
        if (x.body == true) {
          this.commonService.displaySnackBar('Delete image success', 'Close');
          this.getCourse(this.courseId);
        }
      });
  }

  private getCourse(courseId: number) {
    this.courseManagementService.getCourseById(courseId)
      .subscribe(b => {
        this.dataSource = b.body;
        this.courseId = b.body.courseId;
        this.title = this.dataSource == null ? 'Create Course' : 'Update Course';
        this.buttonTitle = this.dataSource == null ? 'Create' : 'Update';
        this.carouselImages = b.body.images;
        this.videoUrl = b.body.video;
        this.setFormValue(b.body);
        this.commonService.distroySpinner();
      });
  }

  private setFormValue(model: CreateCourseManagementDto) {
    this.managementFormGroup.setValue({
      courseName: model.courseName,
      courseType: model.courseType,
      difficulty: model.difficulty,
      startDate: formatDate(model.startDate, "yyyy-MM-dd", "en"),
      endDate: formatDate(model.endDate, "yyyy-MM-dd", "en"),
      price: model.price,
      teacherName: model.teacherName,
      member: model.member,
      description: model.description,
      bodyFocus: model.bodyFocus,
      tag: model.tag,
    });
  }

  private createEvent() {

    let userid = this.authService.getUserId();

    let model: CreateCourseManagementDto = {
      courseName: this.managementFormGroup.value['courseName'],
      startDate: this.managementFormGroup.value['startDate'],
      endDate: this.managementFormGroup.value['endDate'],
      difficulty: this.managementFormGroup.value['difficulty'],
      teacherName: this.managementFormGroup.value['teacherName'],
      courseType: this.managementFormGroup.value['courseType'],
      price: this.managementFormGroup.value['price'],
      bodyFocus: this.managementFormGroup.value['bodyFocus'],
      tag: this.managementFormGroup.value['tag'],
      member: this.managementFormGroup.value['member'],
      description: this.managementFormGroup.value['description'],
      userId: userid
    };

    this.courseManagementService.createCourse(model)
      .subscribe(b => {
        if (b) {
          this.commonService.displaySnackBar('Create course success', 'Close');
          this.courseId = b.body;
        }
      });
  }

  private updateEvent() {
    let userid = this.authService.getUserId();
    let model: CreateCourseManagementDto = {
      courseId: this.courseId,
      courseName: this.managementFormGroup.value['courseName'],
      startDate: this.managementFormGroup.value['startDate'],
      endDate: this.managementFormGroup.value['endDate'],
      difficulty: this.managementFormGroup.value['difficulty'],
      teacherName: this.managementFormGroup.value['teacherName'],
      courseType: this.managementFormGroup.value['courseType'],
      price: this.managementFormGroup.value['price'],
      bodyFocus: this.managementFormGroup.value['bodyFocus'],
      tag: this.managementFormGroup.value['tag'],
      member: this.managementFormGroup.value['member'],
      description: this.managementFormGroup.value['description'],
      userId: userid
    };
    this.courseManagementService.updateCourse(model)
      .subscribe(b => {
        if (b.body && b.body == true) {
          this.commonService.displaySnackBar('Update course success', 'Close');
        }
      });
  }

  deleleRoom(roomId: number) {
    this.courseManagementService.deleteRoom(roomId)
      .subscribe(x => {
        if (x && x.body) {
          this.commonService.displaySnackBar('Delete room success', 'Close');
          this.loadRoom(this.courseId);
        }
      });
  }

  backEvent() {
    window.location.href = 'http://localhost:4200/management/course';
  }

  private loadRoom(courseId: number) {
    this.courseManagementService.getRoomByCourseId(courseId)
      .subscribe(x => {
        if (x) {
          this.roomDtos = x.body;
        }
      });
  }

  private getInitList() {
    this.categoryService.getAllTag()
      .subscribe(b => this.tagList = b.body);

    this.categoryService.getAllBodyFocus()
      .subscribe(b => this.bodyFocusList = b.body);

    this.courseManagementService.getCourseType()
      .subscribe(b => this.courseTypeList = b.body);
  }
}
