import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { Icon } from '../icon/icon';

/**
 * Header de página reutilizável (apenas apresentação — sem regra de negócio).
 *
 * Estrutura em 2 linhas (grid PrimeFlex + flex):
 *  - Linha 1: título + perfil do usuário | "Atualizado em ..." + ícone de refresh
 *  - Linha 2: campo de busca (com microfone) | botão de ação
 *
 * Comportamento FUTURO (documentado, não implementado nesta etapa):
 *  - Busca: ao digitar um termo e pressionar Enter, a tabela deve filtrar os itens
 *    correspondentes. A busca deve contemplar repositório, versão, estado
 *    (ex.: concluído ou não), público (Itubers, Clientes) e GMUD.
 *  - Refresh: recarrega os dados da página e atualiza o horário exibido.
 *  - Botão de ação: abre a página de agendamento (Gerenciar Release Train).
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, Icon, Breadcrumbs],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  private readonly router = inject(Router);

  /** Título da página (ex.: "Release Train", "Aplicações"). */
  readonly title = input.required<string>();

  /** Perfil do usuário logado (ex.: "Dev"). Virá do backend futuramente. */
  readonly profile = input<string | null>(null);

  /** Data/hora da última atualização. */
  readonly updatedAt = input<Date | string | null>(null);

  /** Exibe o ícone de refresh ao lado do "Atualizado em". */
  readonly showRefresh = input<boolean>(true);

  /** Exibe a linha 2 (busca + ação). */
  readonly showToolbarRow = input<boolean>(true);

  /** Campo de busca. */
  readonly showSearch = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Busque Repositório, Gmud ou Versão');
  /** Exibe o ícone de microfone no campo de busca. */
  readonly showMic = input<boolean>(true);

  /** Botão de ação à direita. */
  readonly showAction = input<boolean>(true);
  readonly actionLabel = input<string>('Gerenciar Release Train');
  readonly actionIcon = input<string>('settings');

  /** Rota para navegação do botão de ação. */
  readonly actionRoute = input<string>('/release-trains-schedulers');

  protected onActionClick(): void {
    const route = this.actionRoute();
    if (route) {
      this.router.navigate([route]);
    }
  }
}
