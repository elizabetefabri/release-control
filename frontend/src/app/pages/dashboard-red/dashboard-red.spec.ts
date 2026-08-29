import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRed } from './dashboard-red';
import { provideAppIcons } from '../../shared/icons/icon.registry';

describe('DashboardRed', () => {
  let component: DashboardRed;
  let fixture: ComponentFixture<DashboardRed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRed],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
