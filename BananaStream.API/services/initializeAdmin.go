package services

import (
	"BananaStream.API/db/models"
	"github.com/gofiber/fiber/v2/log"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"os"
)

func InitializeAdmin(db *gorm.DB) {
	var adminRole models.Role
	if err := db.FirstOrCreate(&adminRole, models.Role{Name: "admin"}).Error; err != nil {
		log.Warnw("Failed to initialize admin role", "error", err)
	}

	log.Info("Admin role already exist")

	var adminUser models.User
	if err := db.First(&adminUser, models.User{RoleID: adminRole.ID}).Error; err != nil {
		log.Infof("Admin user does not exist, start creation")

		defaultAdminPass := os.Getenv("DefaultAdminPassword")

		// Устанавливаем значение по умолчанию, если переменная окружения пуста
		if defaultAdminPass == "" {
			defaultAdminPass = "admin"
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultAdminPass), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to generate password: %s", err.Error())
		}

		adminUser = models.User{
			Login:    "admin",
			Password: string(hashedPassword),
			RoleID:   adminRole.ID,
		}

		if err := db.Create(&adminUser).Error; err != nil {
			log.Warnw("Admin user creation failed, error: %s", err.Error())
		}

		return
	}
	log.Info("Admin user already exist")
}
