'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/services/productService';
import { createOrder } from '@/services/orderService';
import { toast } from 'react-toastify';
import { ShoppingCart, Calculator, Package, RefreshCw } from 'lucide-react';

export default function OrderForm({ onOrderSuccess }: { onOrderSuccess: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const subtotal = selectedProduct.price * quantity;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  const resetForm = () => {
    setSelectedProductId('');
    setQuantity(1);
    setDiscount(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      toast.error('Pilih produk terlebih dahulu');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity minimal 1');
      return;
    }

    if (selectedProduct && quantity > selectedProduct.stock) {
      toast.error(`Stok tidak mencukupi. Stok tersisa: ${selectedProduct.stock}`);
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        product_id: selectedProductId as number,
        quantity,
        discount_percent: discount,
      });
      toast.success('Order berhasil diproses!');
      onOrderSuccess();
      resetForm();
      fetchProducts(); // Refresh product list
    } catch (error: any) {
      toast.error(error.message || 'Order gagal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h2 className="card-title">Form Order Obat</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Package className="w-4 h-4" />
                Pilih Obat
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value ? parseInt(e.target.value) : '')}
              disabled={loading}
              required
            >
              <option value="">-- Pilih Obat --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Stok: {product.stock}) - Rp {product.price.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
            {loading && (
              <span className="label-text-alt text-info mt-2 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Memuat data produk...
              </span>
            )}
          </div>

          {/* Quantity Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantity</span>
              {selectedProduct && (
                <span className="label-text-alt">
                  Stok tersisa: <span className="font-bold">{selectedProduct.stock}</span>
                </span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 100}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Discount Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Diskon (%)</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(parseInt(e.target.value))}
              className="range range-primary range-sm"
            />
            <div className="flex justify-between text-xs px-2">
              <span>0%</span>
              <span className="font-bold">{discount}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Price Calculation */}
          {selectedProduct && (
            <div className="stats shadow bg-base-200">
              <div className="stat">
                <div className="stat-title flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Estimasi Harga
                </div>
                <div className="stat-value text-primary">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </div>
                <div className="stat-desc">
                  {quantity} x Rp {selectedProduct.price.toLocaleString('id-ID')}
                  {discount > 0 && ` - ${discount}% diskon`}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="card-actions justify-end mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-outline"
              disabled={submitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedProductId || submitting}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Memproses...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Buat Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}