import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { Icon } from '../../shared/components/icon/icon';

interface PlaceholderData {
  title: string;
  icon: string;
  description?: string;
}

/**
 * Página placeholder reutilizável ("em breve") para rotas ainda não
 * implementadas. O título/ícone vêm de `route.data`.
 */
@Component({
  selector: 'app-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss',
})
export class Placeholder {
  private readonly route = inject(ActivatedRoute);

  readonly data = toSignal(
    this.route.data.pipe(
      map(
        (d): PlaceholderData => ({
          title: d['title'] ?? 'Em breve',
          icon: d['icon'] ?? 'sparkles',
          description:
            d['description'] ?? 'Esta área está em construção e será disponibilizada em breve.',
        }),
      ),
    ),
    { initialValue: { title: 'Em breve', icon: 'sparkles' } as PlaceholderData },
  );
}
