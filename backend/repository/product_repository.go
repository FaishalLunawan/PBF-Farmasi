package repository

import (
	"PBF-Farmasi/backend/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db}
}

func (r *ProductRepository) Create(p *model.Product) error {
	return r.db.Clauses(clause.Returning{}).Create(p).Error
}

func (r *ProductRepository) FindAll() ([]model.Product, error) {
	var products []model.Product
	return products, r.db.Find(&products).Error
}

func (r *ProductRepository) FindByIDForUpdate(
	tx *gorm.DB,
	id uint,
) (*model.Product, error) {

	var product model.Product
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
		First(&product, id).Error

	if err != nil {
		return nil, err
	}

	return &product, nil
}


