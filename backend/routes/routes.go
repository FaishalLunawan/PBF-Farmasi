package routes

import (
	"PBF-Farmasi/backend/handler"

	"github.com/gin-gonic/gin"
)

func Setup(
	r *gin.Engine,
	productHandler *handler.ProductHandler,
	orderHandler *handler.OrderHandler,
) {
	api := r.Group("/api")
	{
		api.GET("/products", productHandler.GetProducts)
		api.POST("/products", productHandler.CreateProduct)

		api.POST("/order", orderHandler.CreateOrder)
	}
}
