import React from 'react';
import { ProductCardProps } from '../../types';
import './ProductCard.css';

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="product-card" 
      onClick={() => onClick(product.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(product.id);
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-card-image">
        <img
          src={`${process.env.PUBLIC_URL}/content_image1.jpg`}
          alt={product.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300/eeeeee/555555?text=No+Image';
          }}
        />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-brand">{product.brand}</p>
        <p className="product-card-price">{product.price.toLocaleString('uk-UA')} ₴</p>
      </div>
    </div>
  );
};

export default ProductCard;

