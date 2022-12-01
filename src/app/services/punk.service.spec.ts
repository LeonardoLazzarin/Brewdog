import { TestBed } from '@angular/core/testing';

import { PunkService } from './punk.service';

describe('PunkService', () => {
  let service: PunkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PunkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
