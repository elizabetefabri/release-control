import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../../core/services/auth/auth.service';
import { Icon } from '../icon/icon';
import { UserAvatar } from '../user-avatar/user-avatar';

/** Link simples de navegação. */
interface NavLink {
  label: string;
  icon: string;
  route: string;
}

/**
 * Item do menu: link direto (`route`) ou grupo com sublinks (`links`),
 * que abre o sidesheet fixo à direita do sidebar.
 */
interface NavItem {
  label: string;
  icon: string;
  route?: string;
  links?: NavLink[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonModule, Icon, UserAvatar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly rolloutLinks: NavLink[] = [
    { label: 'Release Trains', icon: 'git-branch', route: '/release-trains' },
    { label: 'Applications', icon: 'box', route: '/applications' },
    { label: 'Release Trains Schedulers', icon: 'calendar', route: '/release-train-schedulers' },
  ];

  readonly budgetLinks: NavLink[] = [
    { label: 'Lista de eventos', icon: 'git-branch', route: '/lista-eventos' },
    { label: 'Consultar pontuação', icon: 'box', route: '/consultar-pontuacao' },
    { label: 'Registrar melhorias', icon: 'calendar', route: '/registrar-melhorias' },
  ];

  readonly bestTestingLinks: NavLink[] = [
    { label: 'Cadastro de usuários beta', icon: 'git-branch', route: '/user-beta' },
    { label: 'Configurar dispositivo', icon: 'box', route: '/configurar-dispositivo' },
  ];

  /** Navegação completa: links diretos e grupos com sublinks. */
  readonly navItems: NavItem[] = [
    { label: 'Calendário', icon: 'calendar-minus-2', route: '/calendario' },
    { label: 'Quality Budget', icon: 'tool-case', links: this.budgetLinks },
    { label: 'Abrir incidente', icon: 'users', route: '/abrir-incidente' },
    { label: 'Rollouts', icon: 'layout-dashboard', links: this.rolloutLinks },
    { label: 'Best testing', icon: 'users', links: this.bestTestingLinks },
  ];

  /** Rótulo do grupo com sidesheet aberto (null = nenhum). */
  readonly openGroup = signal<string | null>(null);

  /** URL atual (reativa) para destacar o grupo pelo contexto. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Rótulo do grupo ativo conforme a rota atual. */
  private readonly activeGroup = computed(() => {
    const current = this.url();
    return (
      this.navItems.find((i) => i.links?.some((l) => current.startsWith(l.route)))?.label ?? null
    );
  });

  /** Um grupo está ativo quando a rota atual é uma de suas sub-rotas. */
  isGroupActive(item: NavItem): boolean {
    return this.activeGroup() === item.label;
  }

  isOpen(item: NavItem): boolean {
    return this.openGroup() === item.label;
  }

  toggleGroup(item: NavItem): void {
    this.openGroup.update((current) => (current === item.label ? null : item.label));
  }

  closeGroup(): void {
    this.openGroup.set(null);
  }

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
