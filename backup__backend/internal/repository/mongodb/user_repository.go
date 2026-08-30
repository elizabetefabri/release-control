package mongodb

import (
	"context"
	"errors"
	"fmt"

	"backend/internal/domain/entity"
	"backend/internal/domain/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type userRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) repository.UserRepository {
	return &userRepository{collection: db.Collection("users")}
}

func (r *userRepository) Create(ctx context.Context, user *entity.User) error {
	res, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return fmt.Errorf("falha ao criar usuário: %w", err)
	}
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		user.ID = oid.Hex()
	}
	return nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	var user entity.User
	if err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, fmt.Errorf("falha ao buscar usuário por e-mail: %w", err)
	}
	return &user, nil
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, repository.ErrNotFound
	}
	var user entity.User
	if err := r.collection.FindOne(ctx, bson.M{"_id": oid}).Decode(&user); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, fmt.Errorf("falha ao buscar usuário por id: %w", err)
	}
	return &user, nil
}

func (r *userRepository) FindByToken(ctx context.Context, token string) (*entity.User, error) {
	var user entity.User
	if err := r.collection.FindOne(ctx, bson.M{"token": token}).Decode(&user); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, repository.ErrNotFound
		}
		return nil, fmt.Errorf("falha ao buscar usuário por token: %w", err)
	}
	return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *entity.User) error {
	filter := bson.M{"email": user.Email}
	if user.ID != "" {
		if oid, err := primitive.ObjectIDFromHex(user.ID); err == nil {
			filter = bson.M{"_id": oid}
		}
	}

	// Converte o usuário para bson.M, remove _id (imutável) e faz replace.
	raw, err := bson.Marshal(user)
	if err != nil {
		return fmt.Errorf("falha ao serializar usuário: %w", err)
	}
	var doc bson.M
	if err := bson.Unmarshal(raw, &doc); err != nil {
		return fmt.Errorf("falha ao desserializar usuário: %w", err)
	}
	delete(doc, "_id")

	_, err = r.collection.ReplaceOne(ctx, filter, doc)
	if err != nil {
		return fmt.Errorf("falha ao atualizar usuário: %w", err)
	}
	return nil
}

func (r *userRepository) Delete(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("id não pode ser vazio")
	}
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		return fmt.Errorf("falha ao deletar usuário: %w", err)
	}
	return nil
}
