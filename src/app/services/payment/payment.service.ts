import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { PaymentDto } from 'src/app/models/PaymentDto';
import { ProductDto } from 'src/app/models/ProductDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient) { }

  uploadPayment(model: PaymentDto) {
    return this.httpClient.put<BaseResponse<boolean>>(`${environment}Payment`, model);
  }
}
