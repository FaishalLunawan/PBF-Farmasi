package dto

type CreateProductRequest struct {
	Name  string  `json:"name" binding:"required"`
	Stock int     `json:"stock" binding:"min=0"`
	Price float64 `json:"price" binding:"gt=0"`
}
