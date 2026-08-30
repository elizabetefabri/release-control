package mongodb

import (
	"context"
	"fmt"

	"backend/internal/domain/entity"
	"backend/internal/domain/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type applicationRepository struct {
	collection *mongo.Collection
}

func NewApplicationRepository(db *mongo.Database) repository.ApplicationRepository {
	return &applicationRepository{collection: db.Collection("applications")}
}

func (r *applicationRepository) Create(ctx context.Context, app *entity.Application) error {
	_, err := r.collection.InsertOne(ctx, app)
	if err != nil {
		return fmt.Errorf("falha ao criar aplicação: %w", err)
	}
	return nil
}

func (r *applicationRepository) CreateMany(ctx context.Context, apps []entity.Application) error {
	if len(apps) == 0 {
		return nil
	}
	docs := make([]interface{}, len(apps))
	for i := range apps {
		docs[i] = apps[i]
	}
	_, err := r.collection.InsertMany(ctx, docs)
	if err != nil {
		return fmt.Errorf("falha ao criar aplicações: %w", err)
	}
	return nil
}

func (r *applicationRepository) FindAll(ctx context.Context) ([]entity.Application, error) {
	cur, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("falha ao buscar aplicações: %w", err)
	}
	defer cur.Close(ctx)

	var apps []entity.Application
	if err := cur.All(ctx, &apps); err != nil {
		return nil, fmt.Errorf("falha ao decodificar aplicações: %w", err)
	}
	return apps, nil
}

func (r *applicationRepository) Count(ctx context.Context) (int64, error) {
	count, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, fmt.Errorf("falha ao contar aplicações: %w", err)
	}
	return count, nil
}
