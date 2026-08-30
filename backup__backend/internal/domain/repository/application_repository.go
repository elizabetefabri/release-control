package repository

import (
	"context"

	"backend/internal/domain/entity"
)

type ApplicationRepository interface {
	Create(ctx context.Context, app *entity.Application) error
	CreateMany(ctx context.Context, apps []entity.Application) error
	FindAll(ctx context.Context) ([]entity.Application, error)
	Count(ctx context.Context) (int64, error)
}
