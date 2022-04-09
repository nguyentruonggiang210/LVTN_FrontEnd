import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    let userId = this.authService.getUserId();

    return this.httpClient.get<BaseResponse<PromotionDto[]>>(environment.apiUrl + "Promotion/" + userId);
  }
}
