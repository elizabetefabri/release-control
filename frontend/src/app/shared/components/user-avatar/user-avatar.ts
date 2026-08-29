import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PopoverModule } from 'primeng/popover';

import { AuthService } from '../../../core/services/auth/auth.service';
import { Icon } from '../icon/icon';

/** Modo do dialog aberto. */
type DialogMode = 'data' | 'email' | 'password' | 'delete' | null;

/**
 * Avatar do usuário com menu de ações:
 * foto (adicionar/alterar/remover) e conta (editar dados, e-mail, senha, excluir).
 * Em modo mock, tudo é persistido na base de `core/data`.
 */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AvatarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    PopoverModule,
    Icon,
  ],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
})
export class UserAvatar {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly photo = computed(() => this.user()?.avatarUrl ?? null);
  readonly initials = computed(() => {
    const name = this.user()?.name?.trim();
    if (!name) return 'US';
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
    return (first + last).toUpperCase() || 'US';
  });

  readonly mode = signal<DialogMode>(null);
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly dataForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
  });

  readonly emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly dialogTitle = computed(() => {
    switch (this.mode()) {
      case 'data':
        return 'Editar dados';
      case 'email':
        return 'Alterar e-mail';
      case 'password':
        return 'Alterar senha';
      case 'delete':
        return 'Excluir conta';
      default:
        return '';
    }
  });

  /** Abre o dialog no modo indicado, pré-preenchendo os formulários. */
  open(mode: Exclude<DialogMode, null>): void {
    this.errorMsg.set(null);
    const user = this.user();
    if (mode === 'data') {
      this.dataForm.reset({ name: user?.name ?? '', phone: user?.phone ?? '' });
    }
    if (mode === 'email') {
      this.emailForm.reset({ email: user?.email ?? '' });
    }
    if (mode === 'password') {
      this.passwordForm.reset({ currentPassword: '', newPassword: '' });
    }
    this.mode.set(mode);
  }

  close(): void {
    this.mode.set(null);
    this.loading.set(false);
  }

  /** Dispara o seletor de arquivo de foto. */
  pickPhoto(input: HTMLInputElement): void {
    input.click();
  }

  /** Lê a foto escolhida e grava no perfil (dataURL). */
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.saveProfile({ avatarUrl: reader.result as string });
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  /** Remove a foto do perfil. */
  removePhoto(): void {
    this.saveProfile({ avatarUrl: '' });
  }

  private saveProfile(patch: { name?: string; phone?: string; avatarUrl?: string }): void {
    const user = this.user();
    if (!user) return;
    this.loading.set(true);
    this.auth
      .updateProfile({
        name: patch.name ?? user.name,
        phone: patch.phone ?? user.phone,
        avatarUrl: patch.avatarUrl ?? user.avatarUrl,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.close();
        },
        error: (err: unknown) => {
          this.errorMsg.set(err instanceof Error ? err.message : 'Não foi possível salvar.');
          this.loading.set(false);
        },
      });
  }

  submitData(): void {
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      return;
    }
    const { name, phone } = this.dataForm.getRawValue();
    this.saveProfile({ name, phone });
  }

  submitEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);
    this.auth.changeEmail(this.emailForm.getRawValue().email).subscribe({
      next: () => this.close(),
      error: (err: unknown) => {
        this.errorMsg.set(err instanceof Error ? err.message : 'Não foi possível alterar.');
        this.loading.set(false);
      },
    });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);
    this.auth.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => this.close(),
      error: (err: unknown) => {
        this.errorMsg.set(err instanceof Error ? err.message : 'Não foi possível alterar.');
        this.loading.set(false);
      },
    });
  }

  confirmDelete(): void {
    this.loading.set(true);
    this.errorMsg.set(null);
    this.auth.deleteAccount().subscribe({
      next: () => {
        this.close();
        this.router.navigateByUrl('/login');
      },
      error: (err: unknown) => {
        this.errorMsg.set(err instanceof Error ? err.message : 'Não foi possível excluir.');
        this.loading.set(false);
      },
    });
  }
}
