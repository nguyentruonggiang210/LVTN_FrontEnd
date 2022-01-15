import { Component, OnInit } from '@angular/core';
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

  // variables
  default: string = "-";
  carouselType: number = 1;
  carouselImages: MenuDto[] = [];

  constructor(private toastrService: ToastrService, private commonService: CommonService, private carouselService : CarouselService) { }

  ngOnInit(): void {
    this.toastrService.success("123");
    this.getCarousel();
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
