import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ReleaseTrainCalendar } from './release-train-calendar';
import { provideAppIcons } from '../../../shared/icons/icon.registry';

describe('ReleaseTrainCalendar', () => {
  let fixture: ComponentFixture<ReleaseTrainCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseTrainCalendar],
      providers: [provideAppIcons(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseTrainCalendar);
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza 7 dias da semana', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.calendar__weekday').length).toBe(7);
  });

  it('renderiza os dias do mês atual', () => {
    const component = fixture.componentInstance;
    const currentMonthDays = component.calendarDays().filter((d) => d.isCurrentMonth).length;
    expect(currentMonthDays).toBeGreaterThan(27);
  });
});
