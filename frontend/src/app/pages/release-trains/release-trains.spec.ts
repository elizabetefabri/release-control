import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ReleaseTrains } from './release-trains';
import { provideAppIcons } from '../../shared/icons/icon.registry';

describe('ReleaseTrains', () => {
  let component: ReleaseTrains;
  let fixture: ComponentFixture<ReleaseTrains>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrains],
      providers: [provideAppIcons(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrains);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
