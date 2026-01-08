import api from '@/lib/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  
  return response.data;
};