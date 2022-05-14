import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { CategoryComponent } from './category/category/category.component';
import { UserDetailComponent } from './detail/user-detail/user-detail.component';
import { UserComponent } from './management/user/user.component';
import { ProductDetailComponent } from './detail/product-detail/product-detail.component';
import { MeetingRoomComponent } from './detail/meeting-room/meeting-room.component';
import { TrainerComponent } from './management/trainer/trainer.component';
import { CreateUpdateUserComponent } from './management/create-update-user/create-update-user.component';
import { ProductComponent } from './management/product/product.component';
import { CreateUpdateProductComponent } from './management/create-update-product/create-update-product.component';
import { CreateUpdateCourseComponent } from './management/create-update-course/create-update-course.component';
import { CourseDetailComponent } from './detail/course-detail/course-detail.component';
import { PromotionManagementComponent } from './management/promotion-management/promotion-management.component';
import { ShopComponent } from './management/shop/shop.component';
import { PermissionComponent } from './components/permission/permission.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DetailMainComponent } from './detail/detail-main/detail-main.component';
import { ShopDetailComponent } from './detail/shop-detail/shop-detail.component';
import { VideoCallComponent } from './detail/video-call/video-call.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category/:type', component: CategoryComponent },
  { path: 'category/:type/:pageIndex', component: CategoryComponent },
  { path: 'course/room', component: MeetingRoomComponent },
  { path: 'course/room/:roomId', component: MeetingRoomComponent },

  // { path: 'detail/:type/:id', component: DetailMainComponent },
  { path: 'detail/user', component: UserDetailComponent },
  { path: 'detail/user/:userName', component: DetailMainComponent },
  { path: 'detail/product/:id', component: ProductDetailComponent },
  { path: 'detail/shop/:shopId', component: ShopDetailComponent },
  { path: 'detail/course/:id', component: CourseDetailComponent },
  { path: 'videocall', component: VideoCallComponent },
  // admin
  { path: 'management/user', component: UserComponent },
  { path: 'management/user/update/:userName', component: CreateUpdateUserComponent },
  { path: 'management/user/create', component: CreateUpdateUserComponent },
  { path: 'management/product/create', component: CreateUpdateProductComponent },
  { path: 'management/product/update/:productId', component: CreateUpdateProductComponent },
  { path: 'management/course/create', component: CreateUpdateCourseComponent },
  { path: 'management/course/update/:courseId', component: CreateUpdateCourseComponent },
  { path: 'management/course', component: TrainerComponent },
  { path: 'management/promotion', component: PromotionManagementComponent },
  { path: 'management/product', component: ProductComponent },
  { path: 'management/shop', component: ShopComponent },
  // others
  { path: 'denied', component: PermissionComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
