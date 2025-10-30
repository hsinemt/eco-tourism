import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './accommodations.module.css';
import {
    getAllAccommodations,
    getAccommodationById,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    searchAccommodations,
    getTopRatedAccommodations,
    getCheapestAccommodations
} from '../api/accommodation';

export default function Accommodations() {
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Information
        type: 'EcoLodge',
        name: '',
        description: '',
        pricePerNight: '',
        accommodationRating: '',

        // Capacity & Rooms
        numberOfRooms: '',
        maxGuests: '',

        // Check-in/out
        checkInTime: '14:00',
        checkOutTime: '12:00',

        // Contact Information
        contactEmail: '',
        accommodationPhone: '',

        // Eco Features
        ecoCertified: false,
        renewableEnergyPercent: '',
        wasteRecyclingRate: '',
        organicFoodOffered: false,
        waterConservationSystem: false,

        // Cultural Features
        familyOwned: false,
        traditionalArchitecture: false,
        homeCookedMeals: false,
        culturalExperiences: '',

        // Amenities
        wifiAvailable: false,
        parkingAvailable: false,
        starRating: '3',
        hasSwimmingPool: false,
        hasSpa: false,
        hasRestaurant: false,
        roomService: false
    });

    // Fetch all accommodations
    const fetchAccommodations = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllAccommodations();
            setAccommodations(data);
        } catch (error) {
            console.error('Error fetching accommodations:', error);
            setError('Failed to fetch accommodations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccommodations();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Create new accommodation
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await createAccommodation(formData);
            setShowCreateModal(false);
            await fetchAccommodations();
            resetForm();
            alert('Accommodation created successfully!');
        } catch (error) {
            console.error('Error creating accommodation:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error creating accommodation. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update accommodation
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await updateAccommodation(selectedAccommodation.id, formData);
            setShowEditModal(false);
            await fetchAccommodations();
            resetForm();
            alert('Accommodation updated successfully!');
        } catch (error) {
            console.error('Error updating accommodation:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating accommodation. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete accommodation
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            await deleteAccommodation(selectedAccommodation.id);
            setShowDeleteModal(false);
            await fetchAccommodations();
            alert('Accommodation deleted successfully!');
        } catch (error) {
            console.error('Error deleting accommodation:', error);
            setError('Error deleting accommodation. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // View single accommodation
    const handleView = async (id) => {
        try {
            setError('');
            const data = await getAccommodationById(id);
            setSelectedAccommodation(data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching accommodation:', error);
            setError('Error fetching accommodation details.');
        }
    };

    // Search accommodation by name
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchAccommodations();
            return;
        }

        try {
            setError('');
            const data = await searchAccommodations(searchTerm);
            setAccommodations(data);
        } catch (error) {
            console.error('Error searching:', error);
            setError('Error searching accommodations.');
        }
    };

    // Open edit modal
    const openEditModal = (accommodation) => {
        setSelectedAccommodation(accommodation);
        setFormData({
            type: accommodation.type || 'EcoLodge',
            name: accommodation.name || '',
            description: accommodation.description || '',
            pricePerNight: accommodation.pricePerNight || '',
            accommodationRating: accommodation.accommodationRating || '',
            numberOfRooms: accommodation.numberOfRooms || '',
            maxGuests: accommodation.maxGuests || '',
            checkInTime: accommodation.checkInTime || '14:00',
            checkOutTime: accommodation.checkOutTime || '12:00',
            contactEmail: accommodation.contactEmail || '',
            accommodationPhone: accommodation.accommodationPhone || '',
            ecoCertified: Boolean(accommodation.ecoCertified),
            renewableEnergyPercent: accommodation.renewableEnergyPercent || '',
            wasteRecyclingRate: accommodation.wasteRecyclingRate || '',
            organicFoodOffered: Boolean(accommodation.organicFoodOffered),
            waterConservationSystem: Boolean(accommodation.waterConservationSystem),
            familyOwned: Boolean(accommodation.familyOwned),
            traditionalArchitecture: Boolean(accommodation.traditionalArchitecture),
            homeCookedMeals: Boolean(accommodation.homeCookedMeals),
            culturalExperiences: accommodation.culturalExperiences || '',
            wifiAvailable: Boolean(accommodation.wifiAvailable),
            parkingAvailable: Boolean(accommodation.parkingAvailable),
            starRating: accommodation.starRating?.toString() || '3',
            hasSwimmingPool: Boolean(accommodation.hasSwimmingPool),
            hasSpa: Boolean(accommodation.hasSpa),
            hasRestaurant: Boolean(accommodation.hasRestaurant),
            roomService: Boolean(accommodation.roomService)
        });
        setShowEditModal(true);
    };

    // Open delete confirmation
    const openDeleteModal = (accommodation) => {
        setSelectedAccommodation(accommodation);
        setShowDeleteModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            type: 'EcoLodge',
            name: '',
            description: '',
            pricePerNight: '',
            accommodationRating: '',
            numberOfRooms: '',
            maxGuests: '',
            checkInTime: '14:00',
            checkOutTime: '12:00',
            contactEmail: '',
            accommodationPhone: '',
            ecoCertified: false,
            renewableEnergyPercent: '',
            wasteRecyclingRate: '',
            organicFoodOffered: false,
            waterConservationSystem: false,
            familyOwned: false,
            traditionalArchitecture: false,
            homeCookedMeals: false,
            culturalExperiences: '',
            wifiAvailable: false,
            parkingAvailable: false,
            starRating: '3',
            hasSwimmingPool: false,
            hasSpa: false,
            hasRestaurant: false,
            roomService: false
        });
        setError('');
    };

    // Fetch top-rated accommodations
    const fetchTopRated = async () => {
        try {
            setError('');
            const data = await getTopRatedAccommodations();
            setAccommodations(data);
        } catch (error) {
            console.error('Error fetching top-rated:', error);
            setError('Error fetching top-rated accommodations.');
        }
    };

    // Fetch cheapest accommodations
    const fetchCheapest = async () => {
        try {
            setError('');
            const data = await getCheapestAccommodations();
            setAccommodations(data);
        } catch (error) {
            console.error('Error fetching cheapest:', error);
            setError('Error fetching cheapest accommodations.');
        }
    };

    // Render form section for both create and edit modals
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
                            onChange={handleChange}
                            required
                            disabled={actionLoading}
                        >
                            <option value="EcoLodge">Eco Lodge</option>
                            <option value="GuestHouse">Guest House</option>
                            <option value="Hotel">Hotel</option>
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
                            placeholder="Accommodation name"
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
                        placeholder="Description"
                        disabled={actionLoading}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Price per Night ($) *</label>
                        <input
                            type="number"
                            name="pricePerNight"
                            value={formData.pricePerNight}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Rating (0-5) *</label>
                        <input
                            type="number"
                            name="accommodationRating"
                            value={formData.accommodationRating}
                            onChange={handleChange}
                            min="0"
                            max="5"
                            step="0.1"
                            required
                            placeholder="4.5"
                            disabled={actionLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Capacity & Rooms */}
            <div className={styles.formSection}>
                <h3>Capacity & Rooms</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Number of Rooms</label>
                        <input
                            type="number"
                            name="numberOfRooms"
                            value={formData.numberOfRooms}
                            onChange={handleChange}
                            min="1"
                            placeholder="1"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Max Guests</label>
                        <input
                            type="number"
                            name="maxGuests"
                            value={formData.maxGuests}
                            onChange={handleChange}
                            min="1"
                            placeholder="2"
                            disabled={actionLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Check-in/Check-out */}
            <div className={styles.formSection}>
                <h3>Check-in/Check-out</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Check-in Time</label>
                        <input
                            type="time"
                            name="checkInTime"
                            value={formData.checkInTime}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Check-out Time</label>
                        <input
                            type="time"
                            name="checkOutTime"
                            value={formData.checkOutTime}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className={styles.formSection}>
                <h3>Contact Information</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Contact Email</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            placeholder="contact@example.com"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="accommodationPhone"
                            value={formData.accommodationPhone}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            disabled={actionLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Eco Features */}
            <div className={styles.formSection}>
                <h3>Eco Features</h3>
                <div className={styles.checkboxGrid}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="ecoCertified"
                            checked={formData.ecoCertified}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Eco Certified
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="organicFoodOffered"
                            checked={formData.organicFoodOffered}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Organic Food Offered
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="waterConservationSystem"
                            checked={formData.waterConservationSystem}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Water Conservation System
                    </label>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Renewable Energy (%)</label>
                        <input
                            type="number"
                            name="renewableEnergyPercent"
                            value={formData.renewableEnergyPercent}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            placeholder="0"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Waste Recycling Rate (%)</label>
                        <input
                            type="number"
                            name="wasteRecyclingRate"
                            value={formData.wasteRecyclingRate}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            placeholder="0"
                            disabled={actionLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Cultural Features */}
            <div className={styles.formSection}>
                <h3>Cultural Features</h3>
                <div className={styles.checkboxGrid}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="familyOwned"
                            checked={formData.familyOwned}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Family Owned
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="traditionalArchitecture"
                            checked={formData.traditionalArchitecture}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Traditional Architecture
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="homeCookedMeals"
                            checked={formData.homeCookedMeals}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Home Cooked Meals
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label>Cultural Experiences</label>
                    <textarea
                        name="culturalExperiences"
                        value={formData.culturalExperiences}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Cultural experiences offered"
                        disabled={actionLoading}
                    />
                </div>
            </div>

            {/* Amenities & Services */}
            <div className={styles.formSection}>
                <h3>Amenities & Services</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Star Rating</label>
                        <select
                            name="starRating"
                            value={formData.starRating}
                            onChange={handleChange}
                            disabled={actionLoading}
                        >
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>
                </div>
                <div className={styles.checkboxGrid}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="wifiAvailable"
                            checked={formData.wifiAvailable}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        WiFi Available
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="parkingAvailable"
                            checked={formData.parkingAvailable}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Parking Available
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="hasSwimmingPool"
                            checked={formData.hasSwimmingPool}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Swimming Pool
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="hasSpa"
                            checked={formData.hasSpa}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Spa
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="hasRestaurant"
                            checked={formData.hasRestaurant}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Restaurant
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="roomService"
                            checked={formData.roomService}
                            onChange={handleChange}
                            disabled={actionLoading}
                        />
                        Room Service
                    </label>
                </div>
            </div>
        </>
    );

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Eco-Tourism Accommodations</h1>
                        <p>{accommodations.length} accommodations available</p>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => setShowCreateModal(true)}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Loading...' : '+ New Accommodation'}
                    </button>
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
                        <button onClick={fetchAccommodations} disabled={actionLoading}>All</button>
                        <button onClick={fetchTopRated} disabled={actionLoading}>⭐ Top Rated</button>
                        <button onClick={fetchCheapest} disabled={actionLoading}>💰 Cheapest</button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className={styles.loading}>Loading accommodations...</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Rooms</th>
                                <th>Eco Certified</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accommodations.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>${item.pricePerNight}/night</td>
                                    <td>
                                        <span className={styles.rating}>
                                            {'⭐'.repeat(Math.round(item.accommodationRating))} {item.accommodationRating}
                                        </span>
                                    </td>
                                    <td>{item.numberOfRooms}</td>
                                    <td>
                                        {item.ecoCertified && (
                                            <span className={styles.badge}>✓ Eco Certified</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => handleView(item.id)}
                                                disabled={actionLoading}
                                            >
                                                👁️ View
                                            </button>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => openEditModal(item)}
                                                disabled={actionLoading}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => openDeleteModal(item)}
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
                        {accommodations.length === 0 && (
                            <div className={styles.noData}>
                                No accommodations found
                            </div>
                        )}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <Modal onClose={() => { setShowCreateModal(false); resetForm(); }}>
                        <h2>Create New Accommodation</h2>
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
                                    {actionLoading ? 'Creating...' : 'Create Accommodation'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <Modal onClose={() => { setShowEditModal(false); resetForm(); }}>
                        <h2>Edit Accommodation</h2>
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
                                    {actionLoading ? 'Updating...' : 'Update Accommodation'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* View Modal */}
                {showViewModal && selectedAccommodation && (
                    <Modal onClose={() => setShowViewModal(false)}>
                        <h2>Accommodation Details</h2>
                        <div className={styles.viewDetails}>
                            {/* Basic Information */}
                            <div className={styles.detailSection}>
                                <h3>Basic Information</h3>
                                <div className={styles.detailRow}>
                                    <strong>Name:</strong>
                                    <span>{selectedAccommodation.name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Type:</strong>
                                    <span>{selectedAccommodation.type}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Description:</strong>
                                    <span>{selectedAccommodation.description || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Price:</strong>
                                    <span>${selectedAccommodation.pricePerNight}/night</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Rating:</strong>
                                    <span>{'⭐'.repeat(Math.round(selectedAccommodation.accommodationRating))} {selectedAccommodation.accommodationRating}</span>
                                </div>
                            </div>

                            {/* Capacity & Rooms */}
                            <div className={styles.detailSection}>
                                <h3>Capacity & Rooms</h3>
                                <div className={styles.detailRow}>
                                    <strong>Number of Rooms:</strong>
                                    <span>{selectedAccommodation.numberOfRooms || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Max Guests:</strong>
                                    <span>{selectedAccommodation.maxGuests || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Check-in/Check-out */}
                            <div className={styles.detailSection}>
                                <h3>Check-in/Check-out</h3>
                                <div className={styles.detailRow}>
                                    <strong>Check-in Time:</strong>
                                    <span>{selectedAccommodation.checkInTime || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Check-out Time:</strong>
                                    <span>{selectedAccommodation.checkOutTime || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className={styles.detailSection}>
                                <h3>Contact Information</h3>
                                <div className={styles.detailRow}>
                                    <strong>Contact Email:</strong>
                                    <span>{selectedAccommodation.contactEmail || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Phone:</strong>
                                    <span>{selectedAccommodation.accommodationPhone || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Eco Features */}
                            <div className={styles.detailSection}>
                                <h3>Eco Features</h3>
                                <div className={styles.detailRow}>
                                    <strong>Eco Certified:</strong>
                                    <span>{selectedAccommodation.ecoCertified ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Renewable Energy:</strong>
                                    <span>{selectedAccommodation.renewableEnergyPercent || 0}%</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Waste Recycling Rate:</strong>
                                    <span>{selectedAccommodation.wasteRecyclingRate || 0}%</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Organic Food Offered:</strong>
                                    <span>{selectedAccommodation.organicFoodOffered ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Water Conservation System:</strong>
                                    <span>{selectedAccommodation.waterConservationSystem ? 'Yes' : 'No'}</span>
                                </div>
                            </div>

                            {/* Cultural Features */}
                            <div className={styles.detailSection}>
                                <h3>Cultural Features</h3>
                                <div className={styles.detailRow}>
                                    <strong>Family Owned:</strong>
                                    <span>{selectedAccommodation.familyOwned ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Traditional Architecture:</strong>
                                    <span>{selectedAccommodation.traditionalArchitecture ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Home Cooked Meals:</strong>
                                    <span>{selectedAccommodation.homeCookedMeals ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Cultural Experiences:</strong>
                                    <span>{selectedAccommodation.culturalExperiences || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Amenities & Services */}
                            <div className={styles.detailSection}>
                                <h3>Amenities & Services</h3>
                                <div className={styles.detailRow}>
                                    <strong>Star Rating:</strong>
                                    <span>{selectedAccommodation.starRating ? '⭐'.repeat(selectedAccommodation.starRating) : 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>WiFi Available:</strong>
                                    <span>{selectedAccommodation.wifiAvailable ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Parking Available:</strong>
                                    <span>{selectedAccommodation.parkingAvailable ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Swimming Pool:</strong>
                                    <span>{selectedAccommodation.hasSwimmingPool ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Spa:</strong>
                                    <span>{selectedAccommodation.hasSpa ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Restaurant:</strong>
                                    <span>{selectedAccommodation.hasRestaurant ? 'Yes' : 'No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Room Service:</strong>
                                    <span>{selectedAccommodation.roomService ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
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
                        <p>Are you sure you want to delete "{selectedAccommodation?.name}"?</p>
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