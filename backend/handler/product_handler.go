package handler

import (
	"net/http"

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

// GetProducts godoc
// @Summary List produk
// @Description Ambil semua data produk
// @Tags Products
// @Produce json
// @Success 200 {array} model.Product
// @Router /products [get]
func (h *ProductHandler) GetProducts(c *gin.Context) {
	products, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// CreateProduct godoc
// @Summary Tambah produk baru
// @Tags Products
// @Accept json
// @Produce json
// @Param product body model.Product true "Product"
// @Success 200 {object} model.Product
// @Router /products [post]
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var product model.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Create(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}
