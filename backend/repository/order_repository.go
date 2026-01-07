package repository

import (
	"PBF-Farmasi/backend/model"

	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db}
}

func (r *OrderRepository) Create(tx *gorm.DB, trx *model.Transaction) error {
	return tx.Create(trx).Error
}
