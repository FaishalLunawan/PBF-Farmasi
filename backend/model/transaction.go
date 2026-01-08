package model

import "time"

type Transaction struct {
	ID              uint    `gorm:"primaryKey;autoIncrement"`
	ProductID       uint
	Quantity        int		`gorm:"not null"`
	DiscountPercent int
	TotalPrice      float64
	CreatedAt       time.Time
}
