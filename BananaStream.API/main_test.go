package main

import (
	"BananaStream.API/db/dbConn"
	"BananaStream.API/db/models"
	"BananaStream.API/routes"
	"bytes"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"io"
	"net/http/httptest"
	"testing"
)

func setupTestApp() (*fiber.App, *gorm.DB) {
	app := fiber.New()

	db := dbConn.Connect()
	err := db.AutoMigrate(&models.User{}, &models.Role{})
	if err != nil {
		panic("Failed to migrate database: " + err.Error())
	}

	routes.SetupRoutes(app, db)

	return app, db
}

func TestStudentToken(t *testing.T) {
	app, _ := setupTestApp()
	defer app.Shutdown()

	tests := []struct {
		name         string
		room         string
		identity     string
		expectedCode int
		expectedBody string
	}{
		{
			name:         "Valid Request",
			room:         "testRoom",
			identity:     "testIdentity",
			expectedCode: fiber.StatusOK,
			expectedBody: `{"token":`,
		},
		{
			name:         "Missing Room",
			room:         "",
			identity:     "testIdentity",
			expectedCode: fiber.StatusBadRequest,
			expectedBody: `{"error":"Missing room or identity"}`,
		},
		{
			name:         "Missing Identity",
			room:         "testRoom",
			identity:     "",
			expectedCode: fiber.StatusBadRequest,
			expectedBody: `{"error":"Missing room or identity"}`,
		},
		{
			name:         "Invalid JSON",
			room:         "testRoom",
			identity:     "testIdentity",
			expectedCode: fiber.StatusBadRequest,
			expectedBody: `{"error":"Invalid request body"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var requestBody []byte
			if tt.name == "Invalid JSON" {
				requestBody = []byte(`invalid json`)
			} else {
				requestPayload := map[string]string{"room": tt.room, "identity": tt.identity}
				requestBody, _ = json.Marshal(requestPayload)
			}

			req := httptest.NewRequest(fiber.MethodPost, "/studentToken", bytes.NewBuffer(requestBody))
			req.Header.Set("Content-Type", "application/json")

			resp, _ := app.Test(req)

			assert.Equal(t, tt.expectedCode, resp.StatusCode)

			body, _ := io.ReadAll(resp.Body)
			assert.Contains(t, string(body), tt.expectedBody)
		})
	}
}
