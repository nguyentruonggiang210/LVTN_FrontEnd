import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  id: string;
  type: string;
  sortBy: number = 1;
  constructor(private activatedroute: ActivatedRoute) {
    this.activatedroute.params.subscribe(x => {
      this.id = x.id;
      this.type = x.type;
    });
  }

  ngOnInit(): void {
  }

  sortListChange(event): void{
    this.sortBy = event.target.value;
  }
}
