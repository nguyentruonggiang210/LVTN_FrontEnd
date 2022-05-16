import { Component, OnInit } from '@angular/core';
import { BillDetailDto } from 'src/app/models/admin/BillDto';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent implements OnInit {

  public data: string;
  dataSourse: BillDetailDto[];
  constructor() { }

  ngOnInit(): void {
    this.dataSourse = JSON.parse(this.data);
  }
}
