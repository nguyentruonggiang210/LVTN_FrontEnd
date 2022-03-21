import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { DetailMainComponent } from './detail/detail-main/detail-main.component';
import { CategoryComponent } from './category/category/category.component';
import { UserDetailComponent } from './detail/user-detail/user-detail.component';
import { UserComponent } from './management/user/user.component';
import { ProductDetailComponent } from './detail/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category/:type', component: CategoryComponent },
  { path: 'category/:type/:pageIndex', component: CategoryComponent },
  // { path: 'detail/:type/:id', component: DetailMainComponent },
  { path: 'detail/user', component: UserDetailComponent },
  { path: 'detail/product/:id', component: ProductDetailComponent },
  { path: 'management/user', component: UserComponent },
  { path: 'management/user/:id', component: UserDetailComponent },
  // others
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
