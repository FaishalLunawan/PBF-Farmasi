package model

type Product struct {
	ID    uint    `gorm:"primaryKey"`
	Name  string  `gorm:"uniqueIndex;not null;type:varchar(255)"`
	Stock int
	Price float64
}
