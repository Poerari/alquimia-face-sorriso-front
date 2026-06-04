import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dentistas } from './dentistas';

describe('Dentistas', () => {
  let component: Dentistas;
  let fixture: ComponentFixture<Dentistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dentistas],
    }).compileComponents();

    fixture = TestBed.createComponent(Dentistas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
