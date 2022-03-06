// modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ODataModule } from 'angular-odata';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { MbscModule, MbscEventcalendarModule, MbscButtonModule } from '@mobiscroll/angular';
import { MdePopoverModule } from '@material-extended/mde';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChartsModule } from 'ng2-charts';
import { NgxPrintModule } from 'ngx-print';
import { QrCodeModule } from 'ng-qrcode';
import { SocialLoginModule } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ScheduleModule, View } from '@syncfusion/ej2-angular-schedule';
import { WeekService, MonthService } from '@syncfusion/ej2-angular-schedule';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// import { AgmCoreModule } from '@agm/core';

// env

import { environment } from '../environments/environment';

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
import { CategoryComponent } from './category/category/category.component';
import { FilterComponent } from './category/filter/filter.component';
import { ContentComponent } from './category/content/content.component';
import { CourseDetailComponent } from './detail/course-detail/course-detail.component';
import { ProductDetailComponent } from './detail/product-detail/product-detail.component';
import { TrainerDetailComponent } from './detail/trainer-detail/trainer-detail.component';
import { DetailMainComponent } from './detail/detail-main/detail-main.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { UserDetailComponent } from './detail/user-detail/user-detail.component';
import { AdminComponent } from './management/admin/admin.component';
import { TrainerComponent } from './management/trainer/trainer.component';
import { ProductComponent } from './management/product/product.component';
import { UserComponent } from './management/user/user.component';
import { UserCreationComponent } from './management/user-creation/user-creation.component';
import { DeleteNotifyComponent } from './components/delete-notify/delete-notify.component';
import { CartDialogComponent } from './components/cart-dialog/cart-dialog.component';
import { CartComponent } from './home/cart/cart.component';

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

// google config

const externalLoginConfig = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(
          environment.googleClientId
        )
      },
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(
          environment.facebookClientId
        ),
      }
    ],
  }
}


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
    CategoryComponent,
    FilterComponent,
    ContentComponent,
    CourseDetailComponent,
    ProductDetailComponent,
    TrainerDetailComponent,
    DetailMainComponent,
    CalendarComponent,
    LoginDialogComponent,
    RegisterDialogComponent,
    UserDetailComponent,
    AdminComponent,
    TrainerComponent,
    ProductComponent,
    UserComponent,
    UserCreationComponent,
    DeleteNotifyComponent,
    CartDialogComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    ODataModule.forRoot({
      serviceRootUrl: environment.apiUrl
    }),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    MbscModule,
    HttpClientJsonpModule,
    MbscEventcalendarModule,
    MbscButtonModule,
    MatDatepickerModule,
    MatTooltipModule,
    MdePopoverModule,
    ScrollingModule,
    ChartsModule,
    NgxPrintModule,
    QrCodeModule,
    SocialLoginModule,
    NgScrollbarModule,
    ScheduleModule,
    MatSnackBarModule
    // AgmCoreModule.forRoot({
    //   apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    // })
  ],
  providers: [
    errorInterceptor,
    authInterceptor,
    externalLoginConfig,
    WeekService,
    MonthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
