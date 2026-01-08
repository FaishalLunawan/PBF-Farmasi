'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/services/productService';
import { createOrder } from '@/services/orderService';
import { toast } from 'react-toastify';
import { ShoppingCart, Package, Hash, Percent, DollarSign, RefreshCw } from 'lucide-react';

export default function OrderForm({ onOrderSuccess }: { onOrderSuccess: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
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
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => 
    (p.id?.toString() || p.ID?.toString()) === selectedProductId
  );

  const calculateEstimatedPrice = () => {
    if (!selectedProduct) return 0;
    
    const price = Number(selectedProduct.price || selectedProduct.Price || 0);
    const subtotal = price * quantity;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      toast.error('Pilih produk terlebih dahulu');
      return;
    }

    if (!selectedProduct) {
      toast.error('Produk tidak ditemukan');
      return;
    }

    const stock = Number(selectedProduct.stock || selectedProduct.Stock || 0);
    if (quantity > stock) {
      toast.error(`Stok tidak mencukupi. Stok tersisa: ${stock}`);
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity minimal 1');
      return;
    }

    if (discount < 0 || discount > 100) {
      toast.error('Diskon harus antara 0-100%');
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        product_id: Number(selectedProductId),
        quantity,
        discount_percent: discount,
      });
      
      toast.success('Order berhasil dibuat!');
      onOrderSuccess();
      setSelectedProductId('');
      setQuantity(1);
      setDiscount(0);
      
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat order');
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedPrice = calculateEstimatedPrice();

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
            Form Order Obat
          </h2>
          <p className="text-gray-600 mt-2">
            Pilih obat, tentukan quantity dan diskon untuk membuat order baru
          </p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={loading || submitting}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Form Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Product Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Pilih Obat</h3>
                <p className="text-sm text-gray-600">Pilih dari daftar obat tersedia</p>
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nama Obat</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="select select-bordered select-lg w-full"
                disabled={loading || submitting}
                required
              >
                <option value="">-- Pilih Obat --</option>
                {products
                  .filter(product => {
                    const stock = Number(product.stock || product.Stock || 0);
                    return stock > 0; 
                  })
                  .map((product) => {
                    const id = product.id || product.ID || '';
                    const name = product.name || product.Name || 'Unknown';
                    const stock = Number(product.stock || product.Stock || 0);
                    const price = Number(product.price || product.Price || 0);
                    
                    return (
                      <option key={id} value={id.toString()}>
                        {name}
                      </option>
                    );
                  })}
              </select>
              {selectedProduct && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">{selectedProduct.name || selectedProduct.Name}</div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">Stok:</span>
                    <span className="font-bold">{Number(selectedProduct.stock || selectedProduct.Stock || 0)} unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Harga:</span>
                    <span className="font-bold">Rp {Number(selectedProduct.price || selectedProduct.Price || 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Quantity</h3>
                  <p className="text-sm text-gray-600">Tentukan jumlah yang dipesan</p>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Jumlah Unit</span>
                  {selectedProduct && (
                    <span className="label-text-alt">
                      Max: {Number(selectedProduct.stock || selectedProduct.Stock || 0)}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct ? Number(selectedProduct.stock || selectedProduct.Stock || 0) : undefined}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(value);
                  }}
                  className="input input-bordered input-lg w-full text-center"
                  disabled={!selectedProductId || submitting}
                  required
                />
              
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Percent className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Diskon</h3>
                  <p className="text-sm text-gray-600">Tentukan persentase diskon</p>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Persentase Diskon</span>
                  <span className="label-text-alt font-bold text-purple-600">{discount}%</span>
                </label>
    
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseInt(e.target.value))}
                  className="range range-primary w-full"
                  disabled={!selectedProductId || submitting}
                />
                
                {/* Range Labels */}
                <div className="flex justify-between text-xs px-1 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                
                {/* Number Input */}
                <div className="mt-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                    className="input input-bordered w-full text-center"
                    disabled={!selectedProductId || submitting}
                  />
                </div>
              
              </div>
            </div>
          </div>

          {/* Column 3: Price Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Estimasi Harga</h3>
                <p className="text-sm text-gray-600">Rincian perhitungan harga</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow">
              <div className="card-body p-6">
                {selectedProductId && selectedProduct ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Harga Satuan:</span>
                        <span className="font-medium">
                          Rp {Number(selectedProduct.price || selectedProduct.Price || 0)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{quantity} unit</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          Rp {(Number(selectedProduct.price || selectedProduct.Price || 0) * quantity)}
                        </span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-red-600">
                          <span>Diskon ({discount}%):</span>
                          <span className="font-medium">
                            - Rp {(Number(selectedProduct.price || selectedProduct.Price || 0) * quantity * discount / 100)}
                          </span>
                        </div>
                      )}
                      
                      <div className="divider my-2"></div>
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Bayar:</span>
                        <span className="text-primary text-2xl">
                          Rp {estimatedPrice}
                        </span>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="mt-8">
                      <button
                        type="submit"
                        className={`btn btn-primary btn-lg w-full ${submitting ? 'loading' : ''}`}
                        disabled={!selectedProductId || submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="loading loading-spinner"></span>
                            Memproses Order...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            Buat Order
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Pilih produk terlebih dahulu untuk melihat estimasi harga</p>
                  </div>
                )}
              </div>
            </div>
            
    
          </div>
        </div>
      </form>
    </div>
  );
}