import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getAllProduct(filterString: string){
    return this.httpClient.get(environment.apiUrl + "Category/product" + filterString);
  }  

  getAllCourse(filterString: string){
    return this.httpClient.get(environment.apiUrl + "Category/course" + filterString);
  }

  getAllTrainer(filterString: string){
    return this.httpClient.get(environment.apiUrl + "Category/trainer" + filterString);
  }
}
