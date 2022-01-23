// modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MatSelectModule  } from '@angular/material/select';
import { MatListModule  } from '@angular/material/list';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';
import { MatIconModule  } from '@angular/material/icon';
import { MatButtonModule  } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatExpansionModule  } from '@angular/material/expansion';
import { MatTreeModule  } from '@angular/material/tree';
import { MatSliderModule  } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';

// services
import { CommonService } from './services/common/common.service';
import { ToastrService } from 'ngx-toastr';

// Intercept
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './commons/AuthInterceptor';
import { ErrorInterceptor } from './commons/ErrorInterceptor';

// components
import { AppComponent } from './app.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { HomeComponent } from './home/home/home.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { ProductAdvComponent } from './home/product-adv/product-adv.component';
import { CourseAdvComponent } from './home/course-adv/course-adv.component';
import { IntroComponent } from './home/intro/intro.component';
import { FooterComponent } from './home/footer/footer.component';
import { TeacherAdvComponent } from './home/teacher-adv/teacher-adv.component';
import { AboutComponent } from './home/about/about.component';
import { SearchBoxComponent } from './home/search-box/search-box.component';
import { ProductComponent } from './category/product/product.component';
import { CourseComponent } from './category/course/course.component';
import { TrainerComponent } from './category/trainer/trainer.component';
import { CategoryComponent } from './category/category/category.component';
import { FilterComponent } from './category/filter/filter.component';

// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
// ];

const errorInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
  deps: [ToastrService, CommonService],
};

const authInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};

const route: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category/:type/:id', component: CategoryComponent },
  // others
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    HomeComponent,
    NavbarComponent,
    ProductAdvComponent,
    CourseAdvComponent,
    IntroComponent,
    FooterComponent,
    TeacherAdvComponent,
    AboutComponent,
    SearchBoxComponent,
    ProductComponent,
    CourseComponent,
    TrainerComponent,
    CategoryComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(route),
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbCarouselModule,
    CarouselModule,
    ButtonModule,
    CommonModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTreeModule,
    MatSliderModule,
    MatCheckboxModule,
    MatListModule
  ],
  providers: [
    errorInterceptor,
    authInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
