import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopDetailDto } from 'src/app/models/ShopDetailDto';
import { UserInfoDto } from 'src/app/models/UserInfoDto';
import { CommonService } from 'src/app/services/common/common.service';
import { UserDetailService } from 'src/app/services/detail/user-detail.service';
import { ShopManagementService } from 'src/app/services/management/shop-management.service';


@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {
  dataSource: ShopDetailDto;
  defaultAvatar = 'assets/img/default-shop-image.jpg';

  constructor(private shopMangamentService: ShopManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) {
    commonService.displaySpinner();
    route.params
      .subscribe(x => {
        this.shopMangamentService.getShopDetailInfo(x.shopId)
          .subscribe(x => {
            this.dataSource = x.body;
            commonService.distroySpinner();
          });
      });
  }

  ngOnInit(): void {

  }

  handlerDisplayImage() {
    return this.dataSource.image == null || this.dataSource.image === '' ? this.defaultAvatar : this.dataSource.image;
  }

  navigateToDetail(id: number) {
    this.router.navigate([`/detail/product/${id}`]);
  }
}
