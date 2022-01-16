import { Component, OnInit } from '@angular/core';
import { TeacherDto } from 'src/app/models/TeacherDto';
import { CarouselService } from '../../services/home/carousel.service';
@Component({
  selector: 'app-teacher-adv',
  templateUrl: './teacher-adv.component.html',
  styleUrls: ['./teacher-adv.component.scss']
})
export class TeacherAdvComponent implements OnInit {

  constructor(private carouselService: CarouselService) { }

  teacherObj: TeacherDto;

  ngOnInit(): void {
    this.getHotTeach();
  }

  getHotTeach()
  {
      this.carouselService.getHotTeacher()
      .subscribe(teacher => {
        console.log(teacher);
        this.teacherObj = teacher.body;
      });
  }

}
