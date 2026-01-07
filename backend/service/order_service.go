package service

import (
	"errors"
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/repository"

	"gorm.io/gorm"
)

type OrderService struct {
	db          *gorm.DB
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

	return s.db.Transaction(func(tx *gorm.DB) error {

		// 🔐 LOCK ROW
		product, err := s.productRepo.FindByIDForUpdate(tx, productID)
		if err != nil {
			return err
		}

		// ❌ stok tidak cukup
		if product.Stock < qty {
			return errors.New("stok tidak cukup")
		}

		// kurangi stok
		product.Stock -= qty
		if err := tx.Save(product).Error; err != nil {
			return err
		}

		// hitung total
		total := calculateTotal(product.Price, qty, discount)

		order := model.Transaction{
			ProductID: product.ID,
			Quantity:  qty,
			DiscountPercent: discount,
			TotalPrice:    total,
		}

		// simpan order (pakai repo biar konsisten)
		if err := s.orderRepo.Create(tx, &order); err != nil {
			return err
		}

		return nil
	})
}
func calculateTotal(price float64, qty int, discount int) float64 {
	total := price * float64(qty)

	if discount > 0 {
		total = total - (total * float64(discount) / 100)
	}

	return total
}
