import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProductManagementDto } from 'src/app/models/admin/CreateProductManagementDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { ProductManagementDto } from 'src/app/models/ProductManagementDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(private httpClient: HttpClient) { }

  getAllProduct(filter: string) {
    return this.httpClient.get<OdataResponse<ProductManagementDto[]>>(environment.apiUrl + "ProductManagement/" + filter);
  }

  createProduct(model: CreateProductManagementDto) {
    return this.httpClient.post<BaseResponse<number>>(environment.apiUrl + "ProductManagement/", model);
  }

  uploadProductImage(formData: FormData, productId: number) {
    return this.httpClient.put<BaseResponse<string>>(environment.apiUrl + 'ProductManagement/image/' + productId, formData);
  }
}
