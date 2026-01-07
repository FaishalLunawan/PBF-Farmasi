package service

import (
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/repository"
	 "strings"
	 "errors"
)

type ProductService struct {
	repo *repository.ProductRepository
}

func NewProductService(repo *repository.ProductRepository) *ProductService {
	return &ProductService{repo}
}

func (s *ProductService) GetAll() ([]model.Product, error) {
	return s.repo.FindAll()
}

func (s *ProductService) Create(p *model.Product) error {
	err := s.repo.Create(p)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return errors.New("product already exists")
		} 
		return err
	}
	return nil
}
