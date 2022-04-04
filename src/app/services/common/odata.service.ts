import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CategoryOdata } from 'src/app/models/odata/CategoryOdata';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class OdataService {
  constructor(
    private http: HttpClient,
    private commonService: CommonService) { }

  addFilterEqual(key: string, value: string, isString: boolean = false): string {
    if (value) {
      if (isString) {
        return `and ${key} eq '${value}'`;
      }
      return `and ${key} eq ${value}`;
    }
    return '';
  }

  addFilterIn(key: string, value: any): string {
    let tempVal = '';
    for (const v of value) {
      tempVal += `and contains(${key}, '${v}') `;
    }
    return tempVal;
  }

  addFilterOr(key: string, value: any): string {
    let tempVal = '';
    for (const v of value) {
      tempVal += `or contains(${key}, '${v}') `;
    }
    return tempVal;
  }

  addFilterBetween(key: string, fromVal: string, toVal: string): string {
    if (fromVal && toVal) {
      return `and ${key} ge ${fromVal} and ${key} le ${toVal}`;
    }
    return '';
  }

  addFilterLessThanEqual(key: string, value: string): string {
    if (value) {
      return `and ${key} le ${value}`;
    }
    return '';
  }

  addFilterGreaterThanEqual(key: string, value: string): string {
    if (value) {
      return `and ${key} ge ${value}`;
    }
    return '';
  }

  sortBy(key: string, isDesc: boolean) {
    return `&$orderby=${key} ${isDesc ? "desc" : "asc"}`;
  }

  queryObject<T>(filterUrl: string) {
    return this.http.get<T>(environment.apiUrl + filterUrl);
  }

  categoryQueryOjbect(model: CategoryOdata) {
    let url = `Category/${model.searchType}?$top=${model.pageSize}`;
    url += `&$skip=${model.pagePass}&$filter=`;
    url += model.searchValue;
    if (!model.isFirstTime) {
      url += model.price;
      url += model.date;
      url += model.calorie;
      url += model.tag;
      url += model.difficulty;
      url += model.bodyFocus;
      url += model.name;
      url += model.startDate;
      url += model.endDate;
      
    }
    url = this.adjustUrl(url);
    url = this.removeFilter(url);
    url += model.sort;
    console.log(url);
    this.commonService.setLocalStorage('categoryUrl', url);
    return this.queryObject<OdataResponse<CategoryDto[]>>(url);
  }

  adjustUrl(url: string): string {
    let index = url.indexOf('filter=and');
    if (index != -1) {
      return url.replace(url.substring(index + 7, index + 10), '');
    }

    index = url.indexOf('filter=   and');
    if (index != -1) {
      return url.replace(url.substring(index + 10, index + 13), '');
    }

    index = url.indexOf('filter=or');
    if (index != -1) {
      return url.replace(url.substring(index + 7, index + 10), '');
    }

    index = url.indexOf('filter=  or');
    if (index != -1) {
      return url.replace(url.substring(index + 9, index + 12), '');
    }

    return url;
  }

  removeFilter(url: string): string {
    let index = url.indexOf('&$filter=');
    if (index + 9 == url.trim().length) {
      url = url.substring(0, index);
    }

    index = url.indexOf('&$filter= and');
    if (index != -1) {
      if (index + 13 == url.trim().length) {
        url = url.substring(0, index);
      }
      else {
        url = url.substring(0, index + 9) + url.substring(index + 13, url.trim().length);
      }
    }

    index = url.indexOf('&$filter= or');
    if (index != -1) {
      if (index + 12 == url.trim().length) {
        url = url.substring(0, index);
      }
      else {
        url = url.substring(0, index + 9) + url.substring(index + 12, url.trim().length);
      }
    }

    return url;
  }
}
