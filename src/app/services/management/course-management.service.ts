import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseManagementDto } from 'src/app/models/admin/CourseManagementDto';
import { CourseTypeDto } from 'src/app/models/admin/CourseTypeDto';
import { CreateCourseManagementDto } from 'src/app/models/admin/CreateCourseManagementDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { environment } from 'src/environments/environment';
import { OdataResponse } from '../../models/OdataResponse';
@Injectable({
  providedIn: 'root'
})
export class CourseManagementService {

  constructor(private httpClient: HttpClient) { }

  getAllCourse(filter: string) {
    return this.httpClient.get<OdataResponse<CourseManagementDto[]>>(environment.apiUrl + 'CourseManagement/' + filter);
  }

  createCourse(model: CreateCourseManagementDto) {
    return this.httpClient.post<BaseResponse<number>>(environment.apiUrl + 'CourseManagement/', model);
  }

  uploadCourseImage(formData: FormData, courseId: number) {
    return this.httpClient.put<BaseResponse<string>>(environment.apiUrl + 'CourseManagement/image/' + courseId, formData);
  }

  uploadVideo(formData: FormData, courseId: number) {
    return this.httpClient.put<BaseResponse<string>>(environment.apiUrl + 'CourseManagement/video/' + courseId, formData);
  }

  getCourseType() {
    return this.httpClient.get<BaseResponse<CourseTypeDto[]>>(environment.apiUrl + 'CourseManagement/course-type');
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
