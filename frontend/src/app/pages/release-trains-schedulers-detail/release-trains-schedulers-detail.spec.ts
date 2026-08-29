import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTrainsSchedulersDetail } from './release-trains-schedulers-detail';
import { provideAppIcons } from '../../shared/icons/icon.registry';

describe('ReleaseTrainsSchedulersDetail', () => {
  let component: ReleaseTrainsSchedulersDetail;
  let fixture: ComponentFixture<ReleaseTrainsSchedulersDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrainsSchedulersDetail],
      providers: [provideAppIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrainsSchedulersDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
