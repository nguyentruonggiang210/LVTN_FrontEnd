import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselDto } from 'src/app/models/CarouselDto';
import { CarouselService } from 'src/app/services/home/carousel.service';

@Component({
  selector: 'app-course-adv',
  templateUrl: './course-adv.component.html',
  styleUrls: ['./course-adv.component.scss']
})
export class CourseAdvComponent implements OnInit {

  defaultImage: string = 'assets/img/default-course-image.png'
  dataSource: CarouselDto[] = null;

  products: any;

  constructor(private service: CarouselService,
    private router: Router) { }

  ngOnInit(): void {
    this.service.getNewCourse()
      .subscribe(x => this.dataSource = x.body);
  }

  navigateToDetail(id: number) {
    this.router.navigate(['detail', 'course', id]);
  }
}
