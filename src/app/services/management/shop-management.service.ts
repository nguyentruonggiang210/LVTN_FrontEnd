import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShopDto } from 'src/app/models/admin/ShopDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { ShopDetailDto } from 'src/app/models/ShopDetailDto';
import { environment } from 'src/environments/environment';
import { AuthService } from '../common/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShopManagementService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  public getShopDetailInfo(shopId: number) {
    return this.httpClient.get<BaseResponse<ShopDetailDto>>(environment.apiUrl + "Shop/detail/" + shopId);
  }

  public getShopInfo() {
    return this.httpClient.get<BaseResponse<ShopDto>>(environment.apiUrl + "Shop/" + this.authService.getUserId());
  }

  public createShop(model: ShopDto) {
    return this.httpClient.post<BaseResponse<boolean>>(environment.apiUrl + "Shop/", model);
  }

  public updateShop(model: ShopDto) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + "Shop/", model);
  }

  public deleteShop(shopId: number) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + "Shop/" + shopId);
  }

  public uploadShopImage(formData: FormData, shopId: number) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'Shop/image/' + shopId, formData);
  }

  public checkShopNameExist(name: string) {
    return this.httpClient.get<BaseResponse<boolean>>(environment.apiUrl + 'Shop/name-exist/' + name);
  }
}
