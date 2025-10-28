import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { fetchProductById } from '../../api/productsApi';
import Loader from '../../components/Loader/Loader';
import SEO from '../../components/SEO/SEO';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load product:', error);
      setLoading(false);
    }
  };

  const handleBackToCatalog = () => {
    navigate('/');
  };

  const handleAddToCart = () => {
    alert('Товар додано до кошика!');
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Товар не знайдено</h2>
        <button onClick={handleBackToCatalog} className="back-button">
          Назад до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <SEO 
        title={product.name} 
        description={product.description}
      />
      <div className="product-details-container">
        <div className="product-image-section">
          <img
            src={`${process.env.PUBLIC_URL}/content_image1.jpg`}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/800x600/eeeeee/555555?text=No+Image';
            }}
          />
        </div>
        
        <div className="product-info-section">
          <div className="product-brand">{product.brand}</div>
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">{product.price.toLocaleString('uk-UA')} ₴</div>
          <p className="product-description">{product.description}</p>
          
          <div className="product-actions">
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-button"
              aria-label="Add to cart"
            >
              Додати в кошик
            </button>
            <button 
              onClick={handleBackToCatalog} 
              className="back-button"
              aria-label="Back to catalog"
            >
              Назад до каталогу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

