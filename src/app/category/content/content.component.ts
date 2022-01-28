import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  dogs: string[] = [
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
    "Shiba Inu", 
  ];
  

  constructor() { }

  ngOnInit(): void {
  }

}

