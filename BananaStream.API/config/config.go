package config

import (
	"fmt"
	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"
	"os"
)

var (
	ApiKey           string
	ApiSecret        string
	DatabaseURL      string
	LivekitServerURL string
	JWTSecret        string
	AllowOrigins     string
	DefaultAdminPass string
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err) // Если файл не найден, программа завершится с ошибкой
	}

	ApiKey = os.Getenv("LIVEKIT_API_KEY")
	ApiSecret = os.Getenv("LIVEKIT_API_SECRET")
	DatabaseURL = os.Getenv("DATABASE_URL")
	LivekitServerURL = os.Getenv("LIVEKIT_SERVER_URL")
	JWTSecret = os.Getenv("JWT_SECRET_KEY")
	AllowOrigins = os.Getenv("ALLOW_ORIGINS")
	DefaultAdminPass = os.Getenv("DEFAULT_ADMIN_PASSWORD")

	var missingVars []string

	if ApiKey == "" {
		missingVars = append(missingVars, "LIVEKIT_API_KEY")
	}
	if ApiSecret == "" {
		missingVars = append(missingVars, "LIVEKIT_API_SECRET")
	}
	if DatabaseURL == "" {
		missingVars = append(missingVars, "DATABASE_URL")
	}
	if LivekitServerURL == "" {
		missingVars = append(missingVars, "LIVEKIT_SERVER_URL")
	}
	if JWTSecret == "" {
		missingVars = append(missingVars, "JWT_SECRET_KEY")
	}
	if AllowOrigins == "" {
		missingVars = append(missingVars, "ALLOW_ORIGINS")
	}

	if DefaultAdminPass == "" {
		log.Info("Default admin password is - admin")
	}

	if len(missingVars) > 0 {
		panic(fmt.Sprintf("Required environment variables are missing: %v", missingVars))
	}
}
