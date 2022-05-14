import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MenuDto } from 'src/app/models/MenuDto';
import { TeacherDto } from 'src/app/models/TeacherDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { SearchDto } from 'src/app/models/SearchDto';
import { CarouselDto } from 'src/app/models/CarouselDto';
import { MeetingRoomScheduleDto } from 'src/app/models/MeetingRoomScheduleDto';
import { AuthService } from '../common/auth.service';

const maxSize = 10;

@Injectable({
  providedIn: 'root'
})

export class CarouselService {

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getCarousel(type: number) {
    return this.http.get<BaseResponse<MenuDto[]>>(environment.apiUrl + "Menu/" + type);
  }

  getSearchResult(type: number, keyword: string) {
    let params = new HttpParams({
      fromString: `maxSize=${maxSize}&type=${type}&keyWord=${keyword}`
    });

    return this.http.get<SearchDto[]>(environment.apiUrl + "Menu/search", { params: params });
  }

  getNewProduct() {
    return this.http.get<BaseResponse<CarouselDto[]>>(environment.apiUrl + "Menu/product");
  }

  getNewCourse() {
    return this.http.get<BaseResponse<CarouselDto[]>>(environment.apiUrl + "Menu/course");
  }

  geSchedule() {
    if (this.authService.getUserId() == null) {
      return null;
    }

    return this.http.get<BaseResponse<MeetingRoomScheduleDto[]>>(environment.apiUrl + "Menu/schedule/" + this.authService.getUserId());
  }
}


