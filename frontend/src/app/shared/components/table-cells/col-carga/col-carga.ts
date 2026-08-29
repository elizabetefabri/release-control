import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Célula "Carga" — percentual de carga (0–100). */
@Component({
  selector: 'app-col-carga',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="col-carga">{{ value() }}%</span>`,
  styles: `
    .col-carga {
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class ColCarga {
  readonly value = input.required<number>();
}
