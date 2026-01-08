package model

type Product struct {
	ID    uint    `gorm:"primaryKey;autoIncrement"`
	Name  string  `gorm:"uniqueIndex;not null"`
	Stock int     `gorm:"not null;default:0"`
	Price float64 `gorm:"not null;check:price > 0"`
}

type CreateProductRequest struct {
	Name  string  `gorm:"uniqueIndex;not null"`
	Stock int     `gorm:"not null;default:0"`
	Price float64 `gorm:"not null;check:price > 0"`
}
