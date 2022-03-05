import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdePopoverPanel } from '@material-extended/mde';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {

  @Input() cartPopOver: MdePopoverPanel;

  constructor() { }

  ngOnInit(): void {

  }
}
