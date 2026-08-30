package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"backend/internal/domain/entity"
	"backend/internal/usecase"
	"backend/pkg/response"
)

type AuthHandler struct {
	uc *usecase.AuthUseCase
}

func NewAuthHandler(uc *usecase.AuthUseCase) *AuthHandler {
	return &AuthHandler{uc: uc}
}

func (h *AuthHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/v1/auth/register", h.Register)
	mux.HandleFunc("POST /api/v1/auth/login", h.Login)
	mux.HandleFunc("POST /api/v1/auth/logout", h.Logout)
	mux.HandleFunc("GET /api/v1/profile", h.GetProfile)
	mux.HandleFunc("PUT /api/v1/profile", h.UpdateProfile)
	mux.HandleFunc("PUT /api/v1/profile/password", h.ChangePassword)
	mux.HandleFunc("PUT /api/v1/profile/email", h.ChangeEmail)
	mux.HandleFunc("DELETE /api/v1/profile", h.DeleteAccount)
}

type registerRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Password  string `json:"password"`
	AvatarURL string `json:"avatarUrl"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type profileUpdateRequest struct {
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	AvatarURL string `json:"avatarUrl"`
}

type changePasswordRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

type changeEmailRequest struct {
	Email string `json:"email"`
}

type sessionResponse struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expiresAt"`
	User      entity.User  `json:"user"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "requisição inválida")
		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		response.Error(w, http.StatusBadRequest, "nome, e-mail e senha são obrigatórios")
		return
	}

	user, err := h.uc.Register(r.Context(), usecase.RegisterDto{
		Name:      req.Name,
		Email:     req.Email,
		Phone:     req.Phone,
		Password:  req.Password,
		AvatarURL: req.AvatarURL,
	})
	if err != nil {
		if errors.Is(err, usecase.ErrEmailAlreadyUsed) {
			response.Error(w, http.StatusConflict, "e-mail já cadastrado")
			return
		}
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	user.Password = ""
	user.Token = ""
	response.JSON(w, http.StatusCreated, user)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "requisição inválida")
		return
	}

	user, token, expiresAt, err := h.uc.Login(r.Context(), usecase.LoginDto{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) || errors.Is(err, usecase.ErrInvalidPassword) {
			response.Error(w, http.StatusUnauthorized, "e-mail ou senha inválidos")
			return
		}
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	user.Password = ""
	response.JSON(w, http.StatusOK, sessionResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      *user,
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	token := extractToken(r)
	if token != "" {
		_ = h.uc.Logout(r.Context(), token)
	}
	response.JSON(w, http.StatusOK, nil)
}

func (h *AuthHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	token := extractToken(r)
	if token == "" {
		response.Error(w, http.StatusUnauthorized, "não autorizado")
		return
	}

	user, err := h.uc.GetProfile(r.Context(), token)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "sessão inválida")
		return
	}

	user.Password = ""
	response.JSON(w, http.StatusOK, user)
}

func (h *AuthHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	token := extractToken(r)
	if token == "" {
		response.Error(w, http.StatusUnauthorized, "não autorizado")
		return
	}

	var req profileUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "requisição inválida")
		return
	}

	if req.Name == "" {
		response.Error(w, http.StatusBadRequest, "nome é obrigatório")
		return
	}

	user, err := h.uc.UpdateProfile(r.Context(), token, usecase.ProfileDto{
		Name:      req.Name,
		Phone:     req.Phone,
		AvatarURL: req.AvatarURL,
	})
	if err != nil {
		if errors.Is(err, usecase.ErrUserNotFound) {
			response.Error(w, http.StatusUnauthorized, "sessão inválida")
			return
		}
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	user.Password = ""
	response.JSON(w, http.StatusOK, user)
}

func (h *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	token := extractToken(r)
	if token == "" {
		response.Error(w, http.StatusUnauthorized, "não autorizado")
		return
	}

	var req changePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "requisição inválida")
		return
	}

	err := h.uc.ChangePassword(r.Context(), token, usecase.ChangePasswordDto{
		CurrentPassword: req.CurrentPassword,
		NewPassword:     req.NewPassword,
	})
	if err != nil {
		if errors.Is(err, usecase.ErrInvalidCurrentPassword) {
			response.Error(w, http.StatusBadRequest, "senha atual incorreta")
			return
		}
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, nil)
}

func (h *AuthHandler) ChangeEmail(w http.ResponseWriter, r *http.Request) {
	token := extractToken(r)
	if token == "" {
		response.Error(w, http.StatusUnauthorized, "não autorizado")
		return
	}

	var req changeEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "requisição inválida")
		return
	}

	if req.Email == "" {
		response.Error(w, http.StatusBadRequest, "e-mail é obrigatório")
		return
	}

	user, err := h.uc.ChangeEmail(r.Context(), token, req.Email)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	user.Password = ""
	response.JSON(w, http.StatusOK, user)
}

func (h *AuthHandler) DeleteAccount(w http.ResponseWriter, r *http.Request) {
	token := extractToken(r)
	if token == "" {
		response.Error(w, http.StatusUnauthorized, "não autorizado")
		return
	}

	if err := h.uc.DeleteAccount(r.Context(), token); err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusNoContent, nil)
}

func extractToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if auth == "" {
		return ""
	}
	parts := strings.SplitN(auth, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return parts[1]
}
