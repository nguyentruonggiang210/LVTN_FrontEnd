import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public tokenName: string = environment.tokenName;

  constructor() { }

  spinner = document.getElementsByClassName("my-spinner");

  distroySpinner() {
    this.spinner[0]?.setAttribute("style", "display: none;");
    this.spinner[1]?.setAttribute("style", "display: none;");
  }

  displaySpinner() {
    this.spinner[0]?.setAttribute("style", "display: block;");
    this.spinner[1]?.setAttribute("style", "display: block;");
  }

  setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}
