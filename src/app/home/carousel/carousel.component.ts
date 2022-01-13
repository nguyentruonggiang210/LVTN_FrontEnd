import { Component, OnInit } from '@angular/core';
import { CarouselService } from 'src/app/services/home/carousel.service';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  constructor(private carouselService : CarouselService) { }

  ngOnInit(): void {
    this.carouselService.getCarousel().subscribe(x => console.log(x));
  }

  getCarousel()
  {
    return this.carouselService.getCarousel();
  }
}
