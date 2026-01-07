package service

import (
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/repository"
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
	return s.repo.Create(p)
}
