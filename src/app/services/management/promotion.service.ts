import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DisplayPromotion } from 'src/app/models/admin/DisplayPromotion';
import { PromotionDto } from 'src/app/models/admin/PromotionDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { environment } from 'src/environments/environment';
import { AuthService } from '../common/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  getPromotions() {
    return this.httpClient.get<BaseResponse<PromotionDto[]>>(environment.apiUrl + "Promotion/" + this.authService.getUserId());
  }

  createPromotion(model: PromotionDto) {
    return this.httpClient.post<BaseResponse<boolean>>(environment.apiUrl + "Promotion/", model);
  }

  updatePromotion(model: PromotionDto) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + "Promotion/", model);
  }

  deletePromotion(promotionId: number) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + "Promotion/" + promotionId);
  }

  getCoursePromotion() {
    return this.httpClient.get<BaseResponse<DisplayPromotion[]>>(environment.apiUrl + "Promotion/course/" + this.authService.getUserId());
  }

  getProductPromotion() {
    return this.httpClient.get<BaseResponse<DisplayPromotion[]>>(environment.apiUrl + "Promotion/product/" + this.authService.getUserId());
  }
}
