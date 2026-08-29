import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

/** Célula "Rollout" — progresso visual (0–100). */
@Component({
  selector: 'app-col-rollout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBarModule],
  template: `
    <div class="col-rollout">
      <p-progressBar [value]="value()" [showValue]="false" [style]="{ height: '8px' }" />
      <span class="col-rollout__label">{{ value() }}%</span>
    </div>
  `,
  styles: `
    .col-rollout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 8rem;
    }
    .col-rollout p-progressBar {
      flex: 1;
    }
    .col-rollout__label {
      font-variant-numeric: tabular-nums;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      min-width: 2.5rem;
      text-align: right;
    }
  `,
})
export class ColRollout {
  readonly value = input.required<number>();
}
