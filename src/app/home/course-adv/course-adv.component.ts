import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-adv',
  templateUrl: './course-adv.component.html',
  styleUrls: ['./course-adv.component.scss']
})
export class CourseAdvComponent implements OnInit {

  responsiveOptions;

    products: Product[] = [
        { 
            image: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/demo/product/game-controller.jpg", 
            name: "abc",
            inventoryStatus: "abc",
            price: 10
        },
        { 
            image: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/demo/product/game-controller.jpg", 
            name: "abc",
            inventoryStatus: "abc",
            price: 10
        },
        { 
            image: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/demo/product/game-controller.jpg", 
            name: "abc",
            inventoryStatus: "abc",
            price: 10
        },
        { 
            image: "https://www.primefaces.org/primeng/showcase/assets/showcase/images/demo/product/game-controller.jpg", 
            name: "abc",
            inventoryStatus: "abc",
            price: 10
        }
    ];

  constructor() {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
   }

  ngOnInit(): void {
  }
}

export interface Product{
  image: string
  name: string,
  inventoryStatus: string,
  price: number,

};
