package models

type User struct {
	ID       uint   `gorm:"primary_key;auto_increment"`
	Login    string `gorm:"type:nvarchar(255);unique;not null"`
	Password string `gorm:"size:255;not null"`

	RoleID uint  `gorm:"not null"`                                      // Внешний ключ
	Role   *Role `gorm:"constraint:OnUpdate:CASCADE;OnDelete:RESTRICT"` // Прямая связь
}
