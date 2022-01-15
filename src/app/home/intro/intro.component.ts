import { Component, OnInit } from '@angular/core';
import { MenuDto } from '../../models/MenuDto';
import { CarouselService } from 'src/app/services/home/carousel.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  // variables
  introType: number = 2;
  introObj: MenuDto;
  default: string = "-";
  constructor(private carouselService : CarouselService) { }

  ngOnInit(): void {
    this.getIntro();
  }

  getIntro()
  {
    this.carouselService.getCarousel(this.introType)
    .subscribe(x => 
      {
        this.introObj = x.body[0];
        console.log(this.introObj);
      });
  }
}
