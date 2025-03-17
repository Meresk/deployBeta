package controllers

import (
	"BananaStream.API/config"
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go/v2"
)

var roomClient *lksdk.RoomServiceClient

func init() {
	roomClient = lksdk.NewRoomServiceClient(config.LivekitServerURL, config.ApiKey, config.ApiSecret)
}

func Rooms(c *fiber.Ctx) error {
	rooms, err := roomClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{"error": "Failed to fetch rooms", "details": err.Error()},
		)
	}

	roomDto := make([]fiber.Map, len(rooms.Rooms))
	for i, room := range rooms.Rooms {
		roomDto[i] = fiber.Map{
			"name":             room.Name,
			"num_participants": room.NumParticipants,
		}
	}

	return c.JSON(roomDto)
}

func CreateRoom(c *fiber.Ctx) error {
	var request struct {
		RoomName        string  `json:"room_name"`
		MaxParticipants *uint32 `json:"max_participants,omitempty"` // Используем указатель
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if request.RoomName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing room name"})
	}

	// Получаем список комнат для проверки на дубликаты
	rooms, err := roomClient.ListRooms(context.Background(), &livekit.ListRoomsRequest{})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{"error": "Failed to fetch rooms", "details": err.Error()},
		)
	}

	// Проверяем наличие комнаты с таким же названием
	for _, room := range rooms.Rooms {
		if room.Name == request.RoomName {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Room with this name already exists"})
		}
	}

	createRoomRequest := &livekit.CreateRoomRequest{
		Name: request.RoomName,
	}

	// Устанавливаем MaxParticipants только если он не nil
	if request.MaxParticipants != nil {
		createRoomRequest.MaxParticipants = *request.MaxParticipants
	}

	room, err := roomClient.CreateRoom(context.Background(), createRoomRequest)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			fiber.Map{"error": "Failed to create room", "details": err.Error()},
		)
	}

	return c.JSON(room.Name)
}
