import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { environment } from '../../../environment/environment';
import { ApiService } from '../api/api-service';
import { RepositoryRow } from '../../models/application.models';
import { PagedResult } from '../../models/pagination.models';
import { ListQuery, toHttpParams } from '../../types/query.type';
import { mockRepositoryPage } from '../../data/repositories.mock';

/**
 * Serviço de integração da tela Repositórios/Applications.
 *
 * Respeita o feature-toggle `environment.featureToggle.mock`:
 *  - mock = true  → usa exclusivamente os dados de `core/data` (sem HTTP);
 *  - mock = false → consome `GET /v1/applications` do backend Go, com
 *    fallback para o mock em caso de erro de rede.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly api = inject(ApiService);

  /** Lista paginada da visão "Repositórios". */
  list(query: ListQuery): Observable<PagedResult<RepositoryRow>> {
    if (environment.featureToggle.mock) {
      return of(mockRepositoryPage(query));
    }

    return this.api
      .getPaged<RepositoryRow>('/v1/applications', toHttpParams(query))
      .pipe(catchError(() => of(mockRepositoryPage(query))));
  }
}
