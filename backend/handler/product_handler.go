package handler

import (
	"net/http"
	"PBF-Farmasi/backend/dto"
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/service"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	service *service.ProductService
}

func NewProductHandler(s *service.ProductService) *ProductHandler {
	return &ProductHandler{service: s}
}

func (h *ProductHandler) GetProducts(c *gin.Context) {
	products, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req dto.CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input format",
		})
		return
	}

	if req.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Price must be greater than 0",
		})
		return
	}

	product := model.Product{
		Name:  req.Name,
		Stock: req.Stock,
		Price: req.Price,
	}

	if err := h.service.Create(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, product)
}