import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { UserInfoDto } from 'src/app/models/UserInfoDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  constructor(private httpClient: HttpClient) { }

  getUserInf(userName: string) {
    return this.httpClient.get<BaseResponse<UserInfoDto>>(environment.apiUrl + 'User/' + userName);
  }

  updateUserInf(model: UserInfoDto){
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'User/', model);
  }

  uploadImage(formData: FormData) {
    return this.httpClient.put<BaseResponse<string>>(environment.apiUrl + 'User/image', formData);
  }
}
