import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  spinner = document.getElementsByClassName("my-spinner");

  distroySpinner()
  {
    this.spinner[0]?.setAttribute("style","display: none;");
    this.spinner[1]?.setAttribute("style","display: none;");
  }
}
