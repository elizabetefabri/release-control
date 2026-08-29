// Ambiente de produção (usado em `ng build` / `ng build --configuration production`).
export const environment = {
  production: true,
  // Troque pela URL pública da API deste projeto em produção.
  apiUrl: 'https://api.SEU-PROJETO.com',

  /**
   * Em produção o mock fica desligado por padrão — consome a API real.
   * (Pode ser ligado temporariamente para demos.)
   */
  featureToggle: {
    mock: false,
  },
};
