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

// components
import { AppComponent } from './app.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { HomeComponent } from './home/home/home.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { ProductAdvComponent } from './home/product-adv/product-adv.component';
import { CourseAdvComponent } from './home/course-adv/course-adv.component';
import { IntroComponent } from './home/intro/intro.component';

// services
import { CommonService } from './services/common/common.service';
import { ToastrService } from 'ngx-toastr';

// Intercept
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './commons/AuthInterceptor';
import { ErrorInterceptor } from './commons/ErrorInterceptor';
import { FooterComponent } from './home/footer/footer.component';
import { TeacherAdvComponent } from './home/teacher-adv/teacher-adv.component';
import { AboutComponent } from './home/about/about.component';

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
    AboutComponent
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
    MatProgressSpinnerModule
  ],
  providers: [
    errorInterceptor,
    authInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
