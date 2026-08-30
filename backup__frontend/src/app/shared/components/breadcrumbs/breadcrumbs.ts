import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';

import { BreadcrumbItem } from '../../../core/types/breadcrumb.type';
import { Icon } from '../icon/icon';

/**
 * Breadcrumbs derivados automaticamente da árvore de rotas (data.title),
 * reativos ao NavigationEnd. Sempre inicia por "Início" (→ /applications).
 */
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly items = signal<BreadcrumbItem[]>([]);

  constructor() {
    this.build();
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.build());
  }

  private build(): void {
    const crumbs: BreadcrumbItem[] = [{ label: 'Início', href: '/applications' }];

    let snapshot: ActivatedRouteSnapshot | null = this.route.root.snapshot;
    let url = '';

    while (snapshot) {
      const path = snapshot.url.map((s) => s.path).join('/');
      if (path) url += `/${path}`;

      const title = snapshot.data['title'] as string | undefined;
      if (title) crumbs.push({ label: title, href: url || '/' });

      snapshot = snapshot.firstChild;
    }

    this.items.set(crumbs);
  }
}
