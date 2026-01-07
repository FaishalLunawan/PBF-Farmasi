'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/services/productService';
import OrderForm from '@/components/OrderForm';
import { Package, PackageCheck, PackageX, TrendingUp, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate statistics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum: number, p: any) => sum + p.stock, 0);
  const outOfStock = products.filter((p: any) => p.stock === 0).length;
  const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-1">
          <OrderForm onOrderSuccess={fetchProducts} />
        </div>

        {/* Products Table */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Daftar Stok Obat
                </h2>
                <button 
                  onClick={fetchProducts} 
                  className="btn btn-sm btn-outline"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : 'Refresh'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Obat</th>
                      <th>Stok</th>
                      <th>Harga</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          <span className="loading loading-spinner loading-lg"></span>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          Tidak ada data produk
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <div className="font-medium">{product.name}</div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              {product.stock}
                              <div className="tooltip" data-tip="Sisa stok">
                                <div className="w-24 bg-base-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      product.stock === 0 ? 'bg-error' :
                                      product.stock <= 10 ? 'bg-warning' :
                                      'bg-success'
                                    }`}
                                    style={{ width: `${Math.min(product.stock, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-bold">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                          </td>
                          <td>
                            {product.stock === 0 ? (
                              <span className="badge badge-error">Habis</span>
                            ) : product.stock <= 10 ? (
                              <span className="badge badge-warning">Rendah</span>
                            ) : (
                              <span className="badge badge-success">Aman</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}