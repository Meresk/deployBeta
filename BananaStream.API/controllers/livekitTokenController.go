package controllers

import (
	"BananaStream.API/config"
	"github.com/gofiber/fiber/v2"
	"github.com/livekit/protocol/auth"
	"time"
)

func TeacherToken(c *fiber.Ctx) error {
	var request struct {
		Room     string `json:"room"`
		Identity string `json:"identity"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if request.Room == "" || request.Identity == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing room or identity"})
	}

	at := auth.NewAccessToken(config.ApiKey, config.ApiSecret)
	grant := &auth.VideoGrant{Room: request.Room}

	grant.RoomJoin = true
	grant.RoomCreate = true
	grant.RoomAdmin = true

	at.SetVideoGrant(grant).SetValidFor(2 * time.Hour).SetIdentity(request.Identity)

	token, err := at.ToJWT()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}

func StudentToken(c *fiber.Ctx) error {
	var request struct {
		Room     string `json:"room"`
		Identity string `json:"identity"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if request.Room == "" || request.Identity == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing room or identity"})
	}

	at := auth.NewAccessToken(config.ApiKey, config.ApiSecret)
	grant := &auth.VideoGrant{Room: request.Room}

	grant.RoomJoin = true
	grant.SetCanPublish(false)
	grant.SetCanPublishData(true)

	at.SetVideoGrant(grant).SetValidFor(2 * time.Hour).SetIdentity(request.Identity)

	token, err := at.ToJWT()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}
