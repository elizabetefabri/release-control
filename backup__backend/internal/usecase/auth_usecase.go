package usecase

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"backend/internal/domain/entity"
	"backend/internal/domain/repository"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserNotFound      = errors.New("usuário não encontrado")
	ErrInvalidPassword   = errors.New("senha inválida")
	ErrEmailAlreadyUsed  = errors.New("e-mail já cadastrado")
	ErrInvalidEmail      = errors.New("e-mail inválido")
	ErrInvalidCurrentPassword = errors.New("senha atual incorreta")
)

type AuthUseCase struct {
	repo repository.UserRepository
}

func NewAuthUseCase(repo repository.UserRepository) *AuthUseCase {
	return &AuthUseCase{repo: repo}
}

func (uc *AuthUseCase) Register(ctx context.Context, dto RegisterDto) (*entity.User, error) {
	if !strings.Contains(dto.Email, "@") {
		return nil, ErrInvalidEmail
	}

	existing, _ := uc.repo.FindByEmail(ctx, dto.Email)
	if existing != nil {
		return nil, ErrEmailAlreadyUsed
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("falha ao criptografar senha: %w", err)
	}

	now := time.Now()
	user := &entity.User{
		Name:      dto.Name,
		Email:     dto.Email,
		Phone:     dto.Phone,
		AvatarURL: dto.AvatarURL,
		Role:      entity.RoleDev,
		Status:    entity.StatusActive,
		Provider:  "local",
		CreatedAt: now,
		UpdatedAt: now,
		Password:  string(hash),
	}

	if err := uc.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (uc *AuthUseCase) Login(ctx context.Context, dto LoginDto) (*entity.User, string, time.Time, error) {
	user, err := uc.repo.FindByEmail(ctx, dto.Email)
	if err != nil {
		return nil, "", time.Time{}, ErrUserNotFound
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.Password)); err != nil {
		return nil, "", time.Time{}, ErrInvalidPassword
	}

	token, err := generateToken()
	if err != nil {
		return nil, "", time.Time{}, err
	}

	expiresAt := time.Now().Add(8 * time.Hour)
	user.Token = token
	user.ExpiresAt = &expiresAt
	now := time.Now()
	user.LastLoginAt = &now
	user.UpdatedAt = now

	if err := uc.repo.Update(ctx, user); err != nil {
		return nil, "", time.Time{}, err
	}

	return user, token, expiresAt, nil
}

func (uc *AuthUseCase) Logout(ctx context.Context, token string) error {
	user, err := uc.repo.FindByToken(ctx, token)
	if err != nil {
		return nil
	}
	user.Token = ""
	user.ExpiresAt = nil
	user.UpdatedAt = time.Now()
	return uc.repo.Update(ctx, user)
}

func (uc *AuthUseCase) GetProfile(ctx context.Context, token string) (*entity.User, error) {
	return uc.repo.FindByToken(ctx, token)
}

func (uc *AuthUseCase) UpdateProfile(ctx context.Context, token string, dto ProfileDto) (*entity.User, error) {
	user, err := uc.repo.FindByToken(ctx, token)
	if err != nil {
		return nil, ErrUserNotFound
	}
	user.Name = dto.Name
	user.Phone = dto.Phone
	user.AvatarURL = dto.AvatarURL
	user.UpdatedAt = time.Now()
	if err := uc.repo.Update(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (uc *AuthUseCase) ChangePassword(ctx context.Context, token string, dto ChangePasswordDto) error {
	user, err := uc.repo.FindByToken(ctx, token)
	if err != nil {
		return ErrUserNotFound
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.CurrentPassword)); err != nil {
		return ErrInvalidCurrentPassword
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(dto.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("falha ao criptografar senha: %w", err)
	}
	user.Password = string(hash)
	user.UpdatedAt = time.Now()
	return uc.repo.Update(ctx, user)
}

func (uc *AuthUseCase) ChangeEmail(ctx context.Context, token string, newEmail string) (*entity.User, error) {
	if !strings.Contains(newEmail, "@") {
		return nil, ErrInvalidEmail
	}
	user, err := uc.repo.FindByToken(ctx, token)
	if err != nil {
		return nil, ErrUserNotFound
	}
	user.Email = newEmail
	user.UpdatedAt = time.Now()
	if err := uc.repo.Update(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (uc *AuthUseCase) DeleteAccount(ctx context.Context, token string) error {
	user, err := uc.repo.FindByToken(ctx, token)
	if err != nil {
		return ErrUserNotFound
	}
	return uc.repo.Delete(ctx, user.ID)
}

func generateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

type RegisterDto struct {
	Name      string
	Email     string
	Phone     string
	Password  string
	AvatarURL string
}

type LoginDto struct {
	Email    string
	Password string
}

type ProfileDto struct {
	Name      string
	Phone     string
	AvatarURL string
}

type ChangePasswordDto struct {
	CurrentPassword string
	NewPassword     string
}
