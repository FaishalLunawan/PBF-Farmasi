package config

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	dsn := "host=localhost user=postgres password=postgres dbname=indobat port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("gagal konek database")
	}
	return db
}
