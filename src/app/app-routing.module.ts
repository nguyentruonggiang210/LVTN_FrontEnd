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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category/:type', component: CategoryComponent },
  { path: 'category/:type/:pageIndex', component: CategoryComponent },
  { path: 'course/room', component: MeetingRoomComponent },

  // { path: 'detail/:type/:id', component: DetailMainComponent },
  { path: 'detail/user', component: UserDetailComponent },
  { path: 'detail/product/:id', component: ProductDetailComponent },
  // admin
  { path: 'management/user', component: UserComponent },
  { path: 'management/user/update/:userName', component: CreateUpdateUserComponent },
  { path: 'management/user/create', component: CreateUpdateUserComponent },
  { path: 'management/product/create', component: CreateUpdateProductComponent },
  { path: 'management/product/update/:productId', component: CreateUpdateProductComponent },
  { path: 'management/course', component: TrainerComponent },
  { path: 'management/product', component: ProductComponent },
  // others
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
