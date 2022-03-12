import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; import { SearchType } from 'src/app/enums/SearchType';
import { SortType } from 'src/app/enums/SortType';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { CommonService } from 'src/app/services/common/common.service';
import { OdataService } from 'src/app/services/common/odata.service';

const pageSize: number = 40;
const blankSpace: string = ' ';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})


export class FilterComponent implements OnInit {
  @Input() sortItem: number;
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
  menberShip: string[] = null;
  difficulty: number[] = null;
  bodyFocus: string[] = null;
  sortBy: string;
  searchTypeString: string = 'product';

  private url: string;
  private page: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private odataService: OdataService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.searchTypeClassify();
    this.queryDayta(true);
  }

  queryDayta(isFirstTime: boolean = false) {
    // search type classify
    this.searchTypeClassify();

    this.url = `Category/${this.searchTypeString}?$take=${pageSize}`;
    // pagination
    this.url += `&$skip=${this.page}&$filter=`;
    // search value
    this.url += this.searchValueQuery();
    if (!isFirstTime) {
      // price
      this.url += this.priceQuery();
      // date
      this.url += this.dateQuery();
      // calorie
      this.url += this.calorieQuery();
      // tags
      this.url += this.tagQuery();
      // member ship
      this.url += this.memberShipQuery();
      // difficulty
      this.url += this.difficultyQuery();
      // body focus
      this.url += this.bodyFocusQuery();
    }
    // controll url
    this.adjustUrl();
    this.removeFilter();
    // sortby
    this.url += this.sortQuery();

    console.log(this.url);
    // save to local storage
    localStorage.setItem('categoryUrl', this.url);
    // call api
    this.odataService.queryObject<any>(this.url)
      .subscribe(body => console.log(body));
  }

  priceQuery() {
    const key: string = "price";
    if (this.fromPrice == null && this.toPrice != null) {
      return this.odataService.addFilterLessThanEqual(key, this.toPrice.toString()) + blankSpace;
    }
    else if (this.fromPrice != null && this.toPrice == null) {
      return this.odataService.addFilterGreaterThanEqual(key, this.fromPrice.toString()) + blankSpace;
    }
    else if (this.fromPrice != null && this.toPrice != null) {
      return this.odataService.addFilterBetween(key, this.fromPrice.toString(), this.toPrice.toString()) + blankSpace;
    }
    return "";
  }

  calorieQuery() {
    const key: string = "calorie";
    if (this.calorieMin == null && this.calorieMax != null) {
      return this.odataService.addFilterLessThanEqual(key, this.calorieMax.toString()) + blankSpace;
    }
    else if (this.calorieMin != null && this.calorieMax == null) {
      return this.odataService.addFilterGreaterThanEqual(key, this.calorieMin.toString()) + blankSpace;
    }
    else if (this.calorieMin != null && this.calorieMax != null) {
      return this.odataService.addFilterBetween(key, this.calorieMin.toString(), this.calorieMax.toString()) + blankSpace;
    }
    return "";
  }

  dateQuery() {
    const key: string = "published";
    if (this.startDate == null && this.endDate != null) {
      return this.odataService.addFilterLessThanEqual(key, `${this.endDate.toString()}`) + blankSpace;
    }
    else if (this.startDate != null && this.endDate == null) {
      return this.odataService.addFilterGreaterThanEqual(key, `${this.startDate.toString()}`) + blankSpace;
    }
    else if (this.startDate != null && this.endDate != null) {
      return this.odataService.addFilterBetween(key, `${this.startDate.toString()}`, `${this.endDate.toString()}`) + blankSpace;
    }
    return "";
  }

  tagQuery() {
    const key: string = "tag";
    if (this.tag != null) {
      return this.odataService.addFilterIn(key, this.tag) + blankSpace;
    }
    return "";
  }

  memberShipQuery() {
    const key: string = "memberShip";
    if (this.menberShip != null) {
      return this.odataService.addFilterIn(key, this.menberShip) + blankSpace;
    }
    return "";
  }

  difficultyQuery() {
    const key: string = "difficulty";
    if (this.difficulty != null) {
      return this.odataService.addFilterIn(key, this.difficulty) + blankSpace;
    }
    return "";
  }

  bodyFocusQuery() {
    const key: string = "bodyFocus";
    if (this.bodyFocus != null) {
      return this.odataService.addFilterIn(key, this.bodyFocus) + blankSpace;
    }
    return "";
  }

  adjustUrl() {
    let index = this.url.indexOf('filter=and');
    if (index != -1) {
      this.url = this.url.replace(this.url.substring(index + 7, index + 10), '');
    }
  }

  removeFilter() {
    let index = this.url.indexOf('&$filter=');
    if (index + 9 == this.url.trim().length) {
      this.url = this.url.substring(0, index);
    }

    index = this.url.indexOf('&$filter= and');
    if (index != -1) {
      if (index + 13 == this.url.trim().length) {
        this.url = this.url.substring(0, index);
      }
      else {
        this.url = this.url.substring(0, index + 9) + this.url.substring(index + 13, this.url.trim().length);
      }
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
      this.calorieMin = null;
    }
    else {
      this.calorieMin = value;
    }
    this.queryDayta();
  }

  calorieMaxChange(event): void {
    let value = event.target.value;
    if (value === "") {
      this.calorieMax = null;
    }
    else {
      this.calorieMax = value;
    }
    this.queryDayta();
  }

  fromPriceChange(event): void {
    let value = event.value;
    if (value === 0) {
      this.fromPrice = null;
    }
    else {
      this.fromPrice = value;
    }
    this.queryDayta();
  }

  toPriceChange(event): void {
    let value = event.value;
    if (value === 0) {
      this.toPrice = null;
    }
    else {
      this.toPrice = value;
    }
    this.queryDayta();
  }

  startDateChange(event) {
    let value = event.target.value;
    if (value === "") {
      this.startDate = null;
    }
    else {
      this.startDate = value;
    }
    this.queryDayta();
  }

  endDateChange(event) {
    let value = event.target.value;
    console.log(value);
    if (value === "") {
      this.endDate = null;
    }
    else {
      this.endDate = value;
    }
    this.queryDayta();
  }

  listChange(event): void {
    this.queryDayta();
  }

  sortQuery(): string {

    switch (this.sortItem.toString()) {
      case SortType.Newest.toString():
        return this.odataService.sortBy('published', true);
      case SortType.Oldest.toString():
        return this.odataService.sortBy('published', false);
      case SortType.PriceReduce.toString():
        return this.odataService.sortBy('price', true);
      case SortType.PriceGain.toString():
        return this.odataService.sortBy('price', false);
      case SortType.RateReduce.toString():
        return this.odataService.sortBy('rate', true);
      case SortType.RateGain.toString():
        return this.odataService.sortBy('rate', false);
      default:
        return "";
    }
  }

  searchValueQuery(): string {
    const Name = 'name';
    let searchValue = this.commonService.getLocalStorage('searchValue');

    return searchValue !== '' && searchValue !== null && searchValue != undefined ? this.odataService.addFilterEqual(Name, searchValue, true) + blankSpace : '';
  }

  searchTypeClassify() {
    let searchType = this.commonService.getLocalStorage('searchType');
    switch (searchType) {
      case SearchType.Product:
        this.searchTypeString = 'product';
        break;
      case SearchType.Course:
        this.searchTypeString = 'course';
        break;
      case SearchType.Trainer:
        this.searchTypeString = 'trainer';
        break;
      default:
        this.searchTypeString = 'product';
    }
  }
}
