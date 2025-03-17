package models

type Role struct {
	ID   uint   `gorm:"primary_key;auto_increment"`
	Name string `gorm:"type:nvarchar(255);unique;not null"`
}
