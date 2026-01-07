package handler

import (
	"net/http"

	"PBF-Farmasi/backend/dto"
	"PBF-Farmasi/backend/service"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	service *service.OrderService
}

func NewOrderHandler(s *service.OrderService) *OrderHandler {
	return &OrderHandler{s}
}

// CreateOrder godoc
// @Summary Buat order
// @Tags Orders
// @Accept json
// @Produce json
// @Param order body dto.CreateOrderRequest true "Order"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /order [post]
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req dto.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.CreateOrder(
		req.ProductID,
		req.Quantity,
		req.DiscountPercent,
	)

	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "order sukses"})
}
