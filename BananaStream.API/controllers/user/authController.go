package user

import (
	"BananaStream.API/config"
	"BananaStream.API/db/models"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"time"
)

func Login(c *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var user models.User
	if err := db.Preload("Role").Where("login = ?", request.Login).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid password"})
	}

	jwtToken := jwt.New(jwt.SigningMethodHS256)
	claims := jwtToken.Claims.(jwt.MapClaims)
	claims["id"] = user.ID
	claims["login"] = user.Login
	claims["role"] = user.Role.Name
	claims["exp"] = time.Now().Add(time.Hour * 10).Unix() // время истечения токена

	tokenString, err := jwtToken.SignedString([]byte(config.JWTSecret))
	if err != nil {
		log.Infof("Error fetching user:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(fiber.Map{"token": tokenString})
}

func Register(c *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		Login    string `json:"login"`
		Password string `json:"password"`
		RoleID   uint   `json:"role_id"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var existingUser models.User
	if err := db.Where("login = ?", request.Login).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Username already exists"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error hashing password"})
	}

	user := models.User{
		Login:    request.Login,
		Password: string(hashedPassword),
		RoleID:   request.RoleID,
	}
	if err := db.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating user"})
	}

	if err := db.Preload("Role").First(&user, user.ID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error loading user with role"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"user": user})
}
