import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SearchDto } from 'src/app/models/SearchDto';
import { CarouselService } from 'src/app/services/home/carousel.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { SearchType } from 'src/app/enums/SearchType';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from 'src/app/components/register-dialog/register-dialog.component';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/home/cart.service';
import { CartDialogComponent } from 'src/app/components/cart-dialog/cart-dialog.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // variables
  itemCount: number = 0;
  isclicked: boolean = false;
  pid: 1;
  cartCount: number = 0;
  tokenString: string = this.commonService.getLocalStorage(this.commonService.tokenName);
  defaultSelect: number;
  searchForm: FormGroup;
  dataSource: SearchDto[];
  keyword: string = "";
  searchTypeString: string = 'product';
  searchType: any[] = [
    {
      id: 1,
      name: 'Product'
    },
    {
      id: 2,
      name: 'Course'
    },
    {
      id: 3,
      name: 'Trainer'
    }
  ];

  constructor(private carouselService: CarouselService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,
    private cartService: CartService,
    public translateService: TranslateService) {
    this.foucusOutEvent();
    this.searchForm = this.formBuilder.group({
      searchResult: '',
      searchType: ''
    });

    var cartInterval = setInterval(() => {
      this.cartCount = this.cartService.getCart().length;
    }, 300);

    translateService.addLangs(['en', 'vi']);
    translateService.setDefaultLang('vi');
  }

  ngOnInit(): void {
    this.setDefaultType();
    this.searchTypeClassify();
    this.setDefaultSearchValue();
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang);
  }

  handlerLanguageDisplay(language: string): string {
    switch (language) {
      case 'en':
        return 'English';
      default:
        return 'Việt Nam';
    }
  }

  keyUpEvent(event): void {
    let value = event.target.value;
    if (value !== "" && value !== null) {
      this.keyword = value;
      // call api here
      this.searchResult();

      document.getElementById("search-result").style.display = "block";
    }
    else {
      document.getElementById("search-result").style.display = "none";
    }
  }

  changeSelectOption(event): void {
    let val = event.value;
    this.defaultSelect = val;
    this.commonService.setLocalStorage("searchType", val);
    this.searchTypeClassify();
  }

  foucusOutEvent(): void {
    document.body.addEventListener("mouseup", (e) => {
      let inputContainer = document.getElementById("input-container");
      let searchContainer = document.getElementById("search-result");

      if (inputContainer != e.target && searchContainer != e.target) {
        document.getElementById("search-result").style.display = "none";
      }
    });
  }

  foucusOnEvent(): void {
    document.getElementById("search-result").style.display = "block";
  }

  focusEvent(event): void {
    let value = event.target.value;
    if (value !== null || value !== "") {
      // call api here
      this.searchResult();
    }
  }

  searchResult(): void {
    this.carouselService.getSearchResult(this.defaultSelect, this.keyword)
      .subscribe(x => {
        this.dataSource = x;
      });
  }

  onSubmit(): void {
    console.log(this.searchForm.value);
  }

  calendarEvent(): void {
    const dialogRef = this.dialog.open(CalendarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '50%',
      maxWidth: '800px',
      minWidth: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '50%',
      maxWidth: '800px',
      minWidth: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  logOutEvent(): void {
    this.commonService.setLocalStorage(this.commonService.tokenName, null);
    window.location.href = '/';
  }

  openCartDialog() {
    const dialogRef = this.dialog.open(CartDialogComponent, {
      width: '70%',
      height: '90vh',
      maxWidth: '1000px',
      minWidth: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Cart dialog was closed');
    });
  }

  searchValue() {
    this.commonService.setLocalStorage('searchValue', this.keyword);
    window.location.href = `/category/${this.searchTypeString}`;
  }

  private setDefaultType() {
    let searchTypeLocal = this.commonService.getLocalStorage('searchType');
    if (searchTypeLocal == null || searchTypeLocal == undefined || searchTypeLocal == '') {
      this.commonService.setLocalStorage('searchType', SearchType.Product);
      this.defaultSelect = SearchType.Product;
    }
    else {
      this.defaultSelect = searchTypeLocal;
    }
  }

  private setDefaultSearchValue() {
    let searchValLocal = this.commonService.getLocalStorage('searchValue');
    if (searchValLocal == null || searchValLocal == undefined || searchValLocal == '') {
      this.commonService.setLocalStorage('searchValue', '');
      this.keyword = '';
    }
    else {
      this.keyword = searchValLocal;
    }
  }

  searchTypeClassify() {
    let searchType = this.commonService.getLocalStorage('searchType');
    switch (searchType) {
      case SearchType.Product:
        this.searchTypeString = 'product';
        break;
      case SearchType.Course:
        this.searchTypeString = 'course';
        break;
      case SearchType.Trainer:
        this.searchTypeString = 'trainer';
        break;
      default:
        this.searchTypeString = 'product';
    }
  }
}

