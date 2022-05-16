import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { PaymentDto } from 'src/app/models/PaymentDto';
import { ProductDto } from 'src/app/models/ProductDto';
import { ValidPromotion } from 'src/app/models/ValidPromotion';
import { environment } from 'src/environments/environment';
import { AuthService } from '../common/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  uploadPayment(model: PaymentDto) {
    return this.httpClient.post<BaseResponse<boolean>>(`${environment.apiUrl}Payment`, model);
  }

  validatePromotionPayment(model: ValidPromotion[]) {
    return this.httpClient.post<BaseResponse<boolean>>(`${environment.apiUrl}Payment/validate-promotion/`, model);
  }

  updateBillStatus(billId: number, status: boolean) {
    return this.httpClient.get<BaseResponse<boolean>>(`${environment.apiUrl}Payment/${billId}/${status}/${this.authService.getUserName()}`);
  }
}
