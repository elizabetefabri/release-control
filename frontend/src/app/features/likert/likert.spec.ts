import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Likert } from './likert';

describe('Likert', () => {
  let component: Likert;
  let fixture: ComponentFixture<Likert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Likert],
    }).compileComponents();

    fixture = TestBed.createComponent(Likert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
