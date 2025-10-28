export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
}

export interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

