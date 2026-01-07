import api from '@/lib/api';

export interface OrderRequest {
  product_id: number;
  quantity: number;
  discount_percent: number;
}

export const createOrder = async (data: OrderRequest): Promise<any> => {
  const response = await api.post('/order', data);
  return response.data;
};