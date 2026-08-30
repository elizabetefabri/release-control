import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';

import { ApiResponse } from '../../types/api-response.type';
import {
  authenticateMock,
  changeMockEmail,
  changeMockPassword,
  deleteMockUser,
  registerMock,
  updateMockUser,
} from '../../data/users.mock';
import {
  AuthSession,
  AuthUser,
  ChangePasswordDto,
  LoginDto,
  ProfileDto,
  RegisterDto,
} from '../../types/auth.type';

const STORAGE_KEY = 'techbook.session';

/**
 * Serviço de autenticação baseado em signals.
 * A sessão (JWT + usuário) é persistida em localStorage e restaurada
 * na inicialização. Todo acesso ao storage é protegido para SSR.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiUrl}/api/v1/auth`;
  private readonly apiBase = `${environment.apiUrl}/api/v1`;

  private readonly session = signal<AuthSession | null>(this.restoreSession());

  readonly currentUser = computed<AuthUser | null>(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed<boolean>(() => {
    const s = this.session();
    if (!s?.token) return false;
    return new Date(s.expiresAt).getTime() > Date.now();
  });
  readonly isAdmin = computed<boolean>(() => this.currentUser()?.role === 'rm');

  get token(): string | null {
    return this.session()?.token ?? null;
  }

  /** Cadastra um novo usuário. Em modo mock, grava na base em memória. */
  register(dto: RegisterDto): Observable<AuthUser> {
    if (environment.featureToggle.mock) {
      try {
        return of(registerMock(dto));
      } catch (err) {
        return throwError(() => err);
      }
    }
    return this.http.post<ApiResponse<AuthUser>>(`${this.base}/register`, dto).pipe(
      map((res) => {
        if (!res.data) throw new Error('Resposta de cadastro inválida.');
        return res.data;
      }),
    );
  }

  /** Busca o perfil atualizado do usuário autenticado. */
  loadProfile(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.apiBase}/profile`).pipe(
      map((res) => {
        if (!res.data) throw new Error('Perfil inválido.');
        return res.data;
      }),
      tap((user) => this.patchUser(user)),
    );
  }

  /** Atualiza nome, telefone e avatar do próprio usuário. */
  updateProfile(dto: ProfileDto): Observable<AuthUser> {
    if (environment.featureToggle.mock) {
      const email = this.currentUser()?.email;
      if (!email) return throwError(() => new Error('Sessão inválida.'));
      try {
        const user = updateMockUser(email, dto);
        this.patchUser(user);
        return of(user);
      } catch (err) {
        return throwError(() => err);
      }
    }
    return this.http.put<ApiResponse<AuthUser>>(`${this.apiBase}/profile`, dto).pipe(
      map((res) => {
        if (!res.data) throw new Error('Perfil inválido.');
        return res.data;
      }),
      tap((user) => this.patchUser(user)),
    );
  }

  /** Troca a senha do usuário autenticado. */
  changePassword(dto: ChangePasswordDto): Observable<void> {
    if (environment.featureToggle.mock) {
      const email = this.currentUser()?.email;
      if (!email) return throwError(() => new Error('Sessão inválida.'));
      try {
        changeMockPassword(email, dto.currentPassword, dto.newPassword);
        return of(void 0);
      } catch (err) {
        return throwError(() => err);
      }
    }
    return this.http
      .put<ApiResponse<unknown>>(`${this.apiBase}/profile/password`, dto)
      .pipe(map(() => void 0));
  }

  /** Troca o e-mail do usuário autenticado. */
  changeEmail(newEmail: string): Observable<AuthUser> {
    if (environment.featureToggle.mock) {
      const email = this.currentUser()?.email;
      if (!email) return throwError(() => new Error('Sessão inválida.'));
      try {
        const user = changeMockEmail(email, newEmail);
        this.patchUser(user);
        return of(user);
      } catch (err) {
        return throwError(() => err);
      }
    }
    return this.http
      .put<ApiResponse<AuthUser>>(`${this.apiBase}/profile/email`, { email: newEmail })
      .pipe(
        map((res) => {
          if (!res.data) throw new Error('Resposta inválida.');
          return res.data;
        }),
        tap((user) => this.patchUser(user)),
      );
  }

  /** Exclui a conta do usuário autenticado e encerra a sessão. */
  deleteAccount(): Observable<void> {
    if (environment.featureToggle.mock) {
      const email = this.currentUser()?.email;
      if (!email) return throwError(() => new Error('Sessão inválida.'));
      deleteMockUser(email);
      this.clearSession();
      return of(void 0);
    }
    return this.http.delete<ApiResponse<unknown>>(`${this.apiBase}/profile`).pipe(
      map(() => void 0),
      tap(() => this.clearSession()),
    );
  }

  /** Atualiza o usuário na sessão em memória e no storage. */
  private patchUser(user: AuthUser): void {
    const s = this.session();
    if (!s) return;
    const updated: AuthSession = { ...s, user };
    this.session.set(updated);
    if (this.hasStorage()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  login(dto: LoginDto): Observable<AuthSession> {
    if (environment.featureToggle.mock) {
      const session = authenticateMock(dto);
      if (!session) return throwError(() => new Error('E-mail ou senha inválidos.'));
      this.setSession(session);
      return of(session);
    }
    return this.http.post<ApiResponse<AuthSession>>(`${this.base}/login`, dto).pipe(
      map((res) => {
        if (!res.data) throw new Error('Resposta de login inválida.');
        return res.data;
      }),
      tap((session) => this.setSession(session)),
    );
  }

  /**
   * Encerra a sessão localmente e notifica o backend (best effort).
   */
  logout(): Observable<void> {
    if (environment.featureToggle.mock) {
      this.clearSession();
      return of(void 0);
    }
    const notify$ = this.token
      ? this.http.post(`${this.base}/logout`, {}).pipe(
          map(() => void 0),
          catchError(() => of(void 0)),
        )
      : of(void 0);

    return notify$.pipe(tap(() => this.clearSession()));
  }

  /** Limpa a sessão sem chamar o backend (usado pelo interceptor em 401). */
  clearSession(): void {
    this.session.set(null);
    if (this.hasStorage()) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  redirectToLogin(returnUrl?: string): void {
    this.router.navigate(['/login'], returnUrl ? { queryParams: { returnUrl } } : undefined);
  }

  private setSession(session: AuthSession): void {
    this.session.set(session);
    if (this.hasStorage()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }

  private restoreSession(): AuthSession | null {
    if (!this.hasStorage()) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as AuthSession;
      if (!session.token || new Date(session.expiresAt).getTime() <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private hasStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
