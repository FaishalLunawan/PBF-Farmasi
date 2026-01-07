package service

import (
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/repository"

	"gorm.io/gorm"
)

type OrderService struct {
	db         *gorm.DB
	productRepo *repository.ProductRepository
	orderRepo   *repository.OrderRepository
}

func NewOrderService(
	db *gorm.DB,
	productRepo *repository.ProductRepository,
	orderRepo *repository.OrderRepository,
) *OrderService {
	return &OrderService{
		db:          db,
		productRepo: productRepo,
		orderRepo:   orderRepo,
	}
}

func (s *OrderService) CreateOrder(
	productID uint,
	qty int,
	discount int,
) error {

	tx := s.db.Begin()

	product, err := s.productRepo.FindByIDForUpdate(tx, productID)
	if err != nil {
		tx.Rollback()
		return err
	}

	if product.Stock < qty {
		tx.Rollback()
		return nil
		// return err.New("stok tidak cukup")
	}

	total := (product.Price * float64(qty)) *
		(1 - float64(discount)/100)

	// product.Stock -= qty
	// if err := s.productRepo.Update(tx, product); err != nil {
	// 	tx.Rollback()
	// 	return err
	// }

	trx := &model.Transaction{
		ProductID:       productID,
		Quantity:        qty,
		DiscountPercent: discount,
		TotalPrice:      total,
	}

	if err := s.orderRepo.Create(tx, trx); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
