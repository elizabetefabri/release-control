package entity

import "time"

type Application struct {
	ID             string    `json:"id" bson:"_id,omitempty"`
	RepositoryName string    `json:"repositoryName" bson:"repositoryName"`
	RepositoryURL  string    `json:"repositoryUrl" bson:"repositoryUrl"`
	JourneyName    string    `json:"journeyName,omitempty" bson:"journeyName,omitempty"`
	Path           string    `json:"path" bson:"path"`
	Version        string    `json:"version" bson:"version"`
	Rollout        int       `json:"rollout" bson:"rollout"`
	Load           int       `json:"load" bson:"load"`
	Status         string    `json:"status" bson:"status"`
	Audience       string    `json:"audience" bson:"audience"`
	GMUD           string    `json:"gmud" bson:"gmud"`
	IsActive       bool      `json:"isActive" bson:"isActive"`
	CreatedAt      time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt" bson:"updatedAt"`
}
