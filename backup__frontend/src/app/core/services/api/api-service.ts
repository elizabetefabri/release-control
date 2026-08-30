import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiResponse } from '../../types/api-response.type';
import { PagedResult } from '../../models/pagination.models';


/**
 * Wrapper genérico sobre o HttpClient para os endpoints `/api/v1/*` do backend.
 * Desembrulha automaticamente o envelope `{ success, data, error }`.
 *
 * Use como base para os serviços de cada recurso (ex: ProductService),
 * seguindo o mesmo padrão de PADROES.md do backend ("Evolução").
 *
 * Exemplo:
 *   this.api.get<Product[]>('/api/v1/products');
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(map((res) => res.data as T));
  }

  /**
   * GET de coleção paginada. Serializa `params` na query-string e
   * devolve o `PagedResult<T>` já desembrulhado do envelope `{ data }`.
   */
  getPaged<T>(path: string, params?: Record<string, string>): Observable<PagedResult<T>> {
    const httpParams = new HttpParams({ fromObject: params ?? {} });
    return this.http
      .get<ApiResponse<PagedResult<T>>>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(map((res) => res.data as PagedResult<T>));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map((res) => res.data as T));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map((res) => res.data as T));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(map((res) => res.data as T));
  }
}
