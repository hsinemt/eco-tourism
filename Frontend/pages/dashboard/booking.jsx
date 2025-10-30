// components/dashboard/booking.jsx

import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './booking.module.css';
import {
    getAllBookings,
    getBookingById,
    getBookingsByTourist,
    createBooking,
    updateBooking,
    deleteBooking,
    BOOKING_STATUS
} from '../api/booking';

export default function Booking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        booking_id: '',
        booking_date: new Date().toISOString().slice(0, 16),
        booking_status: BOOKING_STATUS.CONFIRMED,
        confirmation_code: '',
        tourist_id: ''
    });

    const [filters, setFilters] = useState({
        tourist_id: '',
        status: ''
    });

    // Fetch all bookings
    const fetchBookings = async (filterParams = {}) => {
        try {
            setLoading(true);
            setError('');
            console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
            console.log('Fetching bookings with filters:', filterParams);

            let data;
            if (filterParams.tourist_id) {
                data = await getBookingsByTourist(filterParams.tourist_id);
            } else {
                data = await getAllBookings();
            }

            console.log('Fetched data successfully:', data);
            setBookings(data.bookings || []);

        } catch (error) {
            console.error('Error fetching bookings:', error);
            const errorMessage = error.response?.data?.detail ||
                error.message ||
                'Failed to connect to server. Please check if backend is running.';
            setError(errorMessage);

            if (error.code === 'ECONNABORTED') {
                setError('Connection timeout. Please check if the backend server is running on ' +
                    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Create new booking
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            const result = await createBooking(formData);
            setShowCreateModal(false);
            await fetchBookings();
            resetForm();
            alert(`Booking created successfully! Confirmation code: ${result.confirmation_code}`);
        } catch (error) {
            console.error('Error creating booking:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error creating booking. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update booking
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await updateBooking(selectedBooking.booking_id, formData);
            setShowEditModal(false);
            await fetchBookings();
            resetForm();
            alert('Booking updated successfully!');
        } catch (error) {
            console.error('Error updating booking:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating booking. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete booking
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            await deleteBooking(selectedBooking.booking_id);
            setShowDeleteModal(false);
            await fetchBookings();
            alert('Booking deleted successfully!');
        } catch (error) {
            console.error('Error deleting booking:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Error deleting booking. Please try again.';
            setError(errorMessage);
        } finally {
            setActionLoading(false);
        }
    };

    // View single booking
    const handleView = async (booking) => {
        try {
            setError('');
            const data = await getBookingById(booking.booking_id);
            setSelectedBooking(data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching booking:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Error fetching booking details.';
            setError(errorMessage);
        }
    };

    // Search bookings
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            fetchBookings();
            return;
        }

        const filtered = bookings.filter(booking =>
            (booking.booking_id && booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (booking.confirmation_code && booking.confirmation_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (booking.tourist_id && booking.tourist_id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setBookings(filtered);
    };

    // Apply filters
    const handleApplyFilters = () => {
        fetchBookings(filters);
        setShowFilterModal(false);
    };

    // Clear filters
    const handleClearFilters = () => {
        setFilters({
            tourist_id: '',
            status: ''
        });
        fetchBookings();
        setShowFilterModal(false);
    };

    // Open edit modal
    const openEditModal = (booking) => {
        setSelectedBooking(booking);
        setFormData({
            booking_id: booking.booking_id,
            booking_date: booking.booking_date ? formatDateForInput(booking.booking_date) : new Date().toISOString().slice(0, 16),
            booking_status: booking.booking_status || BOOKING_STATUS.CONFIRMED,
            confirmation_code: booking.confirmation_code || '',
            tourist_id: booking.tourist_id || ''
        });
        setShowEditModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            booking_id: '',
            booking_date: new Date().toISOString().slice(0, 16),
            booking_status: BOOKING_STATUS.CONFIRMED,
            confirmation_code: '',
            tourist_id: ''
        });
        setError('');
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Format date for datetime-local input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16);
        } catch (error) {
            return dateString;
        }
    };

    // Render status badge
    const renderStatusBadge = (status) => {
        const statusConfig = {
            [BOOKING_STATUS.PENDING]: { class: styles.statusPending, label: '⏳ Pending' },
            [BOOKING_STATUS.CONFIRMED]: { class: styles.statusConfirmed, label: '✅ Confirmed' },
            [BOOKING_STATUS.CANCELLED]: { class: styles.statusCancelled, label: '❌ Cancelled' }
        };

        const config = statusConfig[status] || { class: styles.statusDefault, label: status || 'Unknown' };

        return (
            <span className={`${styles.statusBadge} ${config.class}`}>
                {config.label}
            </span>
        );
    };

    // Open delete confirmation
    const openDeleteModal = (booking) => {
        setSelectedBooking(booking);
        setShowDeleteModal(true);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Bookings Management</h1>
                        <p>{bookings.length} bookings available</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => setShowFilterModal(true)}
                            disabled={actionLoading}
                        >
                            🔍 Filter
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => setShowCreateModal(true)}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Loading...' : '+ New Booking'}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className={styles.error}>
                        <strong>Error:</strong> {error}
                        <button
                            onClick={() => setError('')}
                            className={styles.dismissError}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Search and Filters */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search by booking ID, confirmation code, or tourist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            disabled={actionLoading || loading}
                        />
                        <button onClick={handleSearch} disabled={actionLoading || loading}>
                            🔍 Search
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className={styles.loading}>
                        <div>Loading bookings...</div>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Tourist ID</th>
                                <th>Booking Date</th>
                                <th>Status</th>
                                <th>Confirmation Code</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.booking_id}>
                                    <td className={styles.bookingId}>
                                        <strong>{booking.booking_id || 'N/A'}</strong>
                                    </td>
                                    <td>
                                        {booking.tourist_id || 'N/A'}
                                    </td>
                                    <td className={styles.dateCell}>
                                        {formatDate(booking.booking_date)}
                                    </td>
                                    <td>
                                        {renderStatusBadge(booking.booking_status)}
                                    </td>
                                    <td className={styles.confirmationCode}>
                                        {booking.confirmation_code || 'N/A'}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => handleView(booking)}
                                                disabled={actionLoading}
                                                title="View details"
                                            >
                                                👁️ View
                                            </button>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => openEditModal(booking)}
                                                disabled={actionLoading}
                                                title="Edit booking"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => openDeleteModal(booking)}
                                                disabled={actionLoading}
                                                title="Delete booking"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {bookings.length === 0 && !loading && (
                            <div className={styles.noData}>
                                No bookings found.
                                {error ? ' There was an error fetching bookings.' : ' Create your first booking using the "New Booking" button.'}
                            </div>
                        )}
                    </div>
                )}

                {/* Create Booking Modal */}
                {showCreateModal && (
                    <Modal onClose={() => setShowCreateModal(false)}>
                        <h2>Create New Booking</h2>
                        <form onSubmit={handleCreate} className={styles.form}>
                            <div className={styles.formSection}>
                                <h3>Booking Information</h3>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Tourist ID *</label>
                                        <input
                                            type="text"
                                            name="tourist_id"
                                            value={formData.tourist_id}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., hsine100"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Booking Status</label>
                                        <select
                                            name="booking_status"
                                            value={formData.booking_status}
                                            onChange={handleChange}
                                        >
                                            <option value={BOOKING_STATUS.PENDING}>Pending</option>
                                            <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
                                            <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Booking Date</label>
                                        <input
                                            type="datetime-local"
                                            name="booking_date"
                                            value={formData.booking_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Confirmation Code</label>
                                        <input
                                            type="text"
                                            name="confirmation_code"
                                            value={formData.confirmation_code}
                                            onChange={handleChange}
                                            placeholder="Auto-generated if empty"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={actionLoading}>
                                    {actionLoading ? 'Creating...' : 'Create Booking'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Edit Booking Modal */}
                {showEditModal && selectedBooking && (
                    <Modal onClose={() => setShowEditModal(false)}>
                        <h2>Edit Booking</h2>
                        <form onSubmit={handleUpdate} className={styles.form}>
                            <div className={styles.formSection}>
                                <h3>Booking Information</h3>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Booking ID</label>
                                        <input
                                            type="text"
                                            value={selectedBooking.booking_id}
                                            disabled
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Tourist ID</label>
                                        <input
                                            type="text"
                                            value={selectedBooking.tourist_id}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Booking Date</label>
                                        <input
                                            type="datetime-local"
                                            name="booking_date"
                                            value={formData.booking_date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Booking Status</label>
                                        <select
                                            name="booking_status"
                                            value={formData.booking_status}
                                            onChange={handleChange}
                                        >
                                            <option value={BOOKING_STATUS.PENDING}>Pending</option>
                                            <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
                                            <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Confirmation Code</label>
                                    <input
                                        type="text"
                                        name="confirmation_code"
                                        value={formData.confirmation_code}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={actionLoading}>
                                    {actionLoading ? 'Updating...' : 'Update Booking'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* View Booking Modal */}
                {showViewModal && selectedBooking && (
                    <Modal onClose={() => setShowViewModal(false)}>
                        <h2>Booking Details</h2>
                        <div className={styles.viewDetails}>
                            <div className={styles.detailSection}>
                                <h3>Booking Information</h3>
                                <div className={styles.detailRow}>
                                    <strong>Booking URL:</strong>
                                    <span>{selectedBooking.booking_url || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Booking ID:</strong>
                                    <span>{selectedBooking.booking_id}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Tourist ID:</strong>
                                    <span>{selectedBooking.tourist_id || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Tourist URI:</strong>
                                    <span>{selectedBooking.tourist_uri || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Booking Date:</strong>
                                    <span>{formatDate(selectedBooking.booking_date)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Status:</strong>
                                    <span>{renderStatusBadge(selectedBooking.booking_status)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Confirmation Code:</strong>
                                    <span className={styles.confirmationCode}>{selectedBooking.confirmation_code || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setShowViewModal(false)}>
                                Close
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedBooking && (
                    <Modal onClose={() => setShowDeleteModal(false)}>
                        <h2>Delete Booking</h2>
                        <div className={styles.warning}>
                            ⚠️ This action cannot be undone.
                        </div>
                        <p>Are you sure you want to delete booking <strong>{selectedBooking.booking_id}</strong>?</p>
                        <div className={styles.modalActions}>
                            <button type="button" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className={styles.dangerBtn}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete Booking'}
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Filter Modal */}
                {showFilterModal && (
                    <Modal onClose={() => setShowFilterModal(false)}>
                        <h2>Filter Bookings</h2>
                        <div className={styles.form}>
                            <div className={styles.formSection}>
                                <div className={styles.formGroup}>
                                    <label>Tourist ID</label>
                                    <input
                                        type="text"
                                        name="tourist_id"
                                        value={filters.tourist_id}
                                        onChange={handleFilterChange}
                                        placeholder="Filter by tourist ID"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value={BOOKING_STATUS.PENDING}>Pending</option>
                                        <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
                                        <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                                <button type="button" onClick={handleApplyFilters}>
                                    Apply Filters
                                </button>
                            </div>
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