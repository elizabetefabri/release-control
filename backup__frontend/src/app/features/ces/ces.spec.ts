import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ces } from './ces';

describe('Ces', () => {
  let component: Ces;
  let fixture: ComponentFixture<Ces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ces],
    }).compileComponents();

    fixture = TestBed.createComponent(Ces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
