import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAdvComponent } from './teacher-adv.component';

describe('TeacherAdvComponent', () => {
  let component: TeacherAdvComponent;
  let fixture: ComponentFixture<TeacherAdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAdvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
