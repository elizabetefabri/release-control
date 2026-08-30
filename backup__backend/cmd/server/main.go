package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"backend/config"
	"backend/internal/handler"
	"backend/internal/middleware"
	"backend/internal/repository/mongodb"
	"backend/internal/seed"
	"backend/internal/usecase"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	cfg := config.Load()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("falha ao conectar no MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Printf("erro ao desconectar MongoDB: %v", err)
		}
	}()

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("MongoDB não responde: %v", err)
	}
	log.Printf("conectado ao MongoDB: %s (db: %s)", cfg.MongoURI, cfg.DBName)

	db := client.Database(cfg.DBName)

	userRepo := mongodb.NewUserRepository(db)
	applicationRepo := mongodb.NewApplicationRepository(db)

	authUC := usecase.NewAuthUseCase(userRepo)
	applicationUC := usecase.NewApplicationUseCase(applicationRepo)

	authHandler := handler.NewAuthHandler(authUC)
	applicationHandler := handler.NewApplicationHandler(applicationUC)

	ctx, cancel = context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := seed.Seed(ctx, applicationRepo, userRepo); err != nil {
		log.Fatalf("falha ao fazer seed: %v", err)
	}
	log.Println("seed concluído")

	mux := http.NewServeMux()

	authHandler.RegisterRoutes(mux)
	applicationHandler.RegisterRoutes(mux)

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"` + cfg.DBName + `"}`))
	})

	server := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      middleware.CORS(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("servidor iniciado na porta %s (env: %s)", cfg.ServerPort, cfg.AppEnv)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("erro ao iniciar servidor: %v", err)
	}
}
