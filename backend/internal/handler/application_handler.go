package handler

import (
	"net/http"

	"backend/internal/usecase"
	"backend/pkg/response"
)

type ApplicationHandler struct {
	uc *usecase.ApplicationUseCase
}

func NewApplicationHandler(uc *usecase.ApplicationUseCase) *ApplicationHandler {
	return &ApplicationHandler{uc: uc}
}

func (h *ApplicationHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/applications", h.List)
}

func (h *ApplicationHandler) List(w http.ResponseWriter, r *http.Request) {
	query := usecase.ParseListQuery(r.URL.Query())

	result, err := h.uc.List(r.Context(), query)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, result)
}
