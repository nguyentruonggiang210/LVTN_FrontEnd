import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OdataService<T> {
  constructor(
    private http: HttpClient) { }

  addFilterEqual(key: string, value: string): string{
    return `and ${key} eq ${value}`;
  }

  addFilterIn(key: string, value: any): string{
    let tempVal = '';
    for (const v of value) {
      tempVal += `and contains(${key}, '${v}') `;
    }
    return tempVal; 
  }

  addFilterBetween(key: string, fromVal: string, toVal: string){
    return `and ${key} ge ${fromVal} and ${key} le ${toVal}`;  
  }

  queryObject(filterUrl: string){
    return this.http.get<T>(environment.apiUrl + filterUrl);
  }

  addFilterLessThanEqual(key: string, value: string): string{
    return `and ${key} le ${value}`;
  }

  addFilterGreaterThanEqual(key: string, value: string): string{
    return `and ${key} ge ${value}`;
  }

  sortBy(key: string, isDesc: boolean){
    return `&$orderby=${key} ${isDesc ? "desc" : "asc"}`;
  }
}
