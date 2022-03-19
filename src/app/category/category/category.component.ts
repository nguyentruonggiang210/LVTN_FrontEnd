import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  id: string;
  type: string;
  sortBy: number = 1;
  dataSource: OdataResponse<CategoryDto[]>;
  constructor(private activatedroute: ActivatedRoute) {
    this.activatedroute.params.subscribe(x => {
      this.id = x.id;
      this.type = x.type;
    });
  }

  ngOnInit(): void {
  }

  sortListChange(event): void {
    this.sortBy = event.target.value;
  }

  addItem(newItem: OdataResponse<CategoryDto[]>) {
    this.dataSource = newItem;
  }
}
