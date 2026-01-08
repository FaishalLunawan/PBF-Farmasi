package main

import (
	"time"

	"PBF-Farmasi/backend/config"
	"PBF-Farmasi/backend/handler"
	"PBF-Farmasi/backend/model"
	"PBF-Farmasi/backend/repository"
	"PBF-Farmasi/backend/routes"
	"PBF-Farmasi/backend/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "PBF-Farmasi/backend/docs"
)

func main() {
	
	db := config.ConnectDB()

	db.AutoMigrate(&model.Product{}, &model.Transaction{})

	productRepo := repository.NewProductRepository(db)
	orderRepo := repository.NewOrderRepository(db)

	productService := service.NewProductService(productRepo)
	orderService := service.NewOrderService(
		db,
		productRepo,
		orderRepo,
	)

	productHandler := handler.NewProductHandler(productService)
	orderHandler := handler.NewOrderHandler(orderService)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8080"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"},
		AllowHeaders:     []string{"*"}, 
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true 
		},
		MaxAge: 12 * time.Hour,
	}))

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	routes.Setup(r, productHandler, orderHandler)

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "PBF Farmasi API is running",
		})
	})

	r.Run(":8080")
}
