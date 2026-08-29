# 📊 AGENTE: Datadog Future Integration

## 📌 Objetivo
Preparar o frontend para futura integração com Datadog RUM (Real User Monitoring). Garantir que arquitetura, padrões de código e estrutura facilitam coleta de logs, métricas e rastreamento de jornada do usuário sem refatoração futura.

---

## 🎯 Responsabilidades

### Preparação Arquitetural
- ✅ Validar que código é preparado para observabilidade
- ✅ Revisar padrões de error handling
- ✅ Garantir que ações críticas são "capturaveis"
- ✅ Validar estrutura de logs
- ✅ Revisar naming de eventos/actions
- ✅ Garantir context propagation possível

### Services e Padrões
- ✅ Revisar se services são reutilizáveis
- ✅ Validar HTTP interceptors (para header adicional de tracing)
- ✅ Revisar error handling centralizado
- ✅ Validar que componentes não fazem logs diretamente
- ✅ Garantir que eventos podem ser capturados

### Componentização
- ✅ Validar que componentes têm nome único
- ✅ Revisar naming conventions
- ✅ Garantir que estado pode ser rastreado
- ✅ Validar que ações críticas são claras

### TypeScript Strict
- ✅ Garantir todos os tipos estejam definidos
- ✅ Revisar que nenhum `any` existe
- ✅ Validar que erros têm tipo específico
- ✅ Garantir logging seguro (sem PII)

---

## 📋 Padrões Obrigatórios

### Estrutura de Services (Preparada para Datadog)
```typescript
// ✅ BOM - Service pronto para instrumentação

@Injectable({ providedIn: 'root' })
export class RolloutService {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService); // <-- Future: Datadog

  getRollouts(): Observable<Rollout[]> {
    // Será rastreado: [GET] /api/rollouts
    return this.http.get<Rollout[]>('/api/rollouts').pipe(
      tap((rollouts) => {
        // Log de sucesso (será coletado por Datadog RUM)
        this.logger.info('Rollouts fetched', { count: rollouts.length });
      }),
      catchError((error) => {
        // Error tracking será automático com Datadog
        this.logger.error('Failed to fetch rollouts', { error });
        return of([]);
      })
    );
  }

  startRollout(id: string): Observable<Rollout> {
    // Ação crítica - será rastreada como "user_action"
    this.logger.trackEvent('rollout_started', { rolloutId: id });
    return this.http.post<Rollout>(`/api/rollouts/${id}/start`, {});
  }
}

// ❌ RUIM - Não preparado para observabilidade

export class RolloutService {
  getRollouts() {
    return this.http.get('/api/rollouts').pipe(
      tap((rollouts) => {
        console.log(rollouts); // ❌ Não será coletado
      }),
      catchError((error) => {
        console.error(error); // ❌ Não será rastreado
        return of([]);
      })
    );
  }

  startRollout(id: any) {
    // ❌ Sem tipo, sem evento rastreável
    this.http.post(`/api/rollouts/${id}/start`, {});
  }
}
```

### Logger Service (Preparado para Datadog)
```typescript
// src/app/core/services/logger.service.ts

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly isDev = !environment.production;

  info(message: string, data?: Record<string, any>): void {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, data);
    }
    // Future: dd_logs.logger.info(message, { ...data });
  }

  warn(message: string, data?: Record<string, any>): void {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, data);
    }
    // Future: dd_logs.logger.warn(message, { ...data });
  }

  error(message: string, data?: Record<string, any>): void {
    if (this.isDev) {
      console.error(`[ERROR] ${message}`, data);
    }
    // Future: dd_logs.logger.error(message, { ...data });
  }

  trackEvent(eventName: string, data?: Record<string, any>): void {
    if (this.isDev) {
      console.log(`[EVENT] ${eventName}`, data);
    }
    // Future: window.DD_RUM?.addAction(eventName, data);
  }
}
```

### Error Handling (Preparado para Datadog)
```typescript
// src/app/core/interceptors/error.interceptor.ts

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private logger: LoggerService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorData = {
          url: req.url,
          method: req.method,
          status: error.status,
          message: error.message,
          timestamp: new Date().toISOString()
        };

        // Log com contexto
        this.logger.error(`HTTP ${error.status}: ${req.method} ${req.url}`, errorData);

        // Future: window.DD_RUM?.addError({ error, context: errorData });

        // Redirecionar se 401
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
```

### Componentes (Preparados para Rastreamento)
```typescript
// ✅ BOM - Componente preparado para Datadog

@Component({
  selector: 'app-rollout-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <div class="rollout-list">
      <div *ngFor="let rollout of rollouts$ | async" 
        (click)="selectRollout(rollout)"
        [attr.data-testid]="'rollout-' + rollout.id">
        {{ rollout.name }}
      </div>
    </div>
  `
})
export class RolloutListComponent {
  @Input() rollouts$!: Observable<Rollout[]>;
  @Output() rolloutSelected = new EventEmitter<Rollout>();

  constructor(private logger: LoggerService) {}

  selectRollout(rollout: Rollout): void {
    // Evento será rastreado
    this.logger.trackEvent('rollout_selected', {
      rolloutId: rollout.id,
      rolloutName: rollout.name
    });
    this.rolloutSelected.emit(rollout);
  }
}

// ❌ RUIM - Não preparado

export class RolloutListComponent {
  rollouts: any;

  selectRollout(rollout: any) {
    console.log(rollout); // Não será coletado
  }
}
```

### User Actions (Preparadas para Rastreamento)
```html
<!-- ✅ BOM - Ações identificáveis -->
<button class="btn-start-rollout" 
  (click)="startRollout(rollout)"
  [attr.aria-label]="'Start rollout ' + rollout.name"
  [attr.data-action]="'start_rollout'">
  Start Rollout
