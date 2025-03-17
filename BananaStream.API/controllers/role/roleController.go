package role

import (
	"BananaStream.API/db/models"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Create(c *fiber.Ctx, db *gorm.DB) error {
	var request struct {
		Name string `json:"name"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var existingRole models.Role
	if err := db.Where("name = ?", request.Name).First(&existingRole).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Role with this name already exists"})
	}

	role := models.Role{
		Name: request.Name,
	}

	if err := db.Create(&role).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating role"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"role": role})
}

func GetAll(c *fiber.Ctx, db *gorm.DB) error {
	var roles []models.Role

	if err := db.Find(&roles).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error getting roles"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"roles": roles})
}

func Update(c *fiber.Ctx, db *gorm.DB) error {
	id := c.Params("id")
	var request struct {
		Name string `json:"name"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var role models.Role
	if err := db.First(&role, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Role not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error getting roles"})
	}

	role.Name = request.Name

	if err := db.Save(&role).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating role"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"role": role})
}

func Delete(c *fiber.Ctx, db *gorm.DB) error {
	id := c.Params("id")

	if err := db.Delete(&models.Role{}, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Role not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting role"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
