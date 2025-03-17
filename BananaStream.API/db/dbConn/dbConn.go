package dbConn

import (
	"BananaStream.API/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func Connect() *gorm.DB {
	var err error
	db, err = gorm.Open(mysql.Open(config.DatabaseURL), &gorm.Config{
		// Если нужны логи бд то убрать комментирование
		//Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}
	return db
}
