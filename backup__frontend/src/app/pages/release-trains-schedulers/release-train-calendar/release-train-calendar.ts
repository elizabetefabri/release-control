import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Icon } from '../../../shared/components/icon/icon';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

@Component({
  selector: 'app-release-train-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DrawerModule, Icon],
  templateUrl: './release-train-calendar.html',
  styleUrl: './release-train-calendar.scss',
})
export class ReleaseTrainCalendar {
  /** Mês/ano exibido. */
  readonly currentDate = signal(new Date());

  /** Nome dos dias da semana (começando no domingo). */
  readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /** Nome dos meses. */
  readonly monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  /** Título do cabeçalho do calendário. */
  protected readonly headerTitle = computed(() => {
    const date = this.currentDate();
    return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
  });

  /** Ano atual para o seletor. */
  protected readonly currentYear = computed(() => this.currentDate().getFullYear());

  /** Lista de anos para o seletor (atual ± 10). */
  protected readonly yearOptions = computed(() => {
    const year = this.currentYear();
    return Array.from({ length: 21 }, (_, i) => year - 10 + i);
  });

  /** Dias a serem renderizados no grid do calendário. */
  protected readonly calendarDays = computed((): CalendarDay[] => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDay[] = [];

    // Dias do mês anterior para preencher o início do grid
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const d = new Date(year, month - 1, day);
      d.setHours(0, 0, 0, 0);

      days.push({
        date: d,
        dayOfMonth: day,
        isCurrentMonth: false,
        isToday: d.getTime() === today.getTime(),
        isPast: d.getTime() < today.getTime(),
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        dayOfMonth: day,
        isCurrentMonth: true,
        isToday: d.getTime() === today.getTime(),
        isPast: d.getTime() < today.getTime(),
      });
    }

    return days;
  });

  /** Dia selecionado para o sidesheet. */
  protected readonly selectedDay = signal<CalendarDay | null>(null);

  /** Estado de abertura do sidesheet. */
  protected readonly drawerOpen = signal(false);

  /** Abre o sidesheet com os detalhes do dia selecionado. */
  protected onDayClick(event: Event, day: CalendarDay): void {
    event.preventDefault();
    this.selectedDay.set(day);
    this.drawerOpen.set(true);
  }

  /** Avança um mês. */
  protected nextMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  /** Volta um mês. */
  protected previousMonth(): void {
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  /** Vai para o mês/ano atual. */
  protected goToToday(): void {
    this.currentDate.set(new Date());
  }

  /** Atualiza o mês pelo seletor. */
  protected onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const d = this.currentDate();
    this.currentDate.set(new Date(d.getFullYear(), Number(select.value), 1));
  }

  /** Atualiza o ano pelo seletor. */
  protected onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const d = this.currentDate();
    this.currentDate.set(new Date(Number(select.value), d.getMonth(), 1));
  }
}
