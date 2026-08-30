import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

import { ReleaseStatus } from '../../../../core/types/enums.type';
import { TableBadgeSeverity } from '../../../../core/types/table.type';

/** Severidade do badge por status de release. */
function statusSeverity(status: ReleaseStatus): TableBadgeSeverity {
  switch (status) {
    case ReleaseStatus.FINISHED:
      return 'success';
    case ReleaseStatus.SCHEDULED:
    case ReleaseStatus.IN_PROGRESS:
      return 'info';
    case ReleaseStatus.PAUSED:
    case ReleaseStatus.STEPBACK_REQUESTED:
    case ReleaseStatus.ROLLBACK_REQUESTED:
      return 'warn';
    case ReleaseStatus.ERROR:
    case ReleaseStatus.CANCELLED:
      return 'danger';
    default:
      return 'secondary';
  }
}

/** Célula "Estado" — badge padronizado por status. */
@Component({
  selector: 'app-col-estado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule],
  template: `<p-tag [value]="status()" [severity]="severity()" [rounded]="true" />`,
})
export class ColEstado {
  readonly status = input.required<ReleaseStatus>();
  readonly severity = computed(() => statusSeverity(this.status()));
}
