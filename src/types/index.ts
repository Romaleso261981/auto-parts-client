export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  articleNumber?: string;
  country?: string;
  code?: string;
  inStock?: boolean;
}

export interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

