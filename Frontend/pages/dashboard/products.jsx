import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './products.module.css';
import {
    getAllProducts,
    getOrganicProducts,
    getHandmadeProducts,
    getFairTradeProducts,
    getCheapestProducts,
    getLowStockProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../api/products';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Stock limit control
    const [stockLimit, setStockLimit] = useState(50);
    const [showStockInput, setShowStockInput] = useState(false);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        productCategory: '',
        productPrice: '',
        stockQuantity: '',
        producerName: '',
        isOrganic: false,
        isHandmade: false,
        fairTradeCertified: false
    });

    useEffect(() => {
        fetchProducts();
    }, [filter, stockLimit]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            switch(filter) {
                case 'organic':
                    data = await getOrganicProducts();
                    break;
                case 'handmade':
                    data = await getHandmadeProducts();
                    break;
                case 'fairtrade':
                    data = await getFairTradeProducts();
                    break;
                case 'cheapest':
                    data = await getCheapestProducts();
                    break;
                case 'lowstock':
                    data = await getLowStockProducts(stockLimit);
                    break;
                default:
                    data = await getAllProducts();
            }
            setProducts(data.products || data.items || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setShowStockInput(newFilter === 'lowstock');
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Open Add Modal
    const handleAddProduct = () => {
        setModalMode('add');
        setFormData({
            productName: '',
            productDescription: '',
            productCategory: '',
            productPrice: '',
            stockQuantity: '',
            producerName: '',
            isOrganic: false,
            isHandmade: false,
            fairTradeCertified: false
        });
        setShowModal(true);
    };

    // Open Edit Modal
    const handleEditProduct = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setFormData({
            productName: product.productName || '',
            productDescription: product.productDescription || '',
            productCategory: product.productCategory || '',
            productPrice: product.productPrice || '',
            stockQuantity: product.stockQuantity || '',
            producerName: product.producerName || '',
            isOrganic: product.isOrganic || false,
            isHandmade: product.isHandmade || false,
            fairTradeCertified: product.fairTradeCertified || false
        });
        setShowModal(true);
    };

    // Open View Modal
    const handleViewProduct = (product) => {
        setModalMode('view');
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Open Delete Modal
    const handleDeleteProduct = (product) => {
        setModalMode('delete');
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Submit form (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const productData = {
                productId: selectedProduct?.productId || `PRD-${Date.now()}`,
                productName: formData.productName,
                productDescription: formData.productDescription,
                productPrice: parseFloat(formData.productPrice),
                productCategory: formData.productCategory,
                isOrganic: formData.isOrganic,
                isHandmade: formData.isHandmade,
                producerName: formData.producerName,
                stockQuantity: parseInt(formData.stockQuantity),
                fairTradeCertified: formData.fairTradeCertified
            };

            if (modalMode === 'add') {
                await createProduct(productData);
            } else if (modalMode === 'edit') {
                await updateProduct(selectedProduct.productId, productData);
            }

            await fetchProducts();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to save product: ${err.message}`);
            console.error('Error saving product:', err);
        }
    };

    // Confirm Delete
    const confirmDelete = async () => {
        setError(null);
        try {
            await deleteProduct(selectedProduct.productId);
            await fetchProducts();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to delete product: ${err.message}`);
            console.error('Error deleting product:', err);
        }
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>🛍️ Local Products</h1>
                        <p>Manage eco-friendly and artisanal products</p>
                    </div>
                    <button className={styles.primaryBtn} onClick={handleAddProduct}>
                        + Add New Product
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button className={styles.dismissError} onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Search */}
                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* Filters */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        {['all', 'organic', 'handmade', 'fairtrade', 'cheapest', 'lowstock'].map(f => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f)}
                                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                                data-filter={f}
                            >
                                {f === 'organic' && '🌱 '}
                                {f === 'handmade' && '✋ '}
                                {f === 'fairtrade' && '🤝 '}
                                {f === 'cheapest' && '💰 '}
                                {f === 'lowstock' && '📦 '}
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}

                        {/* Stock Limit Input */}
                        {showStockInput && (
                            <div className={styles.stockLimitControl}>
                                <label>Stock limit:</label>
                                <input
                                    type="number"
                                    value={stockLimit}
                                    onChange={(e) => setStockLimit(parseInt(e.target.value) || 0)}
                                    min="0"
                                    className={styles.stockInput}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid/Table */}
                <div className={styles.section}>
                    <h2>Products List ({filteredProducts.length})</h2>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className={styles.noData}>No products found</div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Producer</th>
                                    <th>Tags</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.productId || index}>
                                        <td>{product.productName}</td>
                                        <td>
                        <span className={styles.categoryBadge}>
                          {product.productCategory}
                        </span>
                                        </td>
                                        <td>
                        <span className={styles.priceBadge}>
                          €{product.productPrice}
                        </span>
                                        </td>
                                        <td>{product.stockQuantity}</td>
                                        <td>{product.producerName}</td>
                                        <td>
                                            {product.isOrganic && <span className={styles.tagOrganic}>🌱</span>}
                                            {product.isHandmade && <span className={styles.tagHandmade}>✋</span>}
                                            {product.fairTradeCertified && <span className={styles.tagFairTrade}>🤝</span>}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.viewBtn}
                                                    onClick={() => handleViewProduct(product)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteProduct(product)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={closeModal}>×</button>

                            {/* View Mode */}
                            {modalMode === 'view' && selectedProduct && (
                                <div className={styles.viewDetails}>
                                    <h2>Product Details</h2>
                                    <div className={styles.detailSection}>
                                        <h3>Basic Information</h3>
                                        <div className={styles.detailRow}>
                                            <strong>ID:</strong>
                                            <span>{selectedProduct.productId}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Name:</strong>
                                            <span>{selectedProduct.productName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Description:</strong>
                                            <span>{selectedProduct.productDescription}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Category:</strong>
                                            <span>{selectedProduct.productCategory}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Price:</strong>
                                            <span>€{selectedProduct.productPrice}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Stock:</strong>
                                            <span>{selectedProduct.stockQuantity}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Producer:</strong>
                                            <span>{selectedProduct.producerName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Tags:</strong>
                                            <span>
                        {selectedProduct.isOrganic && '🌱 Organic '}
                                                {selectedProduct.isHandmade && '✋ Handmade '}
                                                {selectedProduct.fairTradeCertified && '🤝 Fair Trade'}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add/Edit Mode */}
                            {(modalMode === 'add' || modalMode === 'edit') && (
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <h2>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>

                                    <div className={styles.formSection}>
                                        <h3>Product Information</h3>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Product Name *</label>
                                                <input
                                                    type="text"
                                                    name="productName"
                                                    value={formData.productName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Description</label>
                                                <textarea
                                                    name="productDescription"
                                                    value={formData.productDescription}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Category *</label>
                                                <input
                                                    type="text"
                                                    name="productCategory"
                                                    value={formData.productCategory}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Food and Beverages"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Producer *</label>
                                                <input
                                                    type="text"
                                                    name="producerName"
                                                    value={formData.producerName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Price (€) *</label>
                                                <input
                                                    type="number"
                                                    name="productPrice"
                                                    value={formData.productPrice}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Stock *</label>
                                                <input
                                                    type="number"
                                                    name="stockQuantity"
                                                    value={formData.stockQuantity}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formSection}>
                                        <h3>Product Tags</h3>
                                        <div className={styles.checkboxGroup}>
                                            <input
                                                type="checkbox"
                                                name="isOrganic"
                                                id="isOrganic"
                                                checked={formData.isOrganic}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="isOrganic">🌱 Organic</label>
                                        </div>
                                        <div className={styles.checkboxGroup}>
                                            <input
                                                type="checkbox"
                                                name="isHandmade"
                                                id="isHandmade"
                                                checked={formData.isHandmade}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="isHandmade">✋ Handmade</label>
                                        </div>
                                        <div className={styles.checkboxGroup}>
                                            <input
                                                type="checkbox"
                                                name="fairTradeCertified"
                                                id="fairTradeCertified"
                                                checked={formData.fairTradeCertified}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="fairTradeCertified">🤝 Fair Trade</label>
                                        </div>
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                        <button type="submit">
                                            {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Delete Mode */}
                            {modalMode === 'delete' && selectedProduct && (
                                <div>
                                    <h2>Delete Product</h2>
                                    <p className={styles.warning}>
                                        Are you sure you want to delete "{selectedProduct.productName}"?
                                        This action cannot be undone.
                                    </p>
                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                        <button className={styles.dangerBtn} onClick={confirmDelete}>
                                            Delete Product
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
