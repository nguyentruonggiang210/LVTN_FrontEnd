import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdvComponent } from './product-adv.component';

describe('ProductAdvComponent', () => {
  let component: ProductAdvComponent;
  let fixture: ComponentFixture<ProductAdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAdvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
