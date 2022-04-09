import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { RoomValidateDto } from 'src/app/models/RoomValidateDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private httpClient: HttpClient) { }

  public validateCourse(id: number, userId: string) {
    return this.httpClient.post<BaseResponse<RoomValidateDto>>(environment.apiUrl + 'CourseManagement/validate/' + id + '/' + userId, null);
  }
}
