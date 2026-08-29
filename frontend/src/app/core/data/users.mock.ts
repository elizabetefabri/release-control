import { AuthSession, AuthUser, LoginDto, RegisterDto } from '../types/auth.type';

/** Usuário mock + senha (apenas para autenticação simulada). */
interface MockCredential {
  password: string;
  user: AuthUser;
}

/**
 * Base de usuários mock para login/cadastro enquanto não há backend.
 * Credenciais de teste:
 *   - admin@itau.com / 123456  (perfil rm)
 *   - liza@itau.com  / 123456  (perfil dev)
 */
const MOCK_USERS: MockCredential[] = [
  {
    password: '123456',
    user: {
      id: 'u-admin',
      name: 'Ana Beatriz',
      email: 'admin@itau.com',
      role: 'rm',
      status: 'active',
      provider: 'mock',
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    password: '123456',
    user: {
      id: 'u-liza',
      name: 'Liza',
      email: 'liza@itau.com',
      role: 'dev',
      status: 'active',
      provider: 'mock',
      createdAt: '2026-01-01T00:00:00Z',
    },
  },
];

/** Gera uma sessão mock (JWT fake) válida por 8 horas. */
export function createMockSession(user: AuthUser): AuthSession {
  const now = Date.now();
  const expiresAt = new Date(now + 8 * 60 * 60 * 1000).toISOString();
  const token = `mock.${btoa(user.email)}.${now}`;
  return { token, expiresAt, user: { ...user, lastLoginAt: new Date(now).toISOString() } };
}

/** Autentica contra a base mock. Retorna a sessão ou null. */
export function authenticateMock(dto: LoginDto): AuthSession | null {
  const found = MOCK_USERS.find(
    (c) => c.user.email.toLowerCase() === dto.email.trim().toLowerCase() && c.password === dto.password,
  );
  return found ? createMockSession(found.user) : null;
}

/** Localiza a credencial de um usuário pelo e-mail. */
function findCredential(email: string): MockCredential {
  const found = MOCK_USERS.find((c) => c.user.email.toLowerCase() === email.trim().toLowerCase());
  if (!found) throw new Error('Usuário não encontrado.');
  return found;
}

/** Atualiza dados do perfil (nome, telefone, foto) na base mock. */
export function updateMockUser(email: string, patch: Partial<AuthUser>): AuthUser {
  const cred = findCredential(email);
  cred.user = { ...cred.user, ...patch, updatedAt: new Date().toISOString() };
  return cred.user;
}

/** Troca a senha na base mock, validando a senha atual. */
export function changeMockPassword(email: string, current: string, next: string): void {
  const cred = findCredential(email);
  if (cred.password !== current) throw new Error('Senha atual incorreta.');
  cred.password = next;
}

/** Troca o e-mail na base mock, garantindo unicidade. */
export function changeMockEmail(email: string, newEmail: string): AuthUser {
  const target = newEmail.trim().toLowerCase();
  if (MOCK_USERS.some((c) => c.user.email.toLowerCase() === target)) {
    throw new Error('E-mail já cadastrado.');
  }
  const cred = findCredential(email);
  cred.user = { ...cred.user, email: target, updatedAt: new Date().toISOString() };
  return cred.user;
}

/** Remove o usuário da base mock. */
export function deleteMockUser(email: string): void {
  const index = MOCK_USERS.findIndex(
    (c) => c.user.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (index >= 0) MOCK_USERS.splice(index, 1);
}

/** Cadastra um novo usuário mock e permite login imediato. */
export function registerMock(dto: RegisterDto): AuthUser {
  const email = dto.email.trim().toLowerCase();
  if (MOCK_USERS.some((c) => c.user.email.toLowerCase() === email)) {
    throw new Error('E-mail já cadastrado.');
  }
  const user: AuthUser = {
    id: `u-${Date.now()}`,
    name: dto.name,
    email,
    phone: dto.phone,
    avatarUrl: dto.avatarUrl,
    role: 'dev',
    status: 'active',
    provider: 'mock',
    createdAt: new Date().toISOString(),
  };
  MOCK_USERS.push({ password: dto.password, user });
  return user;
}
