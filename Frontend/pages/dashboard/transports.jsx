import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './transports.module.css';
import {
    getAllTransports,
    getTransportById,
    createBike,
    createElectricVehicle,
    createPublicTransport,
    updateTransport,
    deleteTransport,
    searchTransports,
    getZeroEmissionTransports,
    getCheapestTransports,
    getFastestTransports,
    getEcoScoreRanking
} from '../api/transport';

export default function Transports() {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Bike');

    const [formData, setFormData] = useState({
        // Common fields
        category: 'Bike',
        transportName: '',
        transportType: '',
        pricePerKm: '',
        carbonEmissionPerKm: '',
        capacity: '',
        availability: true,
        operatingHours: '',
        averageSpeed: '',
        contactPhone: '',

        // Bike-specific
        bikeModel: '',
        isElectric: false,
        batteryRange: '',
        rentalPricePerHour: '',
        frameSize: '',

        // Electric Vehicle-specific
        vehicleModel: '',
        vehicleBatteryRange: '',
        chargingTime: '',
        seatingCapacity: '',
        dailyRentalPrice: '',
        hasAirConditioning: true,

        // Public Transport-specific
        lineNumber: '',
        routeDescription: '',
        ticketPrice: '',
        frequencyMinutes: '',
        accessibleForDisabled: true,
    });

    // Fetch all transports
    const fetchTransports = async (type = null) => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllTransports(type);
            setTransports(data);
        } catch (error) {
            console.error('Error fetching transports:', error);
            setError('Failed to fetch transports. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransports();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle category change
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setFormData(prev => ({
            ...prev,
            category: category,
            transportType: category === 'Bike' ? 'City Bike' :
                category === 'ElectricVehicle' ? 'Electric Car' : 'Bus'
        }));
        setSelectedCategory(category);
    };

    // Create new transport
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');

            if (formData.category === 'Bike') {
                await createBike(formData);
            } else if (formData.category === 'ElectricVehicle') {
                await createElectricVehicle(formData);
            } else if (formData.category === 'PublicTransport') {
                await createPublicTransport(formData);
            }

            setShowCreateModal(false);
            await fetchTransports();
            resetForm();
            alert('Transport created successfully!');
        } catch (error) {
            console.error('Error creating transport:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error creating transport. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update transport
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await updateTransport(selectedTransport.id, formData);
            setShowEditModal(false);
            await fetchTransports();
            resetForm();
            alert('Transport updated successfully!');
        } catch (error) {
            console.error('Error updating transport:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating transport. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete transport
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            await deleteTransport(selectedTransport.id);
            setShowDeleteModal(false);
            await fetchTransports();
            alert('Transport deleted successfully!');
        } catch (error) {
            console.error('Error deleting transport:', error);
            setError('Error deleting transport. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // View single transport
    const handleView = async (id) => {
        try {
            setError('');
            const data = await getTransportById(id);
            setSelectedTransport(data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching transport:', error);
            setError('Error fetching transport details.');
        }
    };

    // Search transport by name
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchTransports();
            return;
        }
        try {
            setError('');
            const data = await searchTransports(searchTerm);
            setTransports(data);
        } catch (error) {
            console.error('Error searching:', error);
            setError('Error searching transports.');
        }
    };

    // Open edit modal
    const openEditModal = (transport) => {
        setSelectedTransport(transport);
        setFormData({
            transportName: transport.transportName || '',
            availability: Boolean(transport.availability),
            pricePerKm: transport.pricePerKm || '',
            operatingHours: transport.operatingHours || '',
        });
        setShowEditModal(true);
    };

    // Open delete confirmation
    const openDeleteModal = (transport) => {
        setSelectedTransport(transport);
        setShowDeleteModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            category: 'Bike',
            transportName: '',
            transportType: 'City Bike',
            pricePerKm: '',
            carbonEmissionPerKm: '',
            capacity: '',
            availability: true,
            operatingHours: '',
            averageSpeed: '',
            contactPhone: '',
            bikeModel: '',
            isElectric: false,
            batteryRange: '',
            rentalPricePerHour: '',
            frameSize: '',
            vehicleModel: '',
            vehicleBatteryRange: '',
            chargingTime: '',
            seatingCapacity: '',
            dailyRentalPrice: '',
            hasAirConditioning: true,
            lineNumber: '',
            routeDescription: '',
            ticketPrice: '',
            frequencyMinutes: '',
            accessibleForDisabled: true,
        });
        setSelectedCategory('Bike');
        setError('');
    };

    // Fetch zero emission transports
    const fetchZeroEmission = async () => {
        try {
            setError('');
            const data = await getZeroEmissionTransports();
            setTransports(data);
        } catch (error) {
            console.error('Error fetching zero emission:', error);
            setError('Error fetching zero emission transports.');
        }
    };

    // Fetch cheapest transports
    const fetchCheapest = async () => {
        try {
            setError('');
            const data = await getCheapestTransports();
            setTransports(data);
        } catch (error) {
            console.error('Error fetching cheapest:', error);
            setError('Error fetching cheapest transports.');
        }
    };

    // Fetch fastest transports
    const fetchFastest = async () => {
        try {
            setError('');
            const data = await getFastestTransports();
            setTransports(data);
        } catch (error) {
            console.error('Error fetching fastest:', error);
            setError('Error fetching fastest transports.');
        }
    };

    // Fetch eco score ranking
    const fetchEcoScore = async () => {
        try {
            setError('');
            const data = await getEcoScoreRanking();
            setTransports(data);
        } catch (error) {
            console.error('Error fetching eco score:', error);
            setError('Error fetching eco score ranking.');
        }
    };

    // Render form sections based on category
    const renderCategoryFields = () => {
        switch (selectedCategory) {
            case 'Bike':
                return (
                    <div className={styles.formSection}>
                        <h3>Bike Specific Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Bike Model *</label>
                                <input
                                    type="text"
                                    name="bikeModel"
                                    value={formData.bikeModel}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Frame Size</label>
                                <select
                                    name="frameSize"
                                    value={formData.frameSize}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                >
                                    <option value="S">Small (S)</option>
                                    <option value="M">Medium (M)</option>
                                    <option value="L">Large (L)</option>
                                    <option value="XL">Extra Large (XL)</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Rental Price Per Hour *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="rentalPricePerHour"
                                    value={formData.rentalPricePerHour}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Battery Range (km)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="batteryRange"
                                    value={formData.batteryRange}
                                    onChange={handleChange}
                                    disabled={actionLoading || !formData.isElectric}
                                />
                            </div>
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="isElectric"
                                    checked={formData.isElectric}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Electric Bike
                            </label>
                        </div>
                    </div>
                );

            case 'ElectricVehicle':
                return (
                    <div className={styles.formSection}>
                        <h3>Electric Vehicle Specific Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Vehicle Model *</label>
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    value={formData.vehicleModel}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Seating Capacity *</label>
                                <input
                                    type="number"
                                    name="seatingCapacity"
                                    value={formData.seatingCapacity}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Battery Range (km) *</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="vehicleBatteryRange"
                                    value={formData.vehicleBatteryRange}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Charging Time (hours) *</label>
                                <input
                                    type="number"
                                    name="chargingTime"
                                    value={formData.chargingTime}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Daily Rental Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="dailyRentalPrice"
                                value={formData.dailyRentalPrice}
                                onChange={handleChange}
                                disabled={actionLoading}
                                required
                            />
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="hasAirConditioning"
                                    checked={formData.hasAirConditioning}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Has Air Conditioning
                            </label>
                        </div>
                    </div>
                );

            case 'PublicTransport':
                return (
                    <div className={styles.formSection}>
                        <h3>Public Transport Specific Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Line Number *</label>
                                <input
                                    type="text"
                                    name="lineNumber"
                                    value={formData.lineNumber}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Frequency (minutes) *</label>
                                <input
                                    type="number"
                                    name="frequencyMinutes"
                                    value={formData.frequencyMinutes}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Route Description *</label>
                            <textarea
                                name="routeDescription"
                                value={formData.routeDescription}
                                onChange={handleChange}
                                disabled={actionLoading}
                                rows="3"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Ticket Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="ticketPrice"
                                value={formData.ticketPrice}
                                onChange={handleChange}
                                disabled={actionLoading}
                                required
                            />
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="accessibleForDisabled"
                                    checked={formData.accessibleForDisabled}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Accessible for Disabled
                            </label>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Render form sections
    const renderFormSections = () => (
        <>
            {/* Basic Information */}
            <div className={styles.formSection}>
                <h3>Basic Information</h3>
                <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        disabled={actionLoading}
                        required
                    >
                        <option value="Bike">Bike</option>
                        <option value="ElectricVehicle">Electric Vehicle</option>
                        <option value="PublicTransport">Public Transport</option>
                    </select>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Transport Name *</label>
                        <input
                            type="text"
                            name="transportName"
                            value={formData.transportName}
                            onChange={handleChange}
                            disabled={actionLoading}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Transport Type *</label>
                        <input
                            type="text"
                            name="transportType"
                            value={formData.transportType}
                            onChange={handleChange}
                            disabled={actionLoading}
                            required
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Price Per Km</label>
                        <input
                            type="number"
                            step="0.01"
                            name="pricePerKm"
                            value={formData.pricePerKm}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Carbon Emission Per Km (g)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="carbonEmissionPerKm"
                            value={formData.carbonEmissionPerKm}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Capacity *</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            disabled={actionLoading}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Average Speed (km/h) *</label>
                        <input
                            type="number"
                            step="0.1"
                            name="averageSpeed"
                            value={formData.averageSpeed}
                            onChange={handleChange}
                            disabled={actionLoading}
                            required
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Operating Hours *</label>
                        <input
                            type="text"
                            name="operatingHours"
                            value={formData.operatingHours}
                            onChange={handleChange}
                            disabled={actionLoading}
                            placeholder="e.g., 24/7 or 06:00-23:00"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Contact Phone *</label>
                        <input
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            disabled={actionLoading}
                            required
                        />
                    </div>
                </div>
                <div className={styles.checkboxGrid}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="availability"
                            checked={formData.availability}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Available
                    </label>
                </div>
            </div>

            {/* Category-specific fields */}
            {renderCategoryFields()}
        </>
    );

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Transport Management</h1>
                        <p>Manage eco-friendly transportation options</p>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            resetForm();
                            setShowCreateModal(true);
                        }}
                        disabled={loading}
                    >
                        + Add Transport
                    </button>
                </div>

                {/* Toolbar with Search and Filters */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search transports by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} disabled={loading}>
                            Search
                        </button>
                        <button onClick={() => {setSearchTerm(''); fetchTransports();}} disabled={loading}>
                            Clear
                        </button>
                    </div>

                    <div className={styles.filters}>
                        <button onClick={() => fetchTransports('Bike')} disabled={loading}>
                            🚲 Bikes
                        </button>
                        <button onClick={() => fetchTransports('ElectricVehicle')} disabled={loading}>
                            🚗 Electric Vehicles
                        </button>
                        <button onClick={() => fetchTransports('PublicTransport')} disabled={loading}>
                            🚌 Public Transport
                        </button>
                        <button onClick={fetchZeroEmission} disabled={loading}>
                            🌱 Zero Emission
                        </button>
                        <button onClick={fetchCheapest} disabled={loading}>
                            💰 Cheapest
                        </button>
                        <button onClick={fetchFastest} disabled={loading}>
                            ⚡ Fastest
                        </button>
                        <button onClick={fetchEcoScore} disabled={loading}>
                            🌍 Eco Score
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && <div className={styles.error}>{error}</div>}

                {/* Loading State */}
                {loading && <div className={styles.loading}>Loading transports...</div>}

                {/* Transports Table */}
                {!loading && transports.length === 0 && (
                    <div className={styles.noData}>No transports found.</div>
                )}

                {!loading && transports.length > 0 && (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Price/km</th>
                                <th>CO₂/km</th>
                                <th>Speed</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transports.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.transportName}</td>
                                    <td>{item.transportType}</td>
                                    <td>${item.pricePerKm?.toFixed(2) || '0.00'}</td>
                                    <td>{item.carbonEmissionPerKm?.toFixed(1) || '0.0'}g</td>
                                    <td>{item.averageSpeed?.toFixed(0) || '0'} km/h</td>
                                    <td>{item.capacity}</td>
                                    <td>
                                        {item.availability ? (
                                            <span className={styles.badge}>Available</span>
                                        ) : (
                                            <span className={styles.badgeUnavailable}>Unavailable</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => handleView(item.id)}
                                                disabled={loading}
                                            >
                                                View
                                            </button>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => openEditModal(item)}
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => openDeleteModal(item)}
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                            {transports.length} transports available
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>
                            <h2>Add New Transport</h2>
                            {error && <div className={styles.error}>{error}</div>}
                            <form className={styles.form} onSubmit={handleCreate}>
                                {renderFormSections()}
                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            resetForm();
                                        }}
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.primaryBtn}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Creating...' : 'Create Transport'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => {
                                    setShowEditModal(false);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>
                            <h2>Edit Transport</h2>
                            {error && <div className={styles.error}>{error}</div>}
                            <form className={styles.form} onSubmit={handleUpdate}>
                                <div className={styles.formSection}>
                                    <h3>Editable Fields</h3>
                                    <div className={styles.formGroup}>
                                        <label>Transport Name</label>
                                        <input
                                            type="text"
                                            name="transportName"
                                            value={formData.transportName}
                                            onChange={handleChange}
                                            disabled={actionLoading}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Price Per Km</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="pricePerKm"
                                            value={formData.pricePerKm}
                                            onChange={handleChange}
                                            disabled={actionLoading}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Operating Hours</label>
                                        <input
                                            type="text"
                                            name="operatingHours"
                                            value={formData.operatingHours}
                                            onChange={handleChange}
                                            disabled={actionLoading}
                                        />
                                    </div>
                                    <div className={styles.checkboxGrid}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                name="availability"
                                                checked={formData.availability}
                                                onChange={handleChange}
                                                disabled={actionLoading}
                                            />
                                            Available
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            resetForm();
                                        }}
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.primaryBtn}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Updating...' : 'Update Transport'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {showViewModal && selectedTransport && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowViewModal(false)}
                            >
                                ×
                            </button>
                            <h2>Transport Details</h2>
                            <div className={styles.viewDetails}>
                                <div className={styles.detailSection}>
                                    <h3>Basic Information</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Name:</strong>
                                        <span>{selectedTransport.transportName}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Type:</strong>
                                        <span>{selectedTransport.transportType}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Price per km:</strong>
                                        <span>${selectedTransport.pricePerKm?.toFixed(2)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>CO₂ Emission per km:</strong>
                                        <span>{selectedTransport.carbonEmissionPerKm?.toFixed(1)}g</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Capacity:</strong>
                                        <span>{selectedTransport.capacity} persons</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Average Speed:</strong>
                                        <span>{selectedTransport.averageSpeed?.toFixed(0)} km/h</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Operating Hours:</strong>
                                        <span>{selectedTransport.operatingHours}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Contact Phone:</strong>
                                        <span>{selectedTransport.contactPhone}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Status:</strong>
                                        <span>{selectedTransport.availability ? '✓ Available' : '✗ Unavailable'}</span>
                                    </div>
                                </div>

                                {/* Bike-specific details */}
                                {selectedTransport.bikeModel && (
                                    <div className={styles.detailSection}>
                                        <h3>Bike Details</h3>
                                        <div className={styles.detailRow}>
                                            <strong>Model:</strong>
                                            <span>{selectedTransport.bikeModel}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Frame Size:</strong>
                                            <span>{selectedTransport.frameSize}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Rental Price per Hour:</strong>
                                            <span>${selectedTransport.rentalPricePerHour?.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Electric:</strong>
                                            <span>{selectedTransport.isElectric ? 'Yes' : 'No'}</span>
                                        </div>
                                        {selectedTransport.isElectric && (
                                            <div className={styles.detailRow}>
                                                <strong>Battery Range:</strong>
                                                <span>{selectedTransport.batteryRange?.toFixed(1)} km</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Electric Vehicle-specific details */}
                                {selectedTransport.vehicleModel && (
                                    <div className={styles.detailSection}>
                                        <h3>Electric Vehicle Details</h3>
                                        <div className={styles.detailRow}>
                                            <strong>Model:</strong>
                                            <span>{selectedTransport.vehicleModel}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Battery Range:</strong>
                                            <span>{selectedTransport.vehicleBatteryRange?.toFixed(1)} km</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Charging Time:</strong>
                                            <span>{selectedTransport.chargingTime} hours</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Seating Capacity:</strong>
                                            <span>{selectedTransport.seatingCapacity} persons</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Daily Rental Price:</strong>
                                            <span>${selectedTransport.dailyRentalPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Air Conditioning:</strong>
                                            <span>{selectedTransport.hasAirConditioning ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Public Transport-specific details */}
                                {selectedTransport.lineNumber && (
                                    <div className={styles.detailSection}>
                                        <h3>Public Transport Details</h3>
                                        <div className={styles.detailRow}>
                                            <strong>Line Number:</strong>
                                            <span>{selectedTransport.lineNumber}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Route:</strong>
                                            <span>{selectedTransport.routeDescription}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Ticket Price:</strong>
                                            <span>${selectedTransport.ticketPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Frequency:</strong>
                                            <span>Every {selectedTransport.frequencyMinutes} minutes</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Accessible for Disabled:</strong>
                                            <span>{selectedTransport.accessibleForDisabled ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedTransport && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                            <h2>Confirm Deletion</h2>
                            {error && <div className={styles.error}>{error}</div>}
                            <p>
                                Are you sure you want to delete "{selectedTransport.transportName}"?
                            </p>
                            <p className={styles.warning}>This action cannot be undone.</p>
                            <div className={styles.modalActions}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={styles.dangerBtn}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Deleting...' : 'Delete Transport'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
