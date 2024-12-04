import { TestBed } from '@angular/core/testing';

import { KalkulatorSService } from './kalkulator-s.service';

describe('KalkulatorSService', () => {
  let service: KalkulatorSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KalkulatorSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
