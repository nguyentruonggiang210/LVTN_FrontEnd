import { Component, OnInit } from '@angular/core';
import { CarouselService } from 'src/app/services/home/carousel.service';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  images: Array<string> = [ "https://picsum.photos/id/1011/900/500", "https://picsum.photos/id/944/900/500", "https://picsum.photos/id/984/900/500" ];

  constructor(private carouselService : CarouselService) { }

  ngOnInit(): void {
    this.carouselService.getCarousel()
    .subscribe(
      x =>{
        console.log(x)
      }, 
      err => console.log(err.status));
  }

  getCarousel()
  {
    return this.carouselService.getCarousel();
  }
}
