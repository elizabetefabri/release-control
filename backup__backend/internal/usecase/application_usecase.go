package usecase

import (
	"context"
	"fmt"
	"sort"
	"strconv"
	"strings"

	"backend/internal/domain/entity"
	"backend/internal/domain/repository"
)

type ApplicationUseCase struct {
	repo repository.ApplicationRepository
}

func NewApplicationUseCase(repo repository.ApplicationRepository) *ApplicationUseCase {
	return &ApplicationUseCase{repo: repo}
}

type PagedResult struct {
	Items      []entity.Application `json:"items"`
	Pagination Pagination           `json:"pagination"`
}

type Pagination struct {
	Page  int   `json:"page"`
	Total int   `json:"total"`
	Limit int   `json:"limit"`
}

func (uc *ApplicationUseCase) List(ctx context.Context, query ListQuery) (*PagedResult, error) {
	apps, err := uc.repo.FindAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("falha ao listar aplicações: %w", err)
	}

	rows := filterApplications(apps, query)
	rows = sortApplications(rows, query.Sort, query.Order)

	page := query.Page
	if page < 1 {
		page = 1
	}
	limit := query.Limit
	if limit < 1 {
		limit = 10
	}

	total := len(rows)
	start := (page - 1) * limit
	if start > total {
		start = total
	}
	end := start + limit
	if end > total {
		end = total
	}

	return &PagedResult{
		Items: rows[start:end],
		Pagination: Pagination{
			Page:  page,
			Total: total,
			Limit: limit,
		},
	}, nil
}

func filterApplications(apps []entity.Application, query ListQuery) []entity.Application {
	rows := make([]entity.Application, 0, len(apps))
	for _, app := range apps {
		if query.Search != "" {
			term := strings.ToLower(query.Search)
			if !strings.Contains(strings.ToLower(app.RepositoryName), term) &&
				!strings.Contains(strings.ToLower(app.Version), term) &&
				!strings.Contains(strings.ToLower(app.GMUD), term) {
				continue
			}
		}
		if query.Status != "" && app.Status != query.Status {
			continue
		}
		if query.Audience != "" && app.Audience != query.Audience {
			continue
		}
		rows = append(rows, app)
	}
	return rows
}

func sortApplications(rows []entity.Application, sortField, order string) []entity.Application {
	if sortField == "" {
		return rows
	}

	orderMultiplier := 1
	if strings.ToLower(order) == "desc" {
		orderMultiplier = -1
	}

	less := func(i, j int) bool {
		a, b := rows[i], rows[j]
		var cmp int

		switch sortField {
		case "repositoryName":
			cmp = strings.Compare(a.RepositoryName, b.RepositoryName)
		case "version":
			cmp = strings.Compare(a.Version, b.Version)
		case "rollout":
			cmp = a.Rollout - b.Rollout
		case "load":
			cmp = a.Load - b.Load
		case "status":
			cmp = strings.Compare(a.Status, b.Status)
		case "audience":
			cmp = strings.Compare(a.Audience, b.Audience)
		case "gmud":
			cmp = strings.Compare(a.GMUD, b.GMUD)
		case "updatedAt":
			cmp = strings.Compare(a.UpdatedAt.String(), b.UpdatedAt.String())
		default:
			cmp = strings.Compare(a.RepositoryName, b.RepositoryName)
		}

		return cmp*orderMultiplier < 0
	}

	sort.Slice(rows, less)
	return rows
}

type ListQuery struct {
	Page     int
	Limit    int
	Search   string
	Sort     string
	Order    string
	Status   string
	Audience string
}

func ParseListQuery(values map[string][]string) ListQuery {
	q := ListQuery{Page: 1, Limit: 10}

	if v := values["page"]; len(v) > 0 {
		if n, err := strconv.Atoi(v[0]); err == nil && n > 0 {
			q.Page = n
		}
	}
	if v := values["limit"]; len(v) > 0 {
		if n, err := strconv.Atoi(v[0]); err == nil && n > 0 {
			q.Limit = n
		}
	}
	if v := values["search"]; len(v) > 0 {
		q.Search = v[0]
	}
	if v := values["sort"]; len(v) > 0 {
		q.Sort = v[0]
	}
	if v := values["order"]; len(v) > 0 {
		q.Order = v[0]
	}
	if v := values["status"]; len(v) > 0 {
		q.Status = v[0]
	}
	if v := values["audience"]; len(v) > 0 {
		q.Audience = v[0]
	}

	return q
}
