package routes

import (
	"BananaStream.API/controllers"
	"BananaStream.API/controllers/role"
	"BananaStream.API/controllers/user"
	"BananaStream.API/middlewares"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {

	//livekit
	app.Post("/teacherToken", middlewares.AuthMiddleware, controllers.TeacherToken)
	app.Post("/studentToken", controllers.StudentToken)

	app.Get("/rooms", controllers.Rooms)
	app.Post("/createRoom", middlewares.AuthMiddleware, controllers.CreateRoom)

	//auth
	app.Post("/login", func(c *fiber.Ctx) error {
		return user.Login(c, db)
	})
	app.Post("/register", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return user.Register(c, db)
	})
	app.Get("/isAuth", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	//role
	app.Get("/roles", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return role.GetAll(c, db)
	})
	app.Post("/roles", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return role.Create(c, db)
	})
	app.Put("/roles/:id", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return role.Update(c, db)
	})
	app.Delete("/roles/:id", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return role.Delete(c, db)
	})

	//user
	app.Get("/users", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return user.GetAll(c, db)
	})
	app.Get("/users/:id", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return user.Show(c, db)
	})
	app.Put("/users/:id", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return user.Update(c, db)
	})
	app.Delete("/users/:id", middlewares.AuthMiddleware, func(c *fiber.Ctx) error {
		return user.Delete(c, db)
	})
}
