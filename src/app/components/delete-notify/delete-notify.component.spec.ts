import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNotifyComponent } from './delete-notify.component';

describe('DeleteNotifyComponent', () => {
  let component: DeleteNotifyComponent;
  let fixture: ComponentFixture<DeleteNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNotifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
