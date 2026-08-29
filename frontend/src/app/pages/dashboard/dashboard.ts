import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';
import { HealthService } from '../../core/services/health/health-service';

type BackendStatus = 'checking' | 'online' | 'offline';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Footer, Breadcrumbs],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly healthService = inject(HealthService);

  // Exemplo de referência: consome GET /health do backend para provar a
  // conexão. Use o mesmo padrão (inject de um service + signal de estado)
  // ao consumir os próximos endpoints em /api/v1/*.
  readonly backendStatus = signal<BackendStatus>('checking');

  ngOnInit(): void {
    this.healthService.check().subscribe({
      next: () => this.backendStatus.set('online'),
      error: () => this.backendStatus.set('offline'),
    });
  }
}
