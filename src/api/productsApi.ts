import { Product } from '../types';

const API_URL = 'https://auto-parts-server-test.up.railway.app/api';

export const fetchProducts = async (brand?: string, search?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (brand) params.append('brand', brand);
  if (search) params.append('search', search);
  
  const response = await fetch(`${API_URL}/products?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  
  return response.json();
};

export const fetchBrands = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/brands`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch brands');
  }
  
  return response.json();
};

