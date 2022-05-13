import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { CommentDto } from 'src/app/models/CommentDto';
import { CourseDto } from 'src/app/models/CourseDto';
import { ProductDto } from 'src/app/models/ProductDto';
import { SendCommentDto } from 'src/app/models/SendCommentDto';
import { environment } from 'src/environments/environment';
import { AuthService } from '../common/auth.service';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  getProductDetail(productId: number) {
    return this.httpClient.get<BaseResponse<ProductDto>>(environment.apiUrl + "Detail/product/" + productId);
  }

  getProductRecommendation(userId: string, productId: number) {
    if(this.authService.getUserName() == null){
      return null;
    }
    return this.httpClient.get<BaseResponse<CategoryDto[]>>(`${environment.apiUrl}Detail/product/recommendation/${this.authService.getUserName()}/${productId}`);
  }

  getProductComment(productId: number) {
    return this.httpClient.get<BaseResponse<CommentDto[]>>(environment.apiUrl + "Detail/product/comment/" + productId);
  }

  sendProductComment(model: SendCommentDto) {
    return this.httpClient.post<BaseResponse<boolean>>(environment.apiUrl + "Detail/product/comment", model);
  }

  getCourseDetail(courseId: number) {
    return this.httpClient.get<BaseResponse<CourseDto>>(environment.apiUrl + "Detail/course/" + courseId);
  }

  getCourseComment(courseId: number) {
    return this.httpClient.get<BaseResponse<CommentDto[]>>(environment.apiUrl + "Detail/course/comment/" + courseId);
  }

  sendCourseComment(model: SendCommentDto) {
    return this.httpClient.post<BaseResponse<boolean>>(environment.apiUrl + "Detail/course/comment", model);
  }
}
