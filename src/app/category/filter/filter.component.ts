import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ODataConfiguration, ODataServiceFactory, ODataService } from "angular-odata-es5";
import { SearchType } from 'src/app/enums/SearchType';
import { SearchDto } from 'src/app/models/SearchDto';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})


export class FilterComponent implements OnInit {

  memberships: string[] = ['Free', 'Plush'];
  difficulties: number[] = [1, 2, 3, 4, 5,];
  bodyFocuses: string[] = ['Upper', 'Core', 'Lower', 'Total'];
  tags: string[] = ['HIIT', 'Streight Training', 'Pilates', 'Low Impact', 'Warm Up / Cool Down', 'Kickboxing', 'Yoga', 'Medicine Ball', 'Barre', 'Stretching / Flexibility', 'Toning'];

  private odata: ODataService<SearchDto>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private odataFactory: ODataServiceFactory) 
  { 
    
  }

  ngOnInit(): void {
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
      value = null;
    }

    this.addUrlParams({ calorieMin: value });
  }

  calorieMaxChange(event): void {
    let value = event.target.value;
    if (value === "") {
      value = null;
    }
    this.addUrlParams({ calorieMax: value });
  }

  difficultyChange(event): void {
    if(event._selected){
      this.addUrlParams({ difficulty: event._value });
    }
    else{

    }
  }

  private addUrlParams(params: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
