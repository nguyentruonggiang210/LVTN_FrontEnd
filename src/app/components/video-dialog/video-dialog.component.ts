import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {
  public videoUrl: string;
  constructor() { }

  ngOnInit(): void {
  }

}
