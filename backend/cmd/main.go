package main

import (
	"PBF-Farmasi/backend/config"
	"PBF-Farmasi/backend/handler"
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/repository"
	"PBF-Farmasi/backend/routes"
	"PBF-Farmasi/backend/service"

	"github.com/gin-gonic/gin"

	_"PBF-Farmasi/backend/docs"

	ginSwagger "github.com/swaggo/gin-swagger"
	swaggerFiles "github.com/swaggo/files"
)

// @title PBF Farmasi API
// @version 1.0
// @description Mini Inventory System
// @host localhost:8080
// @BasePath /api
func main() {
	db := config.ConnectDB()

	// Auto migrate
	db.AutoMigrate(&model.Product{}, &model.Transaction{})

	// ===== Repository =====
	productRepo := repository.NewProductRepository(db)
	orderRepo := repository.NewOrderRepository(db)

	// ===== Service =====
	productService := service.NewProductService(productRepo)
	orderService := service.NewOrderService(
		db,
		productRepo,
		orderRepo,
	)

	// ===== Handler =====
	productHandler := handler.NewProductHandler(productService)
	orderHandler := handler.NewOrderHandler(orderService)

	r := gin.Default()

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Routes
	routes.Setup(r, productHandler, orderHandler)
	r.Run(":8080")
}
