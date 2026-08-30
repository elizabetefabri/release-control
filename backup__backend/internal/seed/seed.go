package seed

import (
	"context"
	"fmt"
	"time"

	"backend/internal/domain/entity"
	"backend/internal/domain/repository"

	"golang.org/x/crypto/bcrypt"
)

var initialApplications = []entity.Application{
	{RepositoryName: "aplicacao-renda-fixa", RepositoryURL: "https://git.example/aplicacao-renda-fixa", Path: "/aplicacao-renda-fixa", Version: "e7f0c7", Rollout: 0, Load: 0, Status: "WAITING", Audience: "Cliente", GMUD: "CHG0123456"},
	{RepositoryName: "aplicacao-renda-variavel", RepositoryURL: "https://git.example/aplicacao-renda-variavel", Path: "/aplicacao-renda-variavel", Version: "t8g9b1", Rollout: 50, Load: 50, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG8901234"},
	{RepositoryName: "aplicacao-resgate-ativos", RepositoryURL: "https://git.example/aplicacao-resgate-ativos", Path: "/aplicacao-resgate-ativos", Version: "d4a2e3", Rollout: 0, Load: 0, Status: "WAITING", Audience: "Ituber", GMUD: "CHG7890123"},
	{RepositoryName: "virtual-banking-service", RepositoryURL: "https://git.example/virtual-banking-service", Path: "/virtual-banking-service", Version: "c2a5d8", Rollout: 20, Load: 20, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG6789012"},
	{RepositoryName: "virtual-banking-service", RepositoryURL: "https://git.example/virtual-banking-service", Path: "/virtual-banking-service", Version: "b3c7f2", Rollout: 30, Load: 30, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG4567890"},
	{RepositoryName: "web-banking-solution", RepositoryURL: "https://git.example/web-banking-solution", Path: "/web-banking-solution", Version: "f4a2d8", Rollout: 10, Load: 10, Status: "SCHEDULED", Audience: "Ituber", GMUD: "CHG3456789"},
	{RepositoryName: "web-banking-solution", RepositoryURL: "https://git.example/web-banking-solution", Path: "/web-banking-solution", Version: "c9b8a2", Rollout: 40, Load: 40, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG9012345"},
	{RepositoryName: "cloud-banking", RepositoryURL: "https://git.example/cloud-banking", Path: "/cloud-banking", Version: "g5h1c4", Rollout: 60, Load: 60, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG2345678"},
	{RepositoryName: "cloud-banking", RepositoryURL: "https://git.example/cloud-banking", Path: "/cloud-banking", Version: "e7f0c6", Rollout: 70, Load: 70, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG1234567"},
	{RepositoryName: "banking-digital-hub", RepositoryURL: "https://git.example/banking-digital-hub", Path: "/banking-digital-hub", Version: "c2f0c6", Rollout: 80, Load: 80, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG5678901"},
	{RepositoryName: "banking-digital-hub", RepositoryURL: "https://git.example/banking-digital-hub", Path: "/banking-digital-hub", Version: "f1d3d5", Rollout: 90, Load: 90, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG0987654"},
	{RepositoryName: "banking-online-portal", RepositoryURL: "https://git.example/banking-online-portal", Path: "/banking-online-portal", Version: "a9c5e8", Rollout: 20, Load: 20, Status: "PAUSED", Audience: "Cliente", GMUD: "CHG5432109"},
	{RepositoryName: "banking-online-portal", RepositoryURL: "https://git.example/banking-online-portal", Path: "/banking-online-portal", Version: "b8c4f9", Rollout: 20, Load: 20, Status: "PAUSED", Audience: "Cliente", GMUD: "CHG2109876"},
	{RepositoryName: "banking-online-portal", RepositoryURL: "https://git.example/banking-online-portal", Path: "/banking-online-portal", Version: "d3e1b2", Rollout: 30, Load: 30, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG8765432"},
	{RepositoryName: "banking-portal-online", RepositoryURL: "https://git.example/banking-portal-online", Path: "/banking-portal-online", Version: "f4a4c7", Rollout: 40, Load: 40, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG1357902"},
	{RepositoryName: "internet-banking-web", RepositoryURL: "https://git.example/internet-banking-web", Path: "/internet-banking-web", Version: "c1d2e3", Rollout: 50, Load: 50, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG2468013"},
	{RepositoryName: "banking-web-service", RepositoryURL: "https://git.example/banking-web-service", Path: "/banking-web-service", Version: "d9e1b9", Rollout: 60, Load: 60, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG3579124"},
	{RepositoryName: "payments-core", RepositoryURL: "https://git.example/payments-core", Path: "/payments-core", Version: "a1b2c3", Rollout: 100, Load: 100, Status: "FINISHED", Audience: "Cliente", GMUD: "CHG4680235"},
	{RepositoryName: "payments-gateway", RepositoryURL: "https://git.example/payments-gateway", Path: "/payments-gateway", Version: "b2c3d4", Rollout: 0, Load: 0, Status: "ERROR", Audience: "Ituber", GMUD: "CHG5791346"},
	{RepositoryName: "pix-service", RepositoryURL: "https://git.example/pix-service", Path: "/pix-service", Version: "c3d4e5", Rollout: 100, Load: 100, Status: "ROLLBACK_DONE", Audience: "Cliente", GMUD: "CHG6802457"},
	{RepositoryName: "pix-dispatcher", RepositoryURL: "https://git.example/pix-dispatcher", Path: "/pix-dispatcher", Version: "d4e5f6", Rollout: 15, Load: 15, Status: "SCHEDULED", Audience: "Ituber", GMUD: "CHG7913568"},
	{RepositoryName: "cards-issuer", RepositoryURL: "https://git.example/cards-issuer", Path: "/cards-issuer", Version: "e5f6a7", Rollout: 25, Load: 25, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG8024679"},
	{RepositoryName: "cards-processor", RepositoryURL: "https://git.example/cards-processor", Path: "/cards-processor", Version: "f6a7b8", Rollout: 35, Load: 35, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG9135780"},
	{RepositoryName: "loan-engine", RepositoryURL: "https://git.example/loan-engine", Path: "/loan-engine", Version: "a7b8c9", Rollout: 45, Load: 45, Status: "CANCELLED", Audience: "Cliente", GMUD: "CHG0246891"},
	{RepositoryName: "loan-simulator", RepositoryURL: "https://git.example/loan-simulator", Path: "/loan-simulator", Version: "b8c9d0", Rollout: 55, Load: 55, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG1357903"},
	{RepositoryName: "investment-portal", RepositoryURL: "https://git.example/investment-portal", Path: "/investment-portal", Version: "c9d0e1", Rollout: 65, Load: 65, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG2468014"},
	{RepositoryName: "investment-advisor", RepositoryURL: "https://git.example/investment-advisor", Path: "/investment-advisor", Version: "d0e1f2", Rollout: 75, Load: 75, Status: "STEPBACK_REQUESTED", Audience: "Ituber", GMUD: "CHG3579125"},
	{RepositoryName: "insurance-hub", RepositoryURL: "https://git.example/insurance-hub", Path: "/insurance-hub", Version: "e1f2a3", Rollout: 85, Load: 85, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG4680236"},
	{RepositoryName: "insurance-claims", RepositoryURL: "https://git.example/insurance-claims", Path: "/insurance-claims", Version: "f2a3b4", Rollout: 95, Load: 95, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG5791347"},
	{RepositoryName: "onboarding-service", RepositoryURL: "https://git.example/onboarding-service", Path: "/onboarding-service", Version: "a3b4c5", Rollout: 100, Load: 100, Status: "FINISHED", Audience: "Cliente", GMUD: "CHG6802458"},
	{RepositoryName: "kyc-service", RepositoryURL: "https://git.example/kyc-service", Path: "/kyc-service", Version: "b4c5d6", Rollout: 5, Load: 5, Status: "WAITING", Audience: "Ituber", GMUD: "CHG7913569"},
	{RepositoryName: "fraud-detection", RepositoryURL: "https://git.example/fraud-detection", Path: "/fraud-detection", Version: "c5d6e7", Rollout: 100, Load: 100, Status: "STEPBACK_DONE", Audience: "Cliente", GMUD: "CHG8024680"},
	{RepositoryName: "notifications-service", RepositoryURL: "https://git.example/notifications-service", Path: "/notifications-service", Version: "d6e7f8", Rollout: 22, Load: 22, Status: "IN_PROGRESS", Audience: "Ituber", GMUD: "CHG9135781"},
	{RepositoryName: "statements-service", RepositoryURL: "https://git.example/statements-service", Path: "/statements-service", Version: "e7f8a9", Rollout: 33, Load: 33, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG0246892"},
	{RepositoryName: "accounts-service", RepositoryURL: "https://git.example/accounts-service", Path: "/accounts-service", Version: "f8a9b0", Rollout: 44, Load: 44, Status: "IN_PROGRESS", Audience: "Cliente", GMUD: "CHG1357904"},
}

func Seed(ctx context.Context, db repository.ApplicationRepository, userRepo repository.UserRepository) error {
	if err := seedUser(ctx, userRepo); err != nil {
		return err
	}

	if err := seedApplications(ctx, db); err != nil {
		return err
	}

	return nil
}

func seedUser(ctx context.Context, userRepo repository.UserRepository) error {
	_, err := userRepo.FindByEmail(ctx, "dev@example.com")
	if err == nil {
		return nil
	}
	if err != repository.ErrNotFound {
		return fmt.Errorf("falha ao verificar usuário seed: %w", err)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("falha ao criptografar senha seed: %w", err)
	}

	now := time.Now()
	user := &entity.User{
		Name:      "Dev Usuário",
		Email:     "dev@example.com",
		Phone:     "11999999999",
		AvatarURL: "",
		Role:      entity.RoleDev,
		Status:    entity.StatusActive,
		Provider:  "local",
		CreatedAt: now,
		UpdatedAt: now,
		Password:  string(hash),
	}

	return userRepo.Create(ctx, user)
}

func seedApplications(ctx context.Context, db repository.ApplicationRepository) error {
	count, err := db.Count(ctx)
	if err != nil {
		return fmt.Errorf("falha ao contar aplicações: %w", err)
	}
	if count > 0 {
		return nil
	}

	base := time.Date(2026, 1, 19, 19, 15, 0, 0, time.UTC)
	apps := make([]entity.Application, len(initialApplications))
	for i, a := range initialApplications {
		a.ID = ""
		a.JourneyName = ""
		a.IsActive = true
		a.CreatedAt = base
		a.UpdatedAt = base.Add(time.Duration(i) * 15 * time.Minute)
		apps[i] = a
	}

	if err := db.CreateMany(ctx, apps); err != nil {
		return fmt.Errorf("falha ao inserir aplicações seed: %w", err)
	}
	return nil
}
