import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/productsApi';
import SEO from '../../components/SEO/SEO';
import './Admin.css';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    price: 0,
    originalPrice: undefined,
    image: '',
    description: '',
    rating: undefined,
    reviewCount: undefined,
    discount: undefined,
    articleNumber: '',
    country: '',
    code: '',
    inStock: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        price: 0,
        originalPrice: undefined,
        image: '',
        description: '',
        rating: undefined,
        reviewCount: undefined,
        discount: undefined,
        articleNumber: '',
        country: '',
        code: '',
        inStock: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData as Omit<Product, 'id'>);
      }
      handleCloseModal();
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Помилка при збереженні товару');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      return;
    }

    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Помилка при видаленні товару');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData({ ...formData, [name]: value === '' ? undefined : Number(value) });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filterProducts = (products: Product[], query: string): Product[] => {
    if (!query.trim()) {
      return products;
    }

    const searchTerm = query.toLowerCase().trim();
    return products.filter((product) => {
      const searchableFields = [
        product.name,
        product.brand,
        product.articleNumber,
        product.code,
        product.country,
        product.description,
        product.price?.toString(),
        product.originalPrice?.toString(),
        product.id,
      ].filter(Boolean).map(field => field?.toLowerCase() || '');

      return searchableFields.some(field => field.includes(searchTerm));
    });
  };

  const sortProducts = (products: Product[], field: keyof Product | null, direction: 'asc' | 'desc'): Product[] => {
    if (!field) return products;

    return [...products].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Обробка undefined та null значень
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      // Перетворення в рядки для порівняння
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      // Числове порівняння для ціни та інших числових полів
      if (field === 'price' || field === 'originalPrice' || field === 'rating' || field === 'reviewCount' || field === 'discount') {
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Текстове порівняння
      if (aStr < bStr) return direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      // Якщо клікнули на ту саму колонку - змінюємо напрямок
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Почати сортування по новій колонці
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Product) => {
    if (sortField !== field) {
      return <span className="sort-icon">⇅</span>;
    }
    return sortDirection === 'asc' ? 
      <span className="sort-icon sort-asc">↑</span> : 
      <span className="sort-icon sort-desc">↓</span>;
  };

  const filteredProducts = filterProducts(products, searchQuery);
  const sortedAndFilteredProducts = sortProducts(filteredProducts, sortField, sortDirection);

  return (
    <div className="admin">
      <SEO 
        title="Адмін панель" 
        description="Управління товарами в каталозі автозапчастин"
      />
      
      <div className="admin-header">
        <h1 className="admin-title">Адмін панель</h1>
        <div className="admin-header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Пошук по назві, артикулу, бренду, коду..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="admin-search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Очистити пошук"
              >
                ×
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Додати товар
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Завантаження...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>№</th>
                <th 
                  className="sortable-header" 
                  onClick={() => handleSort('name')}
                >
                  Назва {getSortIcon('name')}
                </th>
                <th 
                  className="sortable-header" 
                  onClick={() => handleSort('brand')}
                >
                  Бренд {getSortIcon('brand')}
                </th>
                <th 
                  className="sortable-header" 
                  onClick={() => handleSort('price')}
                >
                  Ціна {getSortIcon('price')}
                </th>
                <th 
                  className="sortable-header" 
                  onClick={() => handleSort('articleNumber')}
                >
                  Артикул {getSortIcon('articleNumber')}
                </th>
                <th 
                  className="sortable-header" 
                  onClick={() => handleSort('inStock')}
                >
                  В наявності {getSortIcon('inStock')}
                </th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-results-cell">
                    {searchQuery ? 'Товари не знайдено' : 'Товари відсутні'}
                  </td>
                </tr>
              ) : (
                sortedAndFilteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.price} ₴</td>
                    <td>{product.articleNumber || '-'}</td>
                    <td>
                      <span className={`badge ${product.inStock ? 'badge-success' : 'badge-danger'}`}>
                        {product.inStock ? 'Так' : 'Ні'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleOpenModal(product)}
                        >
                          Редагувати
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Редагувати товар' : 'Додати товар'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Назва *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Бренд *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ціна (₴) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Оригінальна ціна (₴)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || ''}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Зображення URL *</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Артикул</label>
                  <input
                    type="text"
                    name="articleNumber"
                    value={formData.articleNumber || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Країна</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Код</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Рейтинг (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                  />
                </div>
                <div className="form-group">
                  <label>Кількість відгуків</label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount || ''}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Знижка (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock || false}
                      onChange={handleInputChange}
                    />
                    В наявності
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Опис *</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Скасувати
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Зберегти зміни' : 'Додати товар'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

