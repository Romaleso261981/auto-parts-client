import React from 'react';
import { ProductCardProps } from '../../types';
import './ProductCard.css';

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('uk-UA');
  };

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
        <img src={product.image} alt={product.name} />
        {product.discount && (
          <div className="discount-badge">
            Знижка {product.discount}%
          </div>
        )}
        <div className="brand-logo">
          {product.brand}
        </div>
      </div>
      
      <div className="product-card-content">
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          
          {product.rating && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(Math.floor(product.rating))}
              </div>
              <span className="review-count">
                {product.reviewCount || 0} відгук{product.reviewCount !== 1 ? 'ів' : ''}
              </span>
            </div>
          )}
          
          <div className="product-pricing">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">
                {formatPrice(product.originalPrice)} ₴
              </span>
            )}
            <span className="current-price">
              {formatPrice(product.price)} ₴
            </span>
            {product.inStock && (
              <div className="stock-info">
                <span className="stock-icon">📦</span>
                <span className="stock-text">склад</span>
              </div>
            )}
          </div>
          
          <div className="product-details">
            {product.articleNumber && (
              <div className="article-info">
                <span className="article-label">Артикул:</span>
                <span className="article-value">{product.articleNumber}</span>
              </div>
            )}
            {product.country && (
              <div className="country-info">
                <span className="country-flag">🇩🇪</span>
                <span className="country-name">{product.country}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="product-card-footer">
          <button 
            className="buy-button"
            onClick={(e) => {
              e.stopPropagation();
              alert('Товар додано до кошика!');
              console.log('Add to cart:', product.id);
            }}
          >
            КУПИТИ
          </button>
          {product.code && (
            <span className="product-code">
              Код: {product.code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

