# **Mini-Indobat Inventory System** 
Sistem manajemen stok sederhana untuk PBF Farmasi yang bisa menangani keluar-masuk barang dengan akurat, menghitung total harga, dan menangani request bersamaan (Concurrency Safe).
![Mini-Indobat Inventory_page-0001](https://github.com/user-attachments/assets/d0fb4e0d-0f49-4feb-9230-f488237bdaa0)

## **Teknologi**
- **Backend**: Go + Gin (swagger + CORS
- **Frontend**: Next.js (daisyUI + lucide icon + toast reactify)
- **Database**: PostgreSQL
## **API Endpoints**
### Products
```
GET    /api/products     → Ambil semua produk
POST   /api/products     → Buat produk baru (ID auto-generated)
```
### Orders
```
POST   /api/orders       → Buat order baru 
```

**Tes API**: http://localhost:8080/swagger/index.html

## **Instalasi dengan Docker**
Menggunakan docker agar lebih simple dengan satu command langsung menjalankan program 
### Prasyarat:
- Docker
- Docker Compose
### Langkah:
```bash
# 1. Clone repository
git clone https://github.com/FaishalLunawan/PBF-Farmasi.git
cd PBF-Farmasi
# 2. Jalankan semua services
docker-compose up -d
```
## **Setup Database (pgAdmin)**
1. Buka http://localhost:5050
2. Login dengan:
   - Email: `admin@pbf.com`
   - Password: `admin123`
3. Klik **"Add New Server"** → Isi:
   ```
   General:
     Name: PBF-DB (bebas)
   Connection:
     Host: postgres
     Port: 5432
     Username: postgres
     Password: postgres
   ```

## **Perintah Docker Berguna**
```bash
# Start semua
docker-compose up -d

# Stop semua
docker-compose down

# Lihat logs
docker-compose logs -f

# Restart backend
docker-compose restart backend

# Reset lengkap
docker-compose down -v && docker-compose up -d
```


---


