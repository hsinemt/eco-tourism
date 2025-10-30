// components/dashboard/locations.jsx

import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './locations.module.css';
import {
    getAllLocations,
    getCities,
    getNaturalSites,
    getRegions,
    getLocationById,
    createCity,
    createNaturalSite,
    createRegion,
    updateCity,
    updateNaturalSite,
    updateRegion,
    deleteLocation,
    findNearbyLocations,
    LOCATION_TYPES,
    CLIMATE_TYPES
} from '../api/location';

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showNearbyModal, setShowNearbyModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [nearbyResults, setNearbyResults] = useState(null);
    const [nearbyLoading, setNearbyLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Information (common to all types)
        type: 'City',
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        address: '',

        // City-specific fields
        population: '',
        postalCode: '',
        touristAttractions: '',

        // NaturalSite-specific fields
        protectedStatus: false,
        biodiversityIndex: '',
        areaSizeHectares: '',
        entryFee: '',

        // Region-specific fields
        climateType: '',
        regionArea: '',
        mainAttractions: ''
    });

    const [nearbyFormData, setNearbyFormData] = useState({
        latitude: '',
        longitude: '',
        radius_km: 50,
        location_type: ''
    });

    // Fetch all locations
    const fetchLocations = async (type = '') => {
        try {
            setLoading(true);
            setError('');
            let data;

            if (type === 'City') data = await getCities();
            else if (type === 'NaturalSite') data = await getNaturalSites();
            else if (type === 'Region') data = await getRegions();
            else data = await getAllLocations();

            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setError('Failed to fetch locations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle type change - reset type-specific fields
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setFormData(prev => ({
            ...prev,
            type: newType,
            // Reset type-specific fields when type changes
            population: '',
            postalCode: '',
            touristAttractions: '',
            protectedStatus: false,
            biodiversityIndex: '',
            areaSizeHectares: '',
            entryFee: '',
            climateType: '',
            regionArea: '',
            mainAttractions: ''
        }));
    };

    // Handle nearby form changes
    const handleNearbyChange = (e) => {
        const { name, value } = e.target;
        setNearbyFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Create new location
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            let result;

            if (formData.type === 'City') {
                result = await createCity(formData);
            } else if (formData.type === 'NaturalSite') {
                result = await createNaturalSite(formData);
            } else if (formData.type === 'Region') {
                result = await createRegion(formData);
            }

            setShowCreateModal(false);
            await fetchLocations(selectedType);
            resetForm();
            alert('Location created successfully!');
        } catch (error) {
            console.error('Error creating location:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error creating location. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update location
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            let result;

            if (selectedLocation.type === 'City') {
                result = await updateCity(selectedLocation.uri_id, formData);
            } else if (selectedLocation.type === 'NaturalSite') {
                result = await updateNaturalSite(selectedLocation.uri_id, formData);
            } else if (selectedLocation.type === 'Region') {
                result = await updateRegion(selectedLocation.uri_id, formData);
            }

            setShowEditModal(false);
            await fetchLocations(selectedType);
            resetForm();
            alert('Location updated successfully!');
        } catch (error) {
            console.error('Error updating location:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating location. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete location
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            await deleteLocation(selectedLocation.uri_id);
            setShowDeleteModal(false);
            await fetchLocations(selectedType);
            alert('Location deleted successfully!');
        } catch (error) {
            console.error('Error deleting location:', error);
            setError('Error deleting location. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // View single location
    const handleView = async (location) => {
        try {
            setError('');
            const data = await getLocationById(location.uri_id, location.type);
            setSelectedLocation(data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching location:', error);
            setError('Error fetching location details.');
        }
    };

    // Search locations by name
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            fetchLocations(selectedType);
            return;
        }

        const filtered = locations.filter(location =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setLocations(filtered);
    };

    // Find nearby locations
    const handleFindNearby = async (e) => {
        e.preventDefault();
        setNearbyLoading(true);
        try {
            setError('');
            const result = await findNearbyLocations(
                parseFloat(nearbyFormData.latitude),
                parseFloat(nearbyFormData.longitude),
                parseFloat(nearbyFormData.radius_km),
                nearbyFormData.location_type || null
            );
            setNearbyResults(result);
        } catch (error) {
            console.error('Error finding nearby locations:', error);
            setError('Error finding nearby locations.');
        } finally {
            setNearbyLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (location) => {
        setSelectedLocation(location);
        setFormData({
            type: location.type,
            name: location.name || '',
            description: location.description || '',
            latitude: location.latitude || '',
            longitude: location.longitude || '',
            address: location.address || '',
            population: location.population || '',
            postalCode: location.postalCode || '',
            touristAttractions: location.touristAttractions || '',
            protectedStatus: Boolean(location.protectedStatus),
            biodiversityIndex: location.biodiversityIndex || '',
            areaSizeHectares: location.areaSizeHectares || '',
            entryFee: location.entryFee || '',
            climateType: location.climateType || '',
            regionArea: location.regionArea || '',
            mainAttractions: location.mainAttractions || ''
        });
        setShowEditModal(true);
    };

    // Open delete confirmation
    const openDeleteModal = (location) => {
        setSelectedLocation(location);
        setShowDeleteModal(true);
    };

    // Open nearby locations modal
    const openNearbyModal = () => {
        setNearbyFormData({
            latitude: '',
            longitude: '',
            radius_km: 50,
            location_type: ''
        });
        setNearbyResults(null);
        setShowNearbyModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            type: 'City',
            name: '',
            description: '',
            latitude: '',
            longitude: '',
            address: '',
            population: '',
            postalCode: '',
            touristAttractions: '',
            protectedStatus: false,
            biodiversityIndex: '',
            areaSizeHectares: '',
            entryFee: '',
            climateType: '',
            regionArea: '',
            mainAttractions: ''
        });
        setError('');
    };

    // Filter by type
    const handleTypeFilter = (type) => {
        setSelectedType(type);
        fetchLocations(type);
    };

    // Render type-specific form fields
    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case 'City':
                return (
                    <div className={styles.formSection}>
                        <h3>City Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Population</label>
                                <input
                                    type="number"
                                    name="population"
                                    value={formData.population}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="100000"
                                    disabled={actionLoading}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tourist Attractions</label>
                            <textarea
                                name="touristAttractions"
                                value={formData.touristAttractions}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Famous landmarks, museums, parks, etc."
                                disabled={actionLoading}
                            />
                        </div>
                    </div>
                );

            case 'NaturalSite':
                return (
                    <div className={styles.formSection}>
                        <h3>Natural Site Details</h3>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="protectedStatus"
                                    checked={formData.protectedStatus}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Protected Status
                            </label>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Biodiversity Index</label>
                                <input
                                    type="number"
                                    name="biodiversityIndex"
                                    value={formData.biodiversityIndex}
                                    onChange={handleChange}
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="8.5"
                                    disabled={actionLoading}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Area Size (hectares)</label>
                                <input
                                    type="number"
                                    name="areaSizeHectares"
                                    value={formData.areaSizeHectares}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                    placeholder="1000"
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Entry Fee ($)</label>
                            <input
                                type="number"
                                name="entryFee"
                                value={formData.entryFee}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                disabled={actionLoading}
                            />
                        </div>
                    </div>
                );

            case 'Region':
                return (
                    <div className={styles.formSection}>
                        <h3>Region Details</h3>
                        <div className={styles.formGroup}>
                            <label>Climate Type</label>
                            <select
                                name="climateType"
                                value={formData.climateType}
                                onChange={handleChange}
                                disabled={actionLoading}
                            >
                                <option value="">Select climate type...</option>
                                <option value="Tropical">Tropical</option>
                                <option value="Temperate">Temperate</option>
                                <option value="Arid">Arid</option>
                                <option value="Continental">Continental</option>
                                <option value="Polar">Polar</option>
                                <option value="Mediterranean">Mediterranean</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Region Area (km²)</label>
                            <input
                                type="number"
                                name="regionArea"
                                value={formData.regionArea}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                placeholder="10000"
                                disabled={actionLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Main Attractions</label>
                            <textarea
                                name="mainAttractions"
                                value={formData.mainAttractions}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Major attractions, landmarks, natural features"
                                disabled={actionLoading}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Render form sections for both create and edit modals
    const renderFormSections = () => (
        <>
            {/* Basic Information */}
            <div className={styles.formSection}>
                <h3>Basic Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleTypeChange}
                            required
                            disabled={actionLoading}
                        >
                            <option value="City">City</option>
                            <option value="NaturalSite">Natural Site</option>
                            <option value="Region">Region</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Location name"
                            disabled={actionLoading}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Location description"
                        disabled={actionLoading}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Latitude *</label>
                        <input
                            type="number"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            required
                            step="any"
                            placeholder="36.8065"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Longitude *</label>
                        <input
                            type="number"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            required
                            step="any"
                            placeholder="10.1815"
                            disabled={actionLoading}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full address"
                        disabled={actionLoading}
                    />
                </div>
            </div>

            {/* Type-specific fields */}
            {renderTypeSpecificFields()}
        </>
    );

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Eco-Tourism Locations</h1>
                        <p>{locations.length} locations available</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className={styles.primaryBtn}
                            onClick={openNearbyModal}
                            disabled={actionLoading}
                        >
                            📍 Find Nearby
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => setShowCreateModal(true)}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Loading...' : '+ New Location'}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {/* Search and Filters */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            disabled={actionLoading}
                        />
                        <button onClick={handleSearch} disabled={actionLoading}>
                            🔍 Search
                        </button>
                    </div>

                    <div className={styles.filters}>
                        <button
                            onClick={() => handleTypeFilter('')}
                            className={!selectedType ? styles.active : ''}
                            disabled={actionLoading}
                        >
                            All Types
                        </button>
                        <button
                            onClick={() => handleTypeFilter('City')}
                            className={selectedType === 'City' ? styles.active : ''}
                            disabled={actionLoading}
                        >
                            🏙️ Cities
                        </button>
                        <button
                            onClick={() => handleTypeFilter('NaturalSite')}
                            className={selectedType === 'NaturalSite' ? styles.active : ''}
                            disabled={actionLoading}
                        >
                            🌿 Natural Sites
                        </button>
                        <button
                            onClick={() => handleTypeFilter('Region')}
                            className={selectedType === 'Region' ? styles.active : ''}
                            disabled={actionLoading}
                        >
                            🗺️ Regions
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className={styles.loading}>Loading locations...</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Coordinates</th>
                                <th>Address</th>
                                <th>Details</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {locations.map((location) => (
                                <tr key={location.id}>
                                    <td>{location.name}</td>
                                    <td>
                                        <span className={`${styles.typeBadge} ${
                                            location.type === 'City' ? styles.typeCity :
                                                location.type === 'NaturalSite' ? styles.typeNaturalSite :
                                                    styles.typeRegion
                                        }`}>
                                            {location.type === 'City' && '🏙️ City'}
                                            {location.type === 'NaturalSite' && '🌿 Natural Site'}
                                            {location.type === 'Region' && '🗺️ Region'}
                                        </span>
                                    </td>
                                    <td className={styles.coordinates}>
                                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                    </td>
                                    <td>{location.address || 'N/A'}</td>
                                    <td>
                                        {location.type === 'City' && `Pop: ${location.population?.toLocaleString() || 'N/A'}`}
                                        {location.type === 'NaturalSite' && `Area: ${location.areaSizeHectares || 'N/A'} ha`}
                                        {location.type === 'Region' && `Area: ${location.regionArea || 'N/A'} km²`}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => handleView(location)}
                                                disabled={actionLoading}
                                            >
                                                👁️ View
                                            </button>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => openEditModal(location)}
                                                disabled={actionLoading}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => openDeleteModal(location)}
                                                disabled={actionLoading}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {locations.length === 0 && (
                            <div className={styles.noData}>
                                No locations found
                            </div>
                        )}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <Modal onClose={() => { setShowCreateModal(false); resetForm(); }}>
                        <h2>Create New Location</h2>
                        <form onSubmit={handleCreate} className={styles.form}>
                            {renderFormSections()}
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.primaryBtn}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Creating...' : 'Create Location'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <Modal onClose={() => { setShowEditModal(false); resetForm(); }}>
                        <h2>Edit Location</h2>
                        <form onSubmit={handleUpdate} className={styles.form}>
                            {renderFormSections()}
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.primaryBtn}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Updating...' : 'Update Location'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* View Modal */}
                {showViewModal && selectedLocation && (
                    <Modal onClose={() => setShowViewModal(false)}>
                        <h2>Location Details</h2>
                        <div className={styles.viewDetails}>
                            {/* Basic Information */}
                            <div className={styles.detailSection}>
                                <h3>Basic Information</h3>
                                <div className={styles.detailRow}>
                                    <strong>Name:</strong>
                                    <span>{selectedLocation.name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Type:</strong>
                                    <span>
                                        {selectedLocation.type === 'City' && '🏙️ City'}
                                        {selectedLocation.type === 'NaturalSite' && '🌿 Natural Site'}
                                        {selectedLocation.type === 'Region' && '🗺️ Region'}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Description:</strong>
                                    <span>{selectedLocation.description || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Coordinates:</strong>
                                    <span className={styles.coordinateDisplay}>
                                        {selectedLocation.latitude}, {selectedLocation.longitude}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Address:</strong>
                                    <span>{selectedLocation.address || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Type-specific details */}
                            {selectedLocation.type === 'City' && (
                                <div className={styles.detailSection}>
                                    <h3>City Details</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Population:</strong>
                                        <span>{selectedLocation.population?.toLocaleString() || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Postal Code:</strong>
                                        <span>{selectedLocation.postalCode || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Tourist Attractions:</strong>
                                        <span>{selectedLocation.touristAttractions || 'N/A'}</span>
                                    </div>
                                </div>
                            )}

                            {selectedLocation.type === 'NaturalSite' && (
                                <div className={styles.detailSection}>
                                    <h3>Natural Site Details</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Protected Status:</strong>
                                        <span>{selectedLocation.protectedStatus ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Biodiversity Index:</strong>
                                        <span>{selectedLocation.biodiversityIndex || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Area Size:</strong>
                                        <span>{selectedLocation.areaSizeHectares || 'N/A'} hectares</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Entry Fee:</strong>
                                        <span>${selectedLocation.entryFee || '0.00'}</span>
                                    </div>
                                </div>
                            )}

                            {selectedLocation.type === 'Region' && (
                                <div className={styles.detailSection}>
                                    <h3>Region Details</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Climate Type:</strong>
                                        <span>{selectedLocation.climateType || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Region Area:</strong>
                                        <span>{selectedLocation.regionArea || 'N/A'} km²</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Main Attractions:</strong>
                                        <span>{selectedLocation.mainAttractions || 'N/A'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </Modal>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <Modal onClose={() => setShowDeleteModal(false)}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete "{selectedLocation?.name}"?</p>
                        <p className={styles.warning}>This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowDeleteModal(false)} disabled={actionLoading}>
                                Cancel
                            </button>
                            <button
                                className={styles.dangerBtn}
                                onClick={handleDelete}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Nearby Locations Modal */}
                {showNearbyModal && (
                    <Modal onClose={() => setShowNearbyModal(false)}>
                        <h2>Find Nearby Locations</h2>
                        <form onSubmit={handleFindNearby} className={styles.form}>
                            <div className={styles.formSection}>
                                <h3>Search Parameters</h3>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Latitude *</label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            value={nearbyFormData.latitude}
                                            onChange={handleNearbyChange}
                                            required
                                            step="any"
                                            placeholder="36.8065"
                                            disabled={nearbyLoading}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Longitude *</label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            value={nearbyFormData.longitude}
                                            onChange={handleNearbyChange}
                                            required
                                            step="any"
                                            placeholder="10.1815"
                                            disabled={nearbyLoading}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Radius (km)</label>
                                        <input
                                            type="number"
                                            name="radius_km"
                                            value={nearbyFormData.radius_km}
                                            onChange={handleNearbyChange}
                                            min="1"
                                            max="1000"
                                            placeholder="50"
                                            disabled={nearbyLoading}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Location Type</label>
                                        <select
                                            name="location_type"
                                            value={nearbyFormData.location_type}
                                            onChange={handleNearbyChange}
                                            disabled={nearbyLoading}
                                        >
                                            <option value="">All Types</option>
                                            <option value="City">City</option>
                                            <option value="NaturalSite">Natural Site</option>
                                            <option value="Region">Region</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {nearbyResults && (
                                <div className={styles.nearbySection}>
                                    <h3>Nearby Locations ({nearbyResults.count})</h3>
                                    <p>Center: {nearbyResults.center.lat}, {nearbyResults.center.lon}</p>
                                    <p>Radius: {nearbyResults.radius_km} km</p>

                                    <div className={styles.nearbyResults}>
                                        {nearbyResults.locations.map((location, index) => (
                                            <div key={index} className={styles.nearbyItem}>
                                                <div>
                                                    <strong>{location.locationName}</strong>
                                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                                        {location.latitude}, {location.longitude}
                                                    </div>
                                                </div>
                                                <span className={styles.nearbyDistance}>
                                                    {location.distance_km} km
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowNearbyModal(false)} disabled={nearbyLoading}>
                                Cancel
                            </button>
                            <button
                                className={styles.primaryBtn}
                                type="submit"
                                onClick={handleFindNearby}
                                disabled={nearbyLoading || !nearbyFormData.latitude || !nearbyFormData.longitude}
                            >
                                {nearbyLoading ? 'Searching...' : 'Find Nearby Locations'}
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </DashboardLayout>
    );
}

// Modal Component
function Modal({ children, onClose }) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}