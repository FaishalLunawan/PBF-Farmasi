package config

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	// Di Docker: host=postgres, Di lokal: host=localhost
	host := "postgres"  // Nama service di docker-compose.yml
	
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host,
		"postgres",  // user
		"postgres",  // password
		"indobat",   // database
		"5432",      // port
	)
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Gagal konek database: " + err.Error())
	}
	
	return db
}