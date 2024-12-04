import { TestBed } from '@angular/core/testing';

import { BMIService } from './bmi.service';

describe('BMIService', () => {
  let service: BMIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BMIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
