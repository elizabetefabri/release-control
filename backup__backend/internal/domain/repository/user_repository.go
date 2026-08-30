package repository

import (
	"context"
	"errors"

	"backend/internal/domain/entity"
)

var ErrNotFound = errors.New("não encontrado")

type UserRepository interface {
	Create(ctx context.Context, user *entity.User) error
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	FindByID(ctx context.Context, id string) (*entity.User, error)
	FindByToken(ctx context.Context, token string) (*entity.User, error)
	Update(ctx context.Context, user *entity.User) error
	Delete(ctx context.Context, id string) error
}
