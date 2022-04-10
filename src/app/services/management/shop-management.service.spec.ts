import { TestBed } from '@angular/core/testing';

import { ShopManagementService } from './shop-management.service';

describe('ShopManagementService', () => {
  let service: ShopManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
