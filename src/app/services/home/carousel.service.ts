import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { MenuDto } from 'src/app/models/MenuDto';
import { TeacherDto } from 'src/app/models/TeacherDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { SearchDto } from 'src/app/models/SearchDto';

const maxSize = 10;

@Injectable({
  providedIn: 'root'
})

export class CarouselService {

  constructor(private http: HttpClient) { }

  getCarousel(type: number)
  {
    return this.http.get<BaseResponse<MenuDto[]>>(environment.apiUrl + "Menu/" + type);
  }

  getSearchResult(type: number, keyword: string){
    let params = new HttpParams({
      fromString:`maxSize=${maxSize}&type=${type}&keyWord=${keyword}`
    });
    
    return this.http.get<SearchDto[]>(environment.apiUrl + "Menu/search", { params: params });
  }
}


