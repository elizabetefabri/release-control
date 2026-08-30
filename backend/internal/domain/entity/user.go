package entity

import "time"

type UserRole string

const (
	RoleGuest UserRole = "guest"
	RoleDev   UserRole = "dev"
	RoleRM    UserRole = "rm"
)

type UserStatus string

const (
	StatusPending  UserStatus = "pending"
	StatusActive   UserStatus = "active"
	StatusBlocked  UserStatus = "blocked"
)

type User struct {
	ID        string     `json:"id" bson:"_id,omitempty"`
	Name      string     `json:"name" bson:"name"`
	Email     string     `json:"email" bson:"email"`
	Phone     string     `json:"phone,omitempty" bson:"phone,omitempty"`
	AvatarURL string     `json:"avatarUrl,omitempty" bson:"avatarUrl,omitempty"`
	Role      UserRole   `json:"role" bson:"role"`
	Status    UserStatus `json:"status" bson:"status"`
	Provider  string     `json:"provider,omitempty" bson:"provider,omitempty"`
	LastLoginAt *time.Time `json:"lastLoginAt,omitempty" bson:"lastLoginAt,omitempty"`
	CreatedAt   time.Time  `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt" bson:"updatedAt"`
	Password    string     `json:"-" bson:"password"`
	Token       string     `json:"-" bson:"token"`
	ExpiresAt   *time.Time `json:"-" bson:"expiresAt"`
}
