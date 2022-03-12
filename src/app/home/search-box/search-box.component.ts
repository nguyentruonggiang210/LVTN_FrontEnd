import { Component, OnInit, Input } from '@angular/core';
import { SearchDto } from 'src/app/models/SearchDto';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  @Input() dataSource: SearchDto[]; 
  
  displayedColumns: string[] = ['name'];

  constructor() { }

  ngOnInit(): void {
   
  }

  navigateToCategory(name: string){
    
  }
}

