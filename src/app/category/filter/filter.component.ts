import { Component, OnInit } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { Router, ActivatedRoute } from '@angular/router';import { SearchType } from 'src/app/enums/SearchType';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataService } from 'src/app/services/common/odata.service';

const pageSize: number = 40;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})


export class FilterComponent implements OnInit {

  dataSource: CategoryDto[];
  memberships: string[] = ['Free', 'Plush'];
  difficulties: number[] = [1, 2, 3, 4, 5,];
  bodyFocuses: string[] = ['Upper', 'Core', 'Lower', 'Total'];
  tags: string[] = ['HIIT', 'Streight Training', 'Pilates', 'Low Impact', 'Warm Up / Cool Down', 'Kickboxing', 'Yoga', 'Medicine Ball', 'Barre', 'Stretching / Flexibility', 'Toning'];
  /// filter variables
  fromPrice: number = null;
  toPrice: number = null;
  calorieMin: number = null;
  calorieMax: number = null;
  startDate: Date = null;
  endDate: Date = null;
  tag: string[] = null;
  menberShip : string[] = null;
  difficulty: number[] = null;
  bodyFocus: string[] = null;
  sortBy: string;
  searchType: string = 'product';
  private url: string = `Category/${this.searchType}?$take=${pageSize}`;
  private page: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private odataService: OdataService<CategoryDto>) 
  { }

  ngOnInit(): void {
  }

  queryDayta(){
    this.url = `Category/${this.searchType}?$take=${pageSize}`;
    // pagination
    this.url += `&$skip=${this.page}&$filter=`;
    // price
    this.url += this.priceQuery();
    // calorie
    this.url += this.dateQuery();
    // tags
    this.url += this.tagQuery();
    // member ship
    this.url += this.memberShipQuery();
    // difficulty
    this.url += this.difficultyQuery();
    // body focus
    this.url += this.bodyFocusQuery();
    //controll url
    this.adjustUrl();
    this.removeFilter();
    console.log(this.url);
    // save to local storage
    localStorage.setItem('categoryUrl', this.url);
    // call api
    this.odataService.queryObject(this.url)
    .subscribe(body => console.log(body));
  }

  priceQuery()
  {
    const key: string = "price";
    if(this.fromPrice == null && this.toPrice != null){
      return this.odataService.addFilterLessThanEqual(key, this.toPrice.toString());
    }
    else if(this.fromPrice != null && this.toPrice == null){
      return this.odataService.addFilterGreaterThanEqual(key, this.fromPrice.toString());
    }
    else if (this.fromPrice != null && this.toPrice != null){
      return this.odataService.addFilterBetween(key, this.fromPrice.toString(), this.toPrice.toString());
    } 
    return "";
  }

  calorieQuery(){
    const key: string = "calorie";
    if(this.calorieMin == null && this.calorieMax != null){
      return this.odataService.addFilterLessThanEqual(key, this.calorieMax.toString());
    }
    else if(this.calorieMin != null && this.calorieMax == null){
      return this.odataService.addFilterGreaterThanEqual(key, this.calorieMin.toString());
    }
    else if (this.calorieMin != null && this.calorieMax != null){
      return this.odataService.addFilterBetween(key, this.calorieMin.toString(), this.calorieMax.toString());
    } 
    return "";
  }

  dateQuery(){
    const key: string = "published";
    if(this.startDate == null && this.endDate != null){
      return this.odataService.addFilterLessThanEqual(key, `'${this.endDate.toString()}'`);
    }
    else if(this.startDate != null && this.endDate == null){
      return this.odataService.addFilterGreaterThanEqual(key, `'${this.startDate.toString()}'`);
    }
    else if (this.startDate != null && this.endDate != null){
      return this.odataService.addFilterBetween(key, `'${this.startDate.toString()}'`, `'${this.endDate.toString()}'`);
    } 
    return "";
  }

  tagQuery(){
    const key: string = "tag";
    if(this.tag != null){
      return this.odataService.addFilterIn(key, this.tag);
    }
    return "";
  }

  memberShipQuery(){
    const key: string = "memberShip";
    if(this.menberShip != null){
      return this.odataService.addFilterIn(key, this.menberShip);
    }
    return "";
  }

  difficultyQuery(){
    const key: string = "difficulty";
    if(this.difficulty != null){
      return this.odataService.addFilterIn(key, this.difficulty, false);
    }
    return "";
  }

  bodyFocusQuery(){
    const key: string = "bodyFocus";
    if(this.bodyFocus != null){
      return this.odataService.addFilterIn(key, this.bodyFocus);
    }
    return "";
  }

  adjustUrl(){
    let index = this.url.indexOf('filter=and');
    if(index != -1){
      this.url = this.url.replace(this.url.substring(index + 7, index + 10), '');
    }
  }

  removeFilter(){
    let index = this.url.indexOf('&$filter=');
    if(index + 9 == this.url.length){
      this.url = this.url.substring(0, index);
    }
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  calorieMinChange(event): void {
    let value = event.target.value;
    if (value === "") {
      this.fromPrice = null;
    }
    else{
      this.fromPrice = value;
    }
    this.queryDayta();
  }

  calorieMaxChange(event): void {
    let value = event.target.value;
    if (value === "") {
      this.toPrice = null;
    }
    else{
      this.toPrice = value;
    }
    this.queryDayta();
  }

  difficultyChange(event): void {
    if(event._selected){
      
    }
    else{

    }
  }

  
}
