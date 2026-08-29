// Script de inicialização do MongoDB.
// Executado automaticamente na primeira subida do container
// (docker-entrypoint-initdb.d), só roda quando o volume mongo-data
// ainda não existe.
//
// Ajuste o nome do banco abaixo se você mudou DB_NAME no .env.
db = db.getSiblingDB("backend");

// Exemplo — crie suas próprias coleções e índices aqui:
// db.createCollection("example_items");
// db.example_items.createIndex({ createdAt: -1 });

print("MongoDB inicializado com sucesso.");
