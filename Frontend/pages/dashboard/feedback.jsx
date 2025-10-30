// components/dashboard/feedback.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './feedback.module.css';
import {
    getAllFeedbacks,
    getFeedbackById,
    getActivityFeedback,
    submitFeedback,
    updateFeedback,
    deleteFeedback
} from '../../pages/api/feedback';

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActivityStatsModal, setShowActivityStatsModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [activityStats, setActivityStats] = useState(null);
    const [activityLoading, setActivityLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        min_rating: '',
        max_rating: '',
        user_name: ''
    });

    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 0,
        total: 0,
        hasMore: false
    });

    const [formData, setFormData] = useState({
        activity_uri: '',
        user_name: '',
        rating: 5,
        comment: ''
    });

    const [activityFormData, setActivityFormData] = useState({
        activity_uri: ''
    });

    // Fetch all feedbacks with filters
    const fetchFeedbacks = async (resetPagination = false) => {
        try {
            setLoading(true);
            setError('');

            const params = {
                limit: pagination.limit,
                offset: resetPagination ? 0 : pagination.offset,
            };

            // Add filters only if they have values
            if (filters.min_rating) params.min_rating = filters.min_rating;
            if (filters.max_rating) params.max_rating = filters.max_rating;
            if (filters.user_name) params.user_name = filters.user_name;

            const response = await getAllFeedbacks(params);
            setFeedbacks(response.feedbacks || []);
            setPagination(prev => ({
                ...prev,
                total: response.pagination?.total || 0,
                offset: resetPagination ? 0 : prev.offset,
                hasMore: response.pagination?.has_more || false
            }));
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setError('Failed to fetch feedbacks. Please try again.');
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks(true);
    }, [filters]);

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

    // Handle activity form changes
    const handleActivityFormChange = (e) => {
        const { name, value } = e.target;
        setActivityFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Create new feedback
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await submitFeedback(formData);
            setShowCreateModal(false);
            await fetchFeedbacks(true);
            resetForm();
            alert('✅ Feedback submitted successfully!');
        } catch (error) {
            console.error('Error creating feedback:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error submitting feedback. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update feedback
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await updateFeedback(selectedFeedback.id, formData);
            setShowEditModal(false);
            await fetchFeedbacks();
            resetForm();
            alert('✅ Feedback updated successfully!');
        } catch (error) {
            console.error('Error updating feedback:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating feedback. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete feedback
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            await deleteFeedback(selectedFeedback.id);
            setShowDeleteModal(false);
            await fetchFeedbacks();
            alert('✅ Feedback deleted successfully!');
        } catch (error) {
            console.error('Error deleting feedback:', error);
            setError('Error deleting feedback. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // View single feedback - FIXED: Don't call API, just show modal with current data
    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setShowViewModal(true);
    };

    // Get activity stats
    // Get activity stats - FIXED
    const handleGetActivityStats = async (e) => {
        e.preventDefault();
        setActivityLoading(true);
        try {
            setError('');
            console.log('Fetching stats for:', activityFormData.activity_uri);

            const data = await getActivityFeedback(activityFormData.activity_uri);

            console.log('Processed stats data:', data);
            setActivityStats(data);
        } catch (error) {
            console.error('Error fetching activity feedback:', error);

            let errorMsg = 'Error fetching activity feedback.';
            if (error.response?.status === 404) {
                errorMsg = 'Activity not found or no feedback available yet.';
            } else if (error.response?.data?.detail) {
                errorMsg = error.response.data.detail;
            }

            setError(errorMsg);
            setActivityStats(null);
        } finally {
            setActivityLoading(false);
        }
    };


    // Open edit modal
    const openEditModal = (feedback) => {
        setSelectedFeedback(feedback);
        setFormData({
            activity_uri: feedback.activity_uri || '',
            user_name: feedback.user_name || '',
            rating: feedback.rating || 5,
            comment: feedback.comment || ''
        });
        setShowEditModal(true);
    };

    // Open delete confirmation
    const openDeleteModal = (feedback) => {
        setSelectedFeedback(feedback);
        setShowDeleteModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            activity_uri: '',
            user_name: '',
            rating: 5,
            comment: ''
        });
        setError('');
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            min_rating: '',
            max_rating: '',
            user_name: ''
        });
    };

    // Render star rating
    const renderStars = (rating) => {
        return (
            <span>
        {'⭐'.repeat(rating)}
                {'☆'.repeat(5 - rating)}
      </span>
        );
    };

    // Search feedbacks
    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.activity_uri.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Loading feedbacks...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>User Feedback</h1>
                        <p>{pagination.total} feedbacks available</p>
                    </div>
                    <div className={styles.headerButtons}>
                        <button className={styles.statsBtn} onClick={() => setShowActivityStatsModal(true)}>
                            📊 Activity Stats
                        </button>
                        <button className={styles.primaryBtn} onClick={() => setShowCreateModal(true)}>
                            + New Feedback
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button className={styles.dismissError} onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Search and Filters */}
                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Search by user or activity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button className={styles.searchBtn}>Search</button>

                    <div className={styles.filters}>
                        <select
                            name="min_rating"
                            value={filters.min_rating}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                        >
                            <option value="">Min Rating - Any</option>
                            <option value="1">1⭐ & Up</option>
                            <option value="2">2⭐ & Up</option>
                            <option value="3">3⭐ & Up</option>
                            <option value="4">4⭐ & Up</option>
                            <option value="5">5⭐ Only</option>
                        </select>

                        <select
                            name="max_rating"
                            value={filters.max_rating}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                        >
                            <option value="">Max Rating - Any</option>
                            <option value="1">1⭐ Only</option>
                            <option value="2">Up to 2⭐</option>
                            <option value="3">Up to 3⭐</option>
                            <option value="4">Up to 4⭐</option>
                            <option value="5">5⭐</option>
                        </select>

                        <input
                            type="text"
                            name="user_name"
                            value={filters.user_name}
                            onChange={handleFilterChange}
                            placeholder="Filter by user"
                            className={styles.filterInput}
                        />

                        <button className={styles.clearBtn} onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Feedbacks Table */}
                <div className={styles.tableSection}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Activity</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredFeedbacks.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                    No feedbacks found
                                </td>
                            </tr>
                        ) : (
                            filteredFeedbacks.map(feedback => (
                                <tr key={feedback.id}>
                                    <td className={styles.userName}>{feedback.user_name}</td>
                                    <td className={styles.activity}>{feedback.activity_uri}</td>
                                    <td className={styles.rating}>{renderStars(feedback.rating)}</td>
                                    <td className={styles.comment}>{feedback.comment.substring(0, 50)}...</td>
                                    <td className={styles.date}>
                                        {new Date(feedback.created_at).toLocaleDateString()}
                                    </td>
                                    <td className={styles.actions}>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => handleViewFeedback(feedback)}
                                            title="View"
                                        >
                                            👁 View
                                        </button>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => openEditModal(feedback)}
                                            title="Edit"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => openDeleteModal(feedback)}
                                            title="Delete"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* View Modal - FIXED */}
                {showViewModal && selectedFeedback && (
                    <div className={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>

                            <h2>Feedback Details</h2>

                            <div className={styles.detailBox}>
                                <div className={styles.detailRow}>
                                    <strong>User Name:</strong>
                                    <span>{selectedFeedback.user_name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Activity URI:</strong>
                                    <span>{selectedFeedback.activity_uri}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Rating:</strong>
                                    <span>{renderStars(selectedFeedback.rating)} ({selectedFeedback.rating}/5)</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Comment:</strong>
                                    <span>{selectedFeedback.comment}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Created:</strong>
                                    <span>{new Date(selectedFeedback.created_at).toLocaleString()}</span>
                                </div>
                                {selectedFeedback.updated_at && (
                                    <div className={styles.detailRow}>
                                        <strong>Updated:</strong>
                                        <span>{new Date(selectedFeedback.updated_at).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>

                            <h2>Submit New Feedback</h2>

                            <form onSubmit={handleCreate}>
                                <div className={styles.formGroup}>
                                    <label>Activity URI *</label>
                                    <input
                                        type="text"
                                        name="activity_uri"
                                        value={formData.activity_uri}
                                        onChange={handleChange}
                                        placeholder="Enter activity URI"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>User Name *</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        value={formData.user_name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Rating *</label>
                                    <select
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                    >
                                        <option value="1">⭐ Poor (1)</option>
                                        <option value="2">⭐⭐ Fair (2)</option>
                                        <option value="3">⭐⭐⭐ Good (3)</option>
                                        <option value="4">⭐⭐⭐⭐ Very Good (4)</option>
                                        <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Comment *</label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        placeholder="Share your feedback..."
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            resetForm();
                                        }}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && selectedFeedback && (
                    <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>×</button>

                            <h2>Edit Feedback</h2>

                            <form onSubmit={handleUpdate}>
                                <div className={styles.formGroup}>
                                    <label>Activity URI *</label>
                                    <input
                                        type="text"
                                        name="activity_uri"
                                        value={formData.activity_uri}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>User Name *</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        value={formData.user_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Rating *</label>
                                    <select
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                    >
                                        <option value="1">⭐ Poor (1)</option>
                                        <option value="2">⭐⭐ Fair (2)</option>
                                        <option value="3">⭐⭐⭐ Good (3)</option>
                                        <option value="4">⭐⭐⭐⭐ Very Good (4)</option>
                                        <option value="5">⭐⭐⭐⭐⭐ Excellent (5)</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Comment *</label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && selectedFeedback && (
                    <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={() => setShowDeleteModal(false)}>×</button>

                            <h2>Delete Feedback</h2>

                            <p className={styles.warning}>
                                Are you sure you want to delete feedback from <strong>"{selectedFeedback.user_name}"</strong>?
                                This action cannot be undone.
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.deleteConfirmBtn}
                                    onClick={handleDelete}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activity Stats Modal - ENHANCED */}
                {/* Activity Stats Modal - ENHANCED with persistent display */}
                {showActivityStatsModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowActivityStatsModal(false)}>
                        <div className={styles.largeModalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={() => setShowActivityStatsModal(false)}>×</button>

                            <h2>📊 Activity Feedback Stats</h2>

                            {!activityStats ? (
                                // Search Form - Show when no stats loaded
                                <form onSubmit={handleGetActivityStats} className={styles.statsForm}>
                                    <div className={styles.formGroup}>
                                        <label>Activity URI *</label>
                                        <input
                                            type="text"
                                            name="activity_uri"
                                            value={activityFormData.activity_uri}
                                            onChange={handleActivityFormChange}
                                            placeholder="Enter activity URI to view stats"
                                            required
                                        />
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowActivityStatsModal(false);
                                                setActivityStats(null);
                                                setActivityFormData({ activity_uri: '' });
                                            }}
                                            className={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={styles.submitBtn}
                                            disabled={activityLoading}
                                        >
                                            {activityLoading ? '⏳ Loading...' : '🔍 Get Stats'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Stats Results - Show when stats are loaded
                                <div className={styles.statsResultsContainer}>
                                    <div className={styles.statsResultsHeader}>
                                        <h3>Results for: {activityFormData.activity_uri}</h3>
                                        <button
                                            className={styles.newSearchBtn}
                                            onClick={() => setActivityStats(null)}
                                        >
                                            🔄 New Search
                                        </button>
                                    </div>

                                    {/* Summary Cards */}
                                    {activityStats.average_rating !== undefined && (
                                        <div className={styles.summaryCards}>
                                            <div className={styles.summaryCard}>
                                                <div className={styles.cardIcon}>⭐</div>
                                                <div className={styles.cardContent}>
                                                    <span>Average Rating</span>
                                                    <strong>{activityStats.average_rating.toFixed(2)}</strong>
                                                    <p className={styles.cardSubtext}>
                                                        {Math.round(activityStats.average_rating)} out of 5
                                                    </p>
                                                </div>
                                            </div>

                                            {activityStats.total_reviews !== undefined && (
                                                <div className={styles.summaryCard}>
                                                    <div className={styles.cardIcon}>📝</div>
                                                    <div className={styles.cardContent}>
                                                        <span>Total Reviews</span>
                                                        <strong>{activityStats.total_reviews}</strong>
                                                        <p className={styles.cardSubtext}>feedback entries</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Rating Distribution */}
                                    {activityStats.rating_distribution && (
                                        <div className={styles.ratingDistributionBox}>
                                            <h4>Rating Distribution</h4>
                                            <div className={styles.distributionCards}>
                                                <div className={styles.ratingCard}>
                                                    <div className={styles.ratingLabel}>5⭐</div>
                                                    <div className={styles.ratingBar}>
                                                        <div
                                                            className={styles.ratingFill}
                                                            style={{ width: `${(activityStats.rating_distribution['5'] || 0) / Math.max(activityStats.total_reviews, 1) * 100}%`, backgroundColor: '#10b981' }}
                                                        />
                                                    </div>
                                                    <div className={styles.ratingCount}>{activityStats.rating_distribution['5'] || 0}</div>
                                                </div>

                                                <div className={styles.ratingCard}>
                                                    <div className={styles.ratingLabel}>4⭐</div>
                                                    <div className={styles.ratingBar}>
                                                        <div
                                                            className={styles.ratingFill}
                                                            style={{ width: `${(activityStats.rating_distribution['4'] || 0) / Math.max(activityStats.total_reviews, 1) * 100}%`, backgroundColor: '#84cc16' }}
                                                        />
                                                    </div>
                                                    <div className={styles.ratingCount}>{activityStats.rating_distribution['4'] || 0}</div>
                                                </div>

                                                <div className={styles.ratingCard}>
                                                    <div className={styles.ratingLabel}>3⭐</div>
                                                    <div className={styles.ratingBar}>
                                                        <div
                                                            className={styles.ratingFill}
                                                            style={{ width: `${(activityStats.rating_distribution['3'] || 0) / Math.max(activityStats.total_reviews, 1) * 100}%`, backgroundColor: '#f59e0b' }}
                                                        />
                                                    </div>
                                                    <div className={styles.ratingCount}>{activityStats.rating_distribution['3'] || 0}</div>
                                                </div>

                                                <div className={styles.ratingCard}>
                                                    <div className={styles.ratingLabel}>2⭐</div>
                                                    <div className={styles.ratingBar}>
                                                        <div
                                                            className={styles.ratingFill}
                                                            style={{ width: `${(activityStats.rating_distribution['2'] || 0) / Math.max(activityStats.total_reviews, 1) * 100}%`, backgroundColor: '#ff9800' }}
                                                        />
                                                    </div>
                                                    <div className={styles.ratingCount}>{activityStats.rating_distribution['2'] || 0}</div>
                                                </div>

                                                <div className={styles.ratingCard}>
                                                    <div className={styles.ratingLabel}>1⭐</div>
                                                    <div className={styles.ratingBar}>
                                                        <div
                                                            className={styles.ratingFill}
                                                            style={{ width: `${(activityStats.rating_distribution['1'] || 0) / Math.max(activityStats.total_reviews, 1) * 100}%`, backgroundColor: '#ef4444' }}
                                                        />
                                                    </div>
                                                    <div className={styles.ratingCount}>{activityStats.rating_distribution['1'] || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent Reviews */}
                                    {activityStats.recent_reviews && Array.isArray(activityStats.recent_reviews) && activityStats.recent_reviews.length > 0 && (
                                        <div className={styles.reviewsList}>
                                            <h4>📋 Recent Reviews</h4>
                                            <div className={styles.reviewsContainer}>
                                                {activityStats.recent_reviews.map((review, idx) => (
                                                    <div key={idx} className={styles.reviewCard}>
                                                        <div className={styles.reviewHeader}>
                                                            <div className={styles.reviewUserInfo}>
                                                                <strong>{review.user_name}</strong>
                                                                <span className={styles.reviewDate}>
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                                                            </div>
                                                            <span className={styles.reviewRating}>
                                {renderStars(review.rating)}
                              </span>
                                                        </div>
                                                        <p className={styles.reviewComment}>{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Summary Text */}
                                    {activityStats.feedback_summary && (
                                        <div className={styles.summaryTextBox}>
                                            <h4>📝 Summary</h4>
                                            <p>{activityStats.feedback_summary}</p>
                                        </div>
                                    )}

                                    {/* No Data Message */}
                                    {(!activityStats.recent_reviews || activityStats.recent_reviews.length === 0) &&
                                        !activityStats.rating_distribution && (
                                            <div className={styles.noDataBox}>
                                                <p>No detailed feedback data available for this activity yet.</p>
                                            </div>
                                        )}

                                    {/* Close Button */}
                                    <div className={styles.modalActions}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowActivityStatsModal(false);
                                                setActivityStats(null);
                                                setActivityFormData({ activity_uri: '' });
                                            }}
                                            className={styles.submitBtn}
                                        >
                                            Close
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
