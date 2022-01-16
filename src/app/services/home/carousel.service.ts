import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuDto } from 'src/app/models/MenuDto';
import { TeacherDto } from 'src/app/models/TeacherDto';
import { BaseResponse } from 'src/app/models/BaseResponse';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private http: HttpClient) { }

  getCarousel(type: number)
  {
    return this.http.get<BaseResponse<MenuDto[]>>(environment.apiUrl + "Menu/" + type);
  }

  getHotTeacher()
  {
    return this.http.get<BaseResponse<TeacherDto>>(environment.apiUrl + "Menu/teacher");
  }
}
