import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SearchDto } from 'src/app/models/SearchDto';
import { CarouselService } from 'src/app/services/home/carousel.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common/common.service';
import { SearchType } from 'src/app/enums/SearchType';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from 'src/app/components/register-dialog/register-dialog.component';
import { Router } from '@angular/router';
import { MdePopoverPanel, MdePopoverTrigger } from '@material-extended/mde';
import { CartDialogComponent } from 'src/app/components/cart-dialog/cart-dialog.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  //
  itemCount: number = 0;
  isclicked: boolean = false;
  pid: 1;

  tokenString: string = this.commonService.getLocalStorage(this.commonService.tokenName);
  defaultSelect: number = 1;
  searchForm: FormGroup;
  dataSource: SearchDto[];
  selectedType: number = 1;
  keyword: string = "";
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
    private router: Router) {
    this.foucusOutEvent();
    this.searchForm = this.formBuilder.group({
      searchResult: '',
      searchType: ''
    });
  }

  ngOnInit(): void {

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
    this.selectedType = val;
    this.commonService.setLocalStorage("searchType", this.searchTypeClassify(val));
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
    this.carouselService.getSearchResult(this.selectedType, this.keyword)
      .subscribe(x => {
        this.dataSource = x;
      });
  }

  onSubmit(): void {
    console.log(this.searchForm.value);
  }

  private searchTypeClassify(value): string {
    if (value == SearchType.Product) {
      return "product";
    }
    else if (value == SearchType.Course) {
      return "course";
    }
    return "trainer";
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
}

