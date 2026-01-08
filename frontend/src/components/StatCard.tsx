import { Package, PackageCheck, PackageX, TrendingUp } from "lucide-react";
import { getProducts } from "@/services/productService";
import { useState, useEffect } from "react";

export default function StatCard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      console.log(data);
      setProducts(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate statistics
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, p) => sum + (p.Stock || p.stock || 0),
    0
  );

  // Calculate total inventory value
  const totalInventoryValue = products.reduce((sum, p) => {
    const stock = p.Stock || p.stock || 0;
    const price = p.Price || p.price || 0;
    return sum + stock * price;
  }, 0);

  const outOfStock = products.filter(
    (p: any) => (p.Stock || p.stock || 0) === 0
  ).length;
  const lowStock = products.filter((p: any) => {
    const stock = p.Stock || p.stock || 0;
    return stock > 0 && stock <= 10;
  }).length;

  console.log("📊 Statistics:", {
    totalProducts,
    totalStock,
    totalInventoryValue,
    outOfStock,
    lowStock,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-primary">
          <Package className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Produk</div>
        <div className="stat-value">{totalProducts}</div>
        <div className="stat-desc">Jenis obat tersedia</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-secondary">
          <PackageCheck className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Stok</div>
        <div className="stat-value">{totalStock}</div>
        <div className="stat-desc">Unit tersedia</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-warning">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div className="stat-title">Stok Rendah</div>
        <div className="stat-value">{lowStock}</div>
        <div className="stat-desc">≤ 10 unit</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-lg">
        <div className="stat-figure text-error">
          <PackageX className="w-8 h-8" />
        </div>
        <div className="stat-title">Habis</div>
        <div className="stat-value">{outOfStock}</div>
        <div className="stat-desc">Perlu restock</div>
      </div>
    </div>
  );
}
