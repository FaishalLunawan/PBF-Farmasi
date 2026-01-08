"use client";
import { useState, useEffect } from "react";
import { getProducts } from "@/services/productService";
import OrderForm from "@/components/OrderForm";
import { Package, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import StatCard from "@/components/StatCard";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      console.log(data);
      setProducts(data);
    } catch (error) {
      toast.error("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <StatCard />
      </div>

      <div className="">
        <OrderForm onOrderSuccess={fetchProducts} />
      </div>
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
                disabled={loading}
                className="mt-4 lg:mt-0 btn btn-outline btn-sm"
              >
                {loading ? (
                  <>
                    <span className="ml-2">Memuat...</span>
                  </>
                ) : (
                  <>
                    <span className="ml-2">Refresh</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Nama Obat</th>
                    <th>Stok</th>
                    <th>Harga/Unit</th>
                    <th>Nilai</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr key="loading">
                      <td colSpan={6} className="text-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        Tidak ada data produk
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const id = product.ID || product.id || 0;
                      const name = product.Name || product.name || "Unknown";
                      const stock = product.Stock || product.stock || 0;
                      const price = product.Price || product.price || 0;
                      const inventoryValue = stock * price;

                      return (
                        <tr key={`product-${id}`}>
                          {/* <td>{id}</td> */}
                          <td>
                            <div className="font-medium">{name}</div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              {stock}
                            </div>
                          </td>
                          <td>
                            <span className="font-bold">Rp {price}</span>
                          </td>
                          <td>
                            <span className="font-bold ">
                              Rp {inventoryValue}
                            </span>
                          </td>
                          <td>
                            {stock === 0 ? (
                              <span className="badge badge-error">Habis</span>
                            ) : stock <= 10 ? (
                              <span className="badge badge-warning">
                                Rendah
                              </span>
                            ) : (
                              <span className="badge badge-success">Aman</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
