import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { ProductDto } from 'src/app/models/ProductDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(private httpClient: HttpClient) { }

  getProductDetail(productId: number){
    return this.httpClient.get<BaseResponse<ProductDto>>(environment.apiUrl + "Detail/product/" + productId);
  }
}
