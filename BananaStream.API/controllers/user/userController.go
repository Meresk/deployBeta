package user

import (
	"BananaStream.API/db/models"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetAll(c *fiber.Ctx, db *gorm.DB) error {
	var users []models.User

	if err := db.Preload("Role").Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error getting users"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"users": users})
}

func Show(c *fiber.Ctx, db *gorm.DB) error {
	id := c.Params("id")
	var user models.User

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error getting users"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": user})
}

func Update(c *fiber.Ctx, db *gorm.DB) error {
	id := c.Params("id")
	var request struct {
		Login string `json:"login"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var user models.User
	if err := db.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error getting users"})
	}

	user.Login = request.Login

	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating user"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"user": user})
}

func Delete(c *fiber.Ctx, db *gorm.DB) error {
	id := c.Params("id")

	if err := db.Delete(&models.User{}, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting user"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
