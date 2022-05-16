import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenderType } from 'src/app/enums/GenderType';
import { UserInfoDto } from 'src/app/models/UserInfoDto';
import { CommonService } from 'src/app/services/common/common.service';
import { UserDetailService } from 'src/app/services/detail/user-detail.service';

const DefaultAvatar = "assets/img/my-default-avatar.png";

@Component({
  selector: 'app-detail-main',
  templateUrl: './detail-main.component.html',
  styleUrls: ['./detail-main.component.scss']
})
export class DetailMainComponent implements OnInit {
  dataSource: UserInfoDto;

  constructor(private userDetailService: UserDetailService,
    private route: ActivatedRoute,
    private commonService: CommonService) {
    commonService.displaySpinner();
    route.params
      .subscribe(x => {
        this.userDetailService.getUserInf(x.userName)
          .subscribe(x => {
            this.commonService.distroySpinner();
            this.dataSource = x.body;
          });
      });
  }

  ngOnInit(): void {

  }

  handlerDisplayImage() {
    return this.dataSource?.avatar == null || this.dataSource?.avatar === '' ? DefaultAvatar : this.dataSource?.avatar;
  }

  displayGender() {
    switch (this.dataSource?.gender) {
      case 0:
        return 'FeMale';
      case 1:
        return 'Male';
      default:
        return 'Other';
    }
  }
}
