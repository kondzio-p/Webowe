import { TestBed } from '@angular/core/testing';

import { PoleObjetoscKolaService } from './pole-objetosc-kola.service';

describe('PoleObjetoscKolaService', () => {
  let service: PoleObjetoscKolaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoleObjetoscKolaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
