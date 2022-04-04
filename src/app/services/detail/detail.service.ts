import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { CommentDto } from 'src/app/models/CommentDto';
import { ProductDto } from 'src/app/models/ProductDto';
import { SendCommentDto } from 'src/app/models/SendCommentDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(private httpClient: HttpClient) { }

  getProductDetail(productId: number){
    return this.httpClient.get<BaseResponse<ProductDto>>(environment.apiUrl + "Detail/product/" + productId);
  }

  getProductRecommendation(userId: string, productId: number){
    return this.httpClient.get<BaseResponse<CategoryDto[]>>(`${environment.apiUrl}Detail/product/recommendation/${userId}/${productId}`);
  }

  getProductComment(productId: number){
    return this.httpClient.get<BaseResponse<CommentDto[]>>(environment.apiUrl + "Detail/product/comment/" + productId);
  }

  sendProductComment(model: SendCommentDto){
    return this.httpClient.post<BaseResponse<boolean>>(environment.apiUrl + "Detail/product/comment", model);
  }
}
