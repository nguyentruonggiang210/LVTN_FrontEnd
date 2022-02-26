import { Component, OnInit, Input } from '@angular/core';
import { CarouselService } from 'src/app/services/home/carousel.service';
import { CommonService } from 'src/app/services/common/common.service';
import { MenuDto } from '../../models/MenuDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  // input
  @Input() inputType: string;
  // variables
  default: string = "-";
  carouselType: number = 1;
  carouselImages: MenuDto[] = [];

  carouselImage: MenuDto = {
    image: 'https://mdbootstrap.com/img/Photos/Slides/img%20(6).webp',
    content: 'Free course',
    toolTip: '',
    url: 'https://mdbootstrap.com/img/Photos/Slides/img%20(6).webp',
    description: '',
  };

  constructor(private toastrService: ToastrService, private commonService: CommonService, private carouselService : CarouselService) { 
    for(var i = 0; i < 2; i++){
      this.carouselImages.push(this.carouselImage);
    }
  }

  ngOnInit(): void {
    //this.getCarousel();
  }

  getCarousel()
  {
    this.carouselService.getCarousel(this.carouselType)
    .subscribe(x => 
      {
        this.carouselImages = x.body;
        this.commonService.distroySpinner();
      });
  }
}
