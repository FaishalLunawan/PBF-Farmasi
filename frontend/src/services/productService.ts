import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};