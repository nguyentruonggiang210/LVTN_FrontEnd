import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { ProductDto } from 'src/app/models/ProductDto';
import { CommonService } from 'src/app/services/common/common.service';
import { DetailService } from 'src/app/services/detail/detail.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  preload: string = 'auto';
  api: VgApiService;
  token: string = null;
  dataSource: ProductDto = null;
  productId: number;
  constructor(private detailService: DetailService,
    private router: ActivatedRoute) {
  }

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
    this.router.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
    });
    
    this.detailService.getProductDetail(this.productId)
      .subscribe(x => {
        if(x){
          console.log(x);
          let data = <BaseResponse<ProductDto>> x;
          if(!data.hasError){
            this.dataSource = data.body;
          }
        }
      })
  }
}