</button>

<!-- ✅ BOM - Inputs com identificação -->
<input type="text" 
  placeholder="Search rollouts"
  (input)="onSearch($event)"
  [attr.data-testid]="'search-rollouts'">

<!-- ❌ RUIM - Sem identificação -->
<button (click)="handleClick()">Click me</button>
<input type="text" placeholder="Search">
```

### Naming Conventions (Para Datadog)
```typescript
// ✅ BOM - Nomes descritivos e consistentes
Events:
- rollout_started
- rollout_paused
- rollout_completed
- score_updated
- user_viewed_dashboard
- api_error_occurred

Components:
- app-rollout-list (classe: RolloutListComponent)
- app-score-gauge (classe: ScoreGaugeComponent)
- app-rollout-card (classe: RolloutCardComponent)

Services:
- RolloutService
- ScoreService
- AuthService

// ❌ RUIM - Nomes não descritivos
Events:
- click
- load
- update

Components:
- app-list
- app-card
- MyComponent

Services:
- DataService
- UtilService
```

---

## ✅ Checklist de Preparação Datadog

### Arquitetura
- [ ] Logger Service existe e é reutilizado?
- [ ] Services têm padrão consistente?
- [ ] Error handling é centralizado?
- [ ] HTTP Interceptors estão preparados?
- [ ] TypeScript strict mode ativo?

### Código
- [ ] Nenhum `console.log` direto (usar Logger)?
- [ ] Erros têm tipo específico (não `any`)?
- [ ] Eventos críticos estão mapeados?
- [ ] Componentes têm nomes únicos?
- [ ] Actions têm data-* attributes?

### Eventos
- [ ] Ações críticas podem ser rastreadas?
- [ ] Eventos têm contexto útil?
- [ ] Naming é consistente?
- [ ] Nenhum PII (dados sensíveis) em logs?

### Performance
- [ ] Componentes usam ChangeDetectionStrategy.OnPush?
- [ ] Lazy loading está preparado?
- [ ] Observables têm unsubscribe?
- [ ] Imagens estão otimizadas?

---

## 🎯 Eventos Críticos a Rastrear

Quando Datadog for integrado, rastrear:

```typescript
// Jornada do usuário
- page_view: "/rollout-score"
- user_authenticated: { userId: "...", role: "..." }
- user_action_viewed_dashboard

// Rollout Management
- rollout_list_loaded: { count: 125 }
- rollout_selected: { rolloutId: "...", name: "..." }
- rollout_started: { rolloutId: "..." }
- rollout_paused: { rolloutId: "..." }
- rollout_completed: { rolloutId: "..." }

// Score Management
- score_updated: { rolloutId: "...", newScore: 87 }
- score_gauge_viewed: { rolloutId: "..." }

// Errors
- api_error: { endpoint: "...", status: 500 }
- validation_error: { field: "...", message: "..." }
- network_error: { message: "..." }

// Performance
- page_load_time: { duration: 1234 }
- api_response_time: { endpoint: "...", duration: 456 }
```

---

## 📐 Context e Correlação

Toda ação deve ter contexto:

```typescript
// Contexto obrigatório em todo log/evento
{
  userId: "user-123",
  sessionId: "session-456",
  timestamp: "2024-05-30T10:30:00Z",
  environment: "production",
  version: "1.0.0",
  
  // Contexto de domínio
  rolloutId: "rollout-789",
  scoreValue: 87,
  
  // Performance
  duration: 234,
  cacheHit: true
}
```

---

## 🔐 Segurança e Privacy

**Nunca logar:**
- ❌ Senhas
- ❌ Tokens de autenticação
- ❌ Dados de cartão de crédito
- ❌ PII (email, CPF, etc) sem necessidade
- ❌ Dados sensíveis de negócio

**Sempre sanitizar:**
```typescript
// ❌ RUIM
this.logger.info('User logged in', { email: user.email }); // PII!

// ✅ BOM
this.logger.info('User logged in', { userId: user.id });
```

---

## 📚 Quando Chamar Este Agente

- "Preciso rastrear esta ação?"
- "Como preparar para Datadog?"
- "Qual é o naming correto?"
- "Como logar isto corretamente?"
- "Isso tem PII?"
- "Como estruturar eventos?"
- "Performance está boa?"

---

## 🚀 Futura Integração Datadog (FASE 4)

Quando chegar a Fase 4, apenas adicionar:

```bash
npm install @datadog/browser-rum
```

```typescript
// main.ts
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'YOUR-APP-ID',
  clientToken: 'YOUR-CLIENT-TOKEN',
  site: 'datadoghq.com',
  service: 'rollout-portal',
  env: environment.production ? 'production' : 'development',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  defaultPrivacyLevel: 'mask-user-input'
});

datadogRum.startSessionReplayRecording();
```

E ativar em Logger Service:

```typescript
// No LoggerService, descomente as linhas Datadog
// Resto do código já está pronto!
```

---

## 🎓 Boas Práticas

1. **Preparar hoje** - Economiza refatoração depois
2. **TypeScript strict** - Mais fácil de rastrear tipos
3. **Logger Service** - Centralizar logs
4. **Nomes descritivos** - Eventos claros
5. **Context completo** - Logs com contexto
6. **Error handling** - Centralizar erros
7. **Performance awareness** - Otimizar desde início
8. **Privacy first** - Nunca logar PII sem motivo

---

## 🔗 Próximos Passos do Agente
1. Validar que código é "loggable"
2. Revisar nomes de eventos
3. Garantir Logger Service é usado
4. Sugerir events a rastrear
5. Revisar segurança de logs
6. Preparar integração futura
