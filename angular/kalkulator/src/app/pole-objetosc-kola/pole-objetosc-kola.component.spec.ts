import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoleObjetoscKolaComponent } from './pole-objetosc-kola.component';

describe('PoleObjetoscKolaComponent', () => {
  let component: PoleObjetoscKolaComponent;
  let fixture: ComponentFixture<PoleObjetoscKolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoleObjetoscKolaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoleObjetoscKolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
