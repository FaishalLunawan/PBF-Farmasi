package dto

type CreateOrderRequest struct {
	ProductID       uint `json:"product_id" binding:"required"`
	Quantity        int  `json:"quantity" binding:"required,min=1"`
	DiscountPercent int  `json:"discount_percent"`
}
