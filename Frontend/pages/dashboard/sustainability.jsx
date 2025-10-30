import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './sustainability.module.css';
import {
    getAllIndicators,
    getCarbonLeaders,
    getRenewableLeaders,
    getWaterEfficient,
    createIndicator,
    updateIndicator,
    deleteIndicator
} from '../api/sustainability';

export default function Sustainability() {
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // Default to 'all'
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedIndicator, setSelectedIndicator] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        indicatorName: '',
        indicatorType: 'CarbonFootprint',
        indicatorValue: '',
        measurementUnit: '',
        targetValue: '',
        measurementDate: ''
    });

    useEffect(() => {
        fetchIndicators();
    }, [filter]);

    const fetchIndicators = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            console.log('Fetching indicators with filter:', filter);

            switch(filter) {
                case 'all':
                    data = await getAllIndicators();
                    break;
                case 'carbon':
                    data = await getCarbonLeaders();
                    break;
                case 'renewable':
                    data = await getRenewableLeaders();
                    break;
                case 'water':
                    data = await getWaterEfficient();
                    break;
                default:
                    data = await getAllIndicators();
            }

            console.log('Raw API response:', data);

            // Handle different response structures
            let indicatorsArray = [];

            if (Array.isArray(data)) {
                indicatorsArray = data;
            } else if (data && Array.isArray(data.indicators)) {
                indicatorsArray = data.indicators;
            } else if (data && Array.isArray(data.items)) {
                indicatorsArray = data.items;
            } else if (data && Array.isArray(data.data)) {
                indicatorsArray = data.data;
            } else if (data && typeof data === 'object') {
                indicatorsArray = [data];
            }

            console.log('Processed indicators array:', indicatorsArray);
            setIndicators(indicatorsArray);

        } catch (error) {
            console.error('Error fetching indicators:', error);
            console.error('Error response:', error.response);

            const errorMsg = error.response?.data?.detail
                || error.response?.data?.message
                || error.message
                || 'Failed to load indicators. Please check if the backend is running.';

            setError(errorMsg);
            setIndicators([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredIndicators = Array.isArray(indicators)
        ? indicators.filter(indicator =>
            indicator.indicatorName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
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
    const handleAddIndicator = () => {
        setModalMode('add');
        setFormData({
            indicatorName: '',
            indicatorType: 'CarbonFootprint',
            indicatorValue: '',
            measurementUnit: '',
            targetValue: '',
            measurementDate: ''
        });
        setShowModal(true);
    };

    // Open Edit Modal
    const handleEditIndicator = (indicator) => {
        setModalMode('edit');
        setSelectedIndicator(indicator);
        setFormData({
            indicatorName: indicator.indicatorName || '',
            indicatorType: indicator.indicatorType || 'CarbonFootprint',
            indicatorValue: indicator.indicatorValue || '',
            measurementUnit: indicator.measurementUnit || '',
            targetValue: indicator.targetValue || '',
            measurementDate: indicator.measurementDate || ''
        });
        setShowModal(true);
    };

    // Open View Modal
    const handleViewIndicator = (indicator) => {
        setModalMode('view');
        setSelectedIndicator(indicator);
        setShowModal(true);
    };

    // Open Delete Modal
    const handleDeleteIndicator = (indicator) => {
        setModalMode('delete');
        setSelectedIndicator(indicator);
        setShowModal(true);
    };

    // Submit form (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const indicatorData = {
                indicatorId: selectedIndicator?.indicatorId || `IND-${Date.now()}`,
                indicatorName: formData.indicatorName,
                indicatorType: formData.indicatorType,
                indicatorValue: parseFloat(formData.indicatorValue),
                measurementUnit: formData.measurementUnit,
                targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
                measurementDate: formData.measurementDate || null
            };

            if (modalMode === 'add') {
                await createIndicator(indicatorData);
            } else if (modalMode === 'edit') {
                await updateIndicator(selectedIndicator.indicatorId, {
                    indicatorValue: parseFloat(formData.indicatorValue),
                    targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null
                });
            }

            await fetchIndicators();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to save indicator: ${err.message}`);
            console.error('Error saving indicator:', err);
        }
    };

    // Confirm Delete
    const confirmDelete = async () => {
        setError(null);
        try {
            await deleteIndicator(selectedIndicator.indicatorId);
            await fetchIndicators();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to delete indicator: ${err.message}`);
            console.error('Error deleting indicator:', err);
        }
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedIndicator(null);
    };

    // Get indicator type badge color
    const getTypeColor = (type) => {
        switch(type) {
            case 'CarbonFootprint': return styles.typeCarbonFootprint;
            case 'RenewableEnergyUsage': return styles.typeRenewableEnergy;
            case 'WaterConsumption': return styles.typeWaterConsumption;
            default: return styles.typeDefault;
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>🌱 Sustainability Indicators</h1>
                        <p>Monitor and manage environmental performance metrics</p>
                    </div>
                    <button className={styles.primaryBtn} onClick={handleAddIndicator}>
                        + Add New Indicator
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
                        placeholder="Search indicators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* Filters - 4 Options Now */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                            data-filter="all"
                        >
                            📊 All
                        </button>
                        <button
                            onClick={() => handleFilterChange('carbon')}
                            className={`${styles.filterBtn} ${filter === 'carbon' ? styles.active : ''}`}
                            data-filter="carbon"
                        >
                            🏭 Carbon
                        </button>
                        <button
                            onClick={() => handleFilterChange('renewable')}
                            className={`${styles.filterBtn} ${filter === 'renewable' ? styles.active : ''}`}
                            data-filter="renewable"
                        >
                            ⚡ Renewable
                        </button>
                        <button
                            onClick={() => handleFilterChange('water')}
                            className={`${styles.filterBtn} ${filter === 'water' ? styles.active : ''}`}
                            data-filter="water"
                        >
                            💧 Water
                        </button>
                    </div>
                </div>

                {/* Indicators Table */}
                <div className={styles.section}>
                    <h2>Indicators List ({filteredIndicators.length})</h2>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading indicators...</p>
                        </div>
                    ) : filteredIndicators.length === 0 ? (
                        <div className={styles.noData}>No indicators found</div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Unit</th>
                                    <th>Target</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredIndicators.map((indicator, index) => (
                                    <tr key={indicator.indicatorId || index}>
                                        <td>{indicator.indicatorName}</td>
                                        <td>
                        <span className={`${styles.typeBadge} ${getTypeColor(indicator.indicatorType)}`}>
                          {indicator.indicatorType}
                        </span>
                                        </td>
                                        <td>
                        <span className={styles.valueBadge}>
                          {indicator.indicatorValue}
                        </span>
                                        </td>
                                        <td>{indicator.measurementUnit}</td>
                                        <td>{indicator.targetValue || 'N/A'}</td>
                                        <td>{indicator.measurementDate ? new Date(indicator.measurementDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.viewBtn}
                                                    onClick={() => handleViewIndicator(indicator)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() => handleEditIndicator(indicator)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteIndicator(indicator)}
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

                {/* Modal - Same as before */}
                {showModal && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={closeModal}>×</button>

                            {/* View Mode */}
                            {modalMode === 'view' && selectedIndicator && (
                                <div className={styles.viewDetails}>
                                    <h2>Indicator Details</h2>
                                    <div className={styles.detailSection}>
                                        <h3>Basic Information</h3>
                                        <div className={styles.detailRow}>
                                            <strong>ID:</strong>
                                            <span>{selectedIndicator.indicatorId}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Name:</strong>
                                            <span>{selectedIndicator.indicatorName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Type:</strong>
                                            <span>{selectedIndicator.indicatorType}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Value:</strong>
                                            <span>{selectedIndicator.indicatorValue}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Unit:</strong>
                                            <span>{selectedIndicator.measurementUnit}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Target Value:</strong>
                                            <span>{selectedIndicator.targetValue || 'Not set'}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Measurement Date:</strong>
                                            <span>{selectedIndicator.measurementDate ? new Date(selectedIndicator.measurementDate).toLocaleString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add/Edit Mode */}
                            {(modalMode === 'add' || modalMode === 'edit') && (
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <h2>{modalMode === 'add' ? 'Add New Indicator' : 'Edit Indicator'}</h2>

                                    <div className={styles.formSection}>
                                        <h3>Indicator Information</h3>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Indicator Name *</label>
                                                <input
                                                    type="text"
                                                    name="indicatorName"
                                                    value={formData.indicatorName}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={modalMode === 'edit'}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Type *</label>
                                                <select
                                                    name="indicatorType"
                                                    value={formData.indicatorType}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={modalMode === 'edit'}
                                                >
                                                    <option value="CarbonFootprint">Carbon Footprint</option>
                                                    <option value="RenewableEnergyUsage">Renewable Energy Usage</option>
                                                    <option value="WaterConsumption">Water Consumption</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Measurement Unit *</label>
                                                <input
                                                    type="text"
                                                    name="measurementUnit"
                                                    value={formData.measurementUnit}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., kg CO2, %, Liters"
                                                    required
                                                    disabled={modalMode === 'edit'}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Current Value *</label>
                                                <input
                                                    type="number"
                                                    name="indicatorValue"
                                                    value={formData.indicatorValue}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Target Value</label>
                                                <input
                                                    type="number"
                                                    name="targetValue"
                                                    value={formData.targetValue}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        {modalMode === 'add' && (
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>Measurement Date</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="measurementDate"
                                                        value={formData.measurementDate}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                        <button type="submit">
                                            {modalMode === 'add' ? 'Add Indicator' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Delete Mode */}
                            {modalMode === 'delete' && selectedIndicator && (
                                <div>
                                    <h2>Delete Indicator</h2>
                                    <p className={styles.warning}>
                                        Are you sure you want to delete "{selectedIndicator.indicatorName}"?
                                        This action cannot be undone.
                                    </p>
                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                        <button className={styles.dangerBtn} onClick={confirmDelete}>
                                            Delete Indicator
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
