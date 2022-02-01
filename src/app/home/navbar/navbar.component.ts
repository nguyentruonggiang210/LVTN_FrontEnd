import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SearchDto } from 'src/app/models/SearchDto';
import { CarouselService } from 'src/app/services/home/carousel.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { SearchType } from 'src/app/enums/SearchType';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  defaultSelect: number = 1;
  searchForm: FormGroup;
  dataSource: SearchDto[];
  selectedType: number = 1;
  keyword: string = "";
  searchType: any[] = [
    {
      id: 1,
      name: 'Product'
    },
    {
      id: 2,
      name: 'Course'
    },
    {
      id: 3,
      name: 'Trainer'
    }
  ];

  constructor(private carouselService: CarouselService,
    private formBuilder: FormBuilder,
    private commonService: CommonService) {
    this.foucusOutEvent();
    this.searchForm = this.formBuilder.group({
      searchResult: '',
      searchType: ''
    });
  }

  ngOnInit(): void {

  }

  keyUpEvent(event): void {
    let value = event.target.value;
    if (value !== "" && value !== null) {
      this.keyword = value;
      // call api here
      this.searchResult();

      document.getElementById("search-result").style.display = "block";
    }
    else {
      document.getElementById("search-result").style.display = "none";
    }
  }

  changeSelectOption(event): void {
    let val = event.value;
    this.selectedType = val;
    this.commonService.setLocalStorage("searchType", this.searchTypeClassify(val));
  }

  foucusOutEvent(): void {
    document.body.addEventListener("mouseup", (e) => {
      let inputContainer = document.getElementById("input-container");
      let searchContainer = document.getElementById("search-result");

      if (inputContainer != e.target && searchContainer != e.target) {
        document.getElementById("search-result").style.display = "none";
      }
    });
  }

  foucusOnEvent(): void {
    document.getElementById("search-result").style.display = "block";
  }

  focusEvent(event): void {
    let value = event.target.value;
    if (value !== null || value !== "") {
      // call api here
      this.searchResult();
    }
  }

  searchResult(): void {
    this.carouselService.getSearchResult(this.selectedType, this.keyword)
      .subscribe(x => {
        this.dataSource = x;
      });
  }

  onSubmit(): void {
    console.log(this.searchForm.value);
  }

  private searchTypeClassify(value): string {
    if (value == SearchType.Product) {
      return "product";
    }
    else if (value == SearchType.Course) {
      return "course";
    }
    return "trainer";
  }
}
