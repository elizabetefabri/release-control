/** Package (documentacao.md → Modelos de Dados). */
export interface Package {
  id: string;
  parentId?: string | null;
  applicationId: string;
  taacId: string;
  isBlocked: boolean;
  isActive: boolean;
  commitSha: string;
  pullRequestUrl: string;
  story: string;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
