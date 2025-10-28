import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { fetchProducts, fetchBrands } from '../../api/productsApi';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import Skeleton from '../../components/Skeleton/Skeleton';
import SEO from '../../components/SEO/SEO';
import './Catalog.css';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, selectedBrand]);

  const loadInitialData = async () => {
    try {
      const [productsData, brandsData] = await Promise.all([
        fetchProducts(),
        fetchBrands()
      ]);
      setProducts(productsData);
      setBrands(brandsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(selectedBrand || undefined, search || undefined);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
  };

  return (
    <div className="catalog">
      <SEO 
        title="Каталог" 
        description="Перегляньте наш каталог автозапчастин. Пошук за назвою та фільтр по бренду."
      />
      <header className="catalog-header">
        <h1 className="catalog-title">Каталог автозапчастин</h1>
        <div className="catalog-controls">
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search products by name"
          />
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            className="brand-select"
            aria-label="Filter by brand"
          >
            <option value="">Всі бренди</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="catalog-content">
        {loading && products.length === 0 ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <p>Нічого не знайдено</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;

