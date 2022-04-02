import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseManagementDto } from 'src/app/models/admin/CourseManagementDto';
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
