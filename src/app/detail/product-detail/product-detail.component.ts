import { Component, OnInit } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  preload: string = 'auto';
  api: VgApiService;
  token: string = null;
  constructor() { }

  onPlayerReady(api: VgApiService,
    commentService: CommonService) {
    this.api = api;
    commentService = commentService.getLocalStorage('fitnessToken');
    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
      }
    );
  }

  ngOnInit(): void {
  }

}
