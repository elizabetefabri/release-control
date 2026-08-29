package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"backend/config"
	"backend/internal/middleware"

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

	// db := client.Database(cfg.DBName)
	//
	// A partir daqui, para cada novo recurso (ex: "Product"):
	//   1. Crie a entidade em internal/domain/entity/
	//   2. Crie a interface do repositório em internal/domain/repository/
	//   3. Implemente o repositório MongoDB em internal/repository/mongodb/
	//      (use client.Database(cfg.DBName) para obter o *mongo.Database)
	//   4. Crie os use cases em internal/usecase/
	//   5. Crie o handler em internal/handler/ e registre a rota abaixo
	// Veja PADROES.md, seção "Evolução", para o passo a passo completo.

	mux := http.NewServeMux()

	// TODO: registre as rotas dos seus recursos aqui, ex:
	// productHandler.RegisterRoutes(mux)

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
