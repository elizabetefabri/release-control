// Ambiente de desenvolvimento (usado por `ng serve` / `npm start`).
// Sobrescrito em build de produção pelo fileReplacements do angular.json,
// que troca este arquivo por environment.prod.ts.
export const environment = {
  production: false,
  // URL base da API do backend (Go). Deve bater com a porta do backend.
  apiUrl: 'http://localhost:8083',

  /**
   * Feature toggles da aplicação.
   * `mock: true` faz TODAS as camadas de dados usarem os mocks de `core/data`
   * (sem chamadas HTTP) — útil enquanto o backend não está conectado.
   * Troque para `false` para consumir a API real.
   */
  featureToggle: {
    mock: true,
  },
};
