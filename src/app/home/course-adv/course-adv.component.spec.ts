import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAdvComponent } from './course-adv.component';

describe('CourseAdvComponent', () => {
  let component: CourseAdvComponent;
  let fixture: ComponentFixture<CourseAdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseAdvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
