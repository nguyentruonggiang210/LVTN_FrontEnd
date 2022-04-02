import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserManagementDto } from 'src/app/models/admin/CreateUserManagementDto';
import { UserManagementDto } from 'src/app/models/admin/UserManagementDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { UserInfoDto } from 'src/app/models/UserInfoDto';
import { environment } from 'src/environments/environment';
import { OdataResponse } from '../../models/OdataResponse';
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private httpClient: HttpClient) { }

  getAllUser(filter: string) {
    return this.httpClient.get<OdataResponse<UserManagementDto[]>>(environment.apiUrl + 'UserManagement/' + filter);
  }

  deleteUser(userNames: string[]) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'UserManagement', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: {
        userNames: userNames
      }
    });
  }

  createUser(model: CreateUserManagementDto) {
    return this.httpClient.post<BaseResponse<boolean>>(`${environment.apiUrl}UserManagement`, model);
  }

  getUserByUserName(userName: string) {
    return this.httpClient.get<BaseResponse<CreateUserManagementDto>>(environment.apiUrl + 'UserManagement/' + userName);
  }

  updateUser(model: CreateUserManagementDto) {
    return this.httpClient.put<BaseResponse<boolean>>(`${environment.apiUrl}UserManagement`, model);
  }
}
