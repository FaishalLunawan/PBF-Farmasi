package dto

type CreateOrderRequest struct {
	ProductID       uint `json:"product_id"`
	Quantity        int  `json:"quantity"`
	DiscountPercent int  `json:"discount_percent"`
}
