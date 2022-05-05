import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillDto } from 'src/app/models/admin/BillDto';
import { CourseManagementDto } from 'src/app/models/admin/CourseManagementDto';
import { CourseTypeDto } from 'src/app/models/admin/CourseTypeDto';
import { CreateCourseManagementDto } from 'src/app/models/admin/CreateCourseManagementDto';
import { CreateRoomDto } from 'src/app/models/admin/CreateRoomDto';
import { StatisticUserDto } from 'src/app/models/admin/StatisticUserDto';
import { UserCourseDto } from 'src/app/models/admin/UserCourseDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { ImageDto } from 'src/app/models/ImageDto';
import { environment } from 'src/environments/environment';
import { OdataResponse } from '../../models/OdataResponse';
import { AuthService } from '../common/auth.service';
@Injectable({
  providedIn: 'root'
})
export class CourseManagementService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  getAllCourse(filter: string) {
    return this.httpClient.get<OdataResponse<CourseManagementDto[]>>(environment.apiUrl + 'CourseManagement/' + filter);
  }

  createCourse(model: CreateCourseManagementDto) {
    return this.httpClient.post<BaseResponse<number>>(environment.apiUrl + 'CourseManagement/', model);
  }

  updateCourse(model: CreateCourseManagementDto) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/', model);
  }

  uploadCourseImage(formData: FormData, courseId: number) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/image/' + courseId, formData);
  }

  uploadVideo(formData: FormData, courseId: number) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/video/' + courseId, formData);
  }

  getCourseType() {
    return this.httpClient.get<BaseResponse<CourseTypeDto[]>>(environment.apiUrl + 'CourseManagement/course-type');
  }

  getCourseById(courseId: number) {
    return this.httpClient.get<BaseResponse<CreateCourseManagementDto>>(environment.apiUrl + 'CourseManagement/' + courseId);
  }

  deleteImage(publicId: string) {
    var encodedUrl = encodeURIComponent(publicId);
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/image/' + encodedUrl);
  }

  getImages(productId: number) {
    return this.httpClient.get<BaseResponse<ImageDto[]>>(environment.apiUrl + 'CourseManagement/image/' + productId);
  }

  createRoom(model: CreateRoomDto) {
    return this.httpClient.post<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/room/', model);
  }

  updateRoom(model: CreateRoomDto) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/room/', model);
  }

  getRoomByCourseId(courseId: number) {
    return this.httpClient.get<BaseResponse<CreateRoomDto[]>>(environment.apiUrl + 'CourseManagement/room/' + courseId);
  }

  getRoomById(roomId: number) {
    return this.httpClient.get<BaseResponse<CreateRoomDto>>(environment.apiUrl + 'CourseManagement/room-detail/' + roomId);
  }

  deleteRoom(roomId: number) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/room/' + roomId);
  }

  getUserInCourse(courseId: number) {
    return this.httpClient.get<BaseResponse<UserCourseDto[]>>(environment.apiUrl + 'CourseManagement/user-room/' + courseId);
  }

  getBoughtCourseByMonth() {
    return this.httpClient.get<BaseResponse<StatisticUserDto[]>>(environment.apiUrl + 'CourseManagement/bought-by-month/' + this.authService.getUserName());
  }

  getCreateCourseByMonth() {
    return this.httpClient.get<BaseResponse<StatisticUserDto[]>>(environment.apiUrl + 'CourseManagement/create-by-month/' + this.authService.getUserName());
  }

  getTurnOverCourseByMonth() {
    return this.httpClient.get<BaseResponse<StatisticUserDto[]>>(environment.apiUrl + 'CourseManagement/turnover-by-month/' + this.authService.getUserName());
  }

  checkCourseExist(courseName: string) {
    return this.httpClient.get<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/name-exist/' + courseName);
  }

  getBills() {
    return this.httpClient.get<BaseResponse<BillDto[]>>(environment.apiUrl + 'CourseManagement/bill/' + this.authService.getUserName());
  }

  deleteOneCourse(courseId: number) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement/' + courseId);
  }

  deleteCourse(courseIds: number[]) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'CourseManagement', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: {
        courseIds: courseIds
      }
    });
  }
}
