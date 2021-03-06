import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  timeOutEvent: any;
  public tokenName: string = environment.tokenName;

  constructor(private snackBar: MatSnackBar,
    private httpClient: HttpClient) { }

  spinner = document.getElementsByClassName("my-spinner");
  container = document.getElementsByClassName("my-spinner-container");

  distroySpinner(): void {
    this.spinner[0]?.setAttribute("style", "display: none;");
    this.spinner[1]?.setAttribute("style", "display: none;");
    this.container[0]?.setAttribute("style", "display: none;");
  }

  displaySpinner(): void {
    this.spinner[0]?.setAttribute("style", "display: block;");
    this.spinner[1]?.setAttribute("style", "display: block;");
    this.container[0]?.setAttribute("style", "display: block;");
  }

  setLocalStorage(key, value): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  displaySnackBar(msg: string, action: string, timeOut: number = 3000): void {
    clearTimeout(this.timeOutEvent);

    this.snackBar.open(msg, action);

    this.timeOutEvent = setTimeout(() => {
      this.snackBar.dismiss();
    }, timeOut);
  }

  public getMoney() {

    let lang = this.getLocalStorage(environment.lang);
    return this.httpClient.get(environment.apiUrl + 'Hub/currency');
  }

  private httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'https://www.dongabank.com.vn/exchange/export', false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }
}
