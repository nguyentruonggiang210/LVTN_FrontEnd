import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProductManagementDto } from 'src/app/models/admin/CreateProductManagementDto';
import { StatisticUserDto } from 'src/app/models/admin/StatisticUserDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { ImageDto } from 'src/app/models/ImageDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { ProductManagementDto } from 'src/app/models/ProductManagementDto';
import { environment } from 'src/environments/environment';
import { AuthService } from '../common/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  checkShopExist() {
    return this.httpClient.get<BaseResponse<boolean>>(environment.apiUrl + "ProductManagement/" + 'shop-exist/' + this.authService.getUserId());
  }

  getAllProduct(filter: string) {
    return this.httpClient.get<OdataResponse<ProductManagementDto[]>>(environment.apiUrl + "ProductManagement/" + filter);
  }

  createProduct(model: CreateProductManagementDto) {
    return this.httpClient.post<BaseResponse<number>>(environment.apiUrl + "ProductManagement/", model);
  }

  updateProduct(model: CreateProductManagementDto) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + "ProductManagement/", model);
  }

  uploadProductImage(formData: FormData, productId: number) {
    return this.httpClient.put<BaseResponse<boolean>>(environment.apiUrl + 'ProductManagement/image/' + productId, formData);
  }

  getProductById(productId: number) {
    return this.httpClient.get<BaseResponse<CreateProductManagementDto>>(environment.apiUrl + 'ProductManagement/' + productId);
  }

  deleteImage(publicId: string) {
    var encodedUrl = encodeURIComponent(publicId);
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'ProductManagement/image/' + encodedUrl);
  }

  getImages(productId: number) {
    return this.httpClient.get<BaseResponse<ImageDto[]>>(environment.apiUrl + 'ProductManagement/image/' + productId);
  }

  getBoughtProductByMonth() {
    return this.httpClient.get<BaseResponse<StatisticUserDto[]>>(environment.apiUrl + 'ProductManagement/bought-by-month/' + this.authService.getUserName());
  }

  getProductImportByMonth() {
    return this.httpClient.get<BaseResponse<StatisticUserDto[]>>(environment.apiUrl + 'ProductManagement/import-by-month/' + this.authService.getUserName());
  }

  getProductTurnOverByMonth() {
    return this.httpClient.get<BaseResponse<StatisticUserDto[]>>(environment.apiUrl + 'ProductManagement/turnover-by-month/' + this.authService.getUserName());
  }

  checkProductExist(productName: string) {
    return this.httpClient.get<BaseResponse<boolean>>(environment.apiUrl + 'ProductManagement/name-exist/' + productName);
  }

  deleteOneProduct(productId: number) {
    return this.httpClient.delete<BaseResponse<boolean[]>>(environment.apiUrl + 'ProductManagement/' + productId);
  }

  deleteProduct(productIds: number[]) {
    return this.httpClient.delete<BaseResponse<boolean>>(environment.apiUrl + 'ProductManagement', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: {
        productIds: productIds
      }
    });
  }
}
