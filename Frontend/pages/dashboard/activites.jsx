// components/dashboard/activities.jsx

import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './activities.module.css';
import {
    getAllActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    searchActivities,
    getTopRatedActivities,
    getCheapestActivities,
    compareActivities,
    ACTIVITY_TYPES,
    DIFFICULTY_LEVELS
} from '../api/activity';

export default function Activities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [compareActivity1, setCompareActivity1] = useState(null);
    const [compareActivity2, setCompareActivity2] = useState(null);
    const [compareResult, setCompareResult] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Information
        type: 'NatureActivity',
        name: '',
        description: '',
        pricePerPerson: '',
        activityRating: '',

        // Activity Details
        durationHours: '',
        difficultyLevel: 'Easy',
        maxParticipants: '',
        minAge: '',
        schedule: '',
        activityLanguages: '',

        // Adventure-specific
        riskLevel: '',
        requiredEquipment: '',
        physicalFitnessRequired: '',
        safetyBriefingRequired: false,

        // Cultural-specific
        culturalTheme: '',
        historicalPeriod: '',
        audioGuideAvailable: false,
        photographyAllowed: false,

        // Nature-specific
        ecosystemType: '',
        wildlifeSpotting: '',
        bestTimeToVisit: '',
        binocularsProvided: false
    });

    // Fetch all activities
    const fetchActivities = async (type = '') => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllActivities(type || null);
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setError('Failed to fetch activities. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
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
            riskLevel: '',
            requiredEquipment: '',
            physicalFitnessRequired: '',
            safetyBriefingRequired: false,
            culturalTheme: '',
            historicalPeriod: '',
            audioGuideAvailable: false,
            photographyAllowed: false,
            ecosystemType: '',
            wildlifeSpotting: '',
            bestTimeToVisit: '',
            binocularsProvided: false
        }));
    };

    // Create new activity
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await createActivity(formData);
            setShowCreateModal(false);
            await fetchActivities(selectedType);
            resetForm();
            alert('Activity created successfully!');
        } catch (error) {
            console.error('Error creating activity:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error creating activity. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update activity
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            await updateActivity(selectedActivity.id, formData);
            setShowEditModal(false);
            await fetchActivities(selectedType);
            resetForm();
            alert('Activity updated successfully!');
        } catch (error) {
            console.error('Error updating activity:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating activity. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete activity
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            await deleteActivity(selectedActivity.id);
            setShowDeleteModal(false);
            await fetchActivities(selectedType);
            alert('Activity deleted successfully!');
        } catch (error) {
            console.error('Error deleting activity:', error);
            setError('Error deleting activity. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // View single activity
    const handleView = async (id) => {
        try {
            setError('');
            const data = await getActivityById(id);
            setSelectedActivity(data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching activity:', error);
            setError('Error fetching activity details.');
        }
    };

    // Search activity by name
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchActivities(selectedType);
            return;
        }

        try {
            setError('');
            const data = await searchActivities(searchTerm);
            setActivities(data);
        } catch (error) {
            console.error('Error searching:', error);
            setError('Error searching activities.');
        }
    };

    // Compare activities
    const handleCompare = async () => {
        if (!compareActivity1 || !compareActivity2) {
            setError('Please select two activities to compare.');
            return;
        }

        setActionLoading(true);
        try {
            setError('');
            const result = await compareActivities(compareActivity1.id, compareActivity2.id);
            setCompareResult(result);
        } catch (error) {
            console.error('Error comparing activities:', error);
            setError('Error comparing activities.');
        } finally {
            setActionLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setFormData({
            type: activity.type || 'NatureActivity',
            name: activity.name || '',
            description: activity.description || '',
            pricePerPerson: activity.pricePerPerson || '',
            activityRating: activity.activityRating || '',
            durationHours: activity.durationHours || '',
            difficultyLevel: activity.difficultyLevel || 'Easy',
            maxParticipants: activity.maxParticipants || '',
            minAge: activity.minAge || '',
            schedule: activity.schedule || '',
            activityLanguages: activity.activityLanguages || '',
            riskLevel: activity.riskLevel || '',
            requiredEquipment: activity.requiredEquipment || '',
            physicalFitnessRequired: activity.physicalFitnessRequired || '',
            safetyBriefingRequired: Boolean(activity.safetyBriefingRequired),
            culturalTheme: activity.culturalTheme || '',
            historicalPeriod: activity.historicalPeriod || '',
            audioGuideAvailable: Boolean(activity.audioGuideAvailable),
            photographyAllowed: Boolean(activity.photographyAllowed),
            ecosystemType: activity.ecosystemType || '',
            wildlifeSpotting: activity.wildlifeSpotting || '',
            bestTimeToVisit: activity.bestTimeToVisit || '',
            binocularsProvided: Boolean(activity.binocularsProvided)
        });
        setShowEditModal(true);
    };

    // Open delete confirmation
    const openDeleteModal = (activity) => {
        setSelectedActivity(activity);
        setShowDeleteModal(true);
    };

    // Open compare modal
    const openCompareModal = () => {
        setCompareActivity1(null);
        setCompareActivity2(null);
        setCompareResult(null);
        setShowCompareModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            type: 'NatureActivity',
            name: '',
            description: '',
            pricePerPerson: '',
            activityRating: '',
            durationHours: '',
            difficultyLevel: 'Easy',
            maxParticipants: '',
            minAge: '',
            schedule: '',
            activityLanguages: '',
            riskLevel: '',
            requiredEquipment: '',
            physicalFitnessRequired: '',
            safetyBriefingRequired: false,
            culturalTheme: '',
            historicalPeriod: '',
            audioGuideAvailable: false,
            photographyAllowed: false,
            ecosystemType: '',
            wildlifeSpotting: '',
            bestTimeToVisit: '',
            binocularsProvided: false
        });
        setError('');
    };

    // Fetch top-rated activities
    const fetchTopRated = async () => {
        try {
            setError('');
            const data = await getTopRatedActivities();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching top-rated:', error);
            setError('Error fetching top-rated activities.');
        }
    };

    // Fetch cheapest activities
    const fetchCheapest = async () => {
        try {
            setError('');
            const data = await getCheapestActivities();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching cheapest:', error);
            setError('Error fetching cheapest activities.');
        }
    };

    // Filter by type
    const handleTypeFilter = (type) => {
        setSelectedType(type);
        fetchActivities(type);
    };

    // Render type-specific form fields
    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case 'AdventureActivity':
                return (
                    <div className={styles.formSection}>
                        <h3>Adventure Activity Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Risk Level (1-10)</label>
                                <input
                                    type="number"
                                    name="riskLevel"
                                    value={formData.riskLevel}
                                    onChange={handleChange}
                                    min="1"
                                    max="10"
                                    placeholder="5"
                                    disabled={actionLoading}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Required Equipment</label>
                                <input
                                    type="text"
                                    name="requiredEquipment"
                                    value={formData.requiredEquipment}
                                    onChange={handleChange}
                                    placeholder="Helmet, harness, etc."
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Physical Fitness Required</label>
                            <input
                                type="text"
                                name="physicalFitnessRequired"
                                value={formData.physicalFitnessRequired}
                                onChange={handleChange}
                                placeholder="Moderate fitness level required"
                                disabled={actionLoading}
                            />
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="safetyBriefingRequired"
                                    checked={formData.safetyBriefingRequired}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Safety Briefing Required
                            </label>
                        </div>
                    </div>
                );

            case 'CulturalActivity':
                return (
                    <div className={styles.formSection}>
                        <h3>Cultural Activity Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Cultural Theme</label>
                                <input
                                    type="text"
                                    name="culturalTheme"
                                    value={formData.culturalTheme}
                                    onChange={handleChange}
                                    placeholder="Traditional crafts, local history, etc."
                                    disabled={actionLoading}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Historical Period</label>
                                <input
                                    type="text"
                                    name="historicalPeriod"
                                    value={formData.historicalPeriod}
                                    onChange={handleChange}
                                    placeholder="Ancient, Medieval, etc."
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="audioGuideAvailable"
                                    checked={formData.audioGuideAvailable}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Audio Guide Available
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="photographyAllowed"
                                    checked={formData.photographyAllowed}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Photography Allowed
                            </label>
                        </div>
                    </div>
                );

            case 'NatureActivity':
                return (
                    <div className={styles.formSection}>
                        <h3>Nature Activity Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Ecosystem Type</label>
                                <input
                                    type="text"
                                    name="ecosystemType"
                                    value={formData.ecosystemType}
                                    onChange={handleChange}
                                    placeholder="Forest, Desert, Marine, etc."
                                    disabled={actionLoading}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Wildlife Spotting</label>
                                <input
                                    type="text"
                                    name="wildlifeSpotting"
                                    value={formData.wildlifeSpotting}
                                    onChange={handleChange}
                                    placeholder="Birds, mammals, marine life, etc."
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Best Time to Visit</label>
                            <input
                                type="text"
                                name="bestTimeToVisit"
                                value={formData.bestTimeToVisit}
                                onChange={handleChange}
                                placeholder="Early morning, spring season, etc."
                                disabled={actionLoading}
                            />
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="binocularsProvided"
                                    checked={formData.binocularsProvided}
                                    onChange={handleChange}
                                    disabled={actionLoading}
                                />
                                Binoculars Provided
                            </label>
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
                            <option value="NatureActivity">Nature Activity</option>
                            <option value="AdventureActivity">Adventure Activity</option>
                            <option value="CulturalActivity">Cultural Activity</option>
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
                            placeholder="Activity name"
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
                        placeholder="Activity description"
                        disabled={actionLoading}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Price per Person ($) *</label>
                        <input
                            type="number"
                            name="pricePerPerson"
                            value={formData.pricePerPerson}
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
                            name="activityRating"
                            value={formData.activityRating}
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

            {/* Activity Details */}
            <div className={styles.formSection}>
                <h3>Activity Details</h3>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Duration (hours) *</label>
                        <input
                            type="number"
                            name="durationHours"
                            value={formData.durationHours}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="2"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Difficulty Level *</label>
                        <select
                            name="difficultyLevel"
                            value={formData.difficultyLevel}
                            onChange={handleChange}
                            required
                            disabled={actionLoading}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Difficult">Difficult</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Max Participants</label>
                        <input
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            min="1"
                            placeholder="10"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Minimum Age</label>
                        <input
                            type="number"
                            name="minAge"
                            value={formData.minAge}
                            onChange={handleChange}
                            min="0"
                            placeholder="12"
                            disabled={actionLoading}
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Schedule</label>
                        <input
                            type="text"
                            name="schedule"
                            value={formData.schedule}
                            onChange={handleChange}
                            placeholder="Daily at 9:00 AM and 2:00 PM"
                            disabled={actionLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Languages</label>
                        <input
                            type="text"
                            name="activityLanguages"
                            value={formData.activityLanguages}
                            onChange={handleChange}
                            placeholder="English, French, Spanish"
                            disabled={actionLoading}
                        />
                    </div>
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
                        <h1>Eco-Tourism Activities</h1>
                        <p>{activities.length} activities available</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className={styles.primaryBtn}
                            onClick={openCompareModal}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Loading...' : '🔄 Compare'}
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => setShowCreateModal(true)}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Loading...' : '+ New Activity'}
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
                        <button onClick={() => handleTypeFilter('')} disabled={actionLoading}>All Types</button>
                        <button onClick={() => handleTypeFilter('NatureActivity')} disabled={actionLoading}>🌿 Nature</button>
                        <button onClick={() => handleTypeFilter('AdventureActivity')} disabled={actionLoading}>🏔️ Adventure</button>
                        <button onClick={() => handleTypeFilter('CulturalActivity')} disabled={actionLoading}>🏛️ Cultural</button>
                        <button onClick={fetchTopRated} disabled={actionLoading}>⭐ Top Rated</button>
                        <button onClick={fetchCheapest} disabled={actionLoading}>💰 Cheapest</button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className={styles.loading}>Loading activities...</div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Difficulty</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {activities.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        {item.type === 'NatureActivity' && '🌿 Nature'}
                                        {item.type === 'AdventureActivity' && '🏔️ Adventure'}
                                        {item.type === 'CulturalActivity' && '🏛️ Cultural'}
                                    </td>
                                    <td>${item.pricePerPerson}/person</td>
                                    <td>{item.durationHours}h</td>
                                    <td>
                                        <span className={`${styles.badge} ${
                                            item.difficultyLevel === 'Easy' ? styles.easy :
                                                item.difficultyLevel === 'Moderate' ? styles.moderate :
                                                    item.difficultyLevel === 'Difficult' ? styles.difficult :
                                                        styles.expert
                                        }`}>
                                            {item.difficultyLevel}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.rating}>
                                            {'⭐'.repeat(Math.round(item.activityRating))} {item.activityRating}
                                        </span>
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
                        {activities.length === 0 && (
                            <div className={styles.noData}>
                                No activities found
                            </div>
                        )}
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <Modal onClose={() => { setShowCreateModal(false); resetForm(); }}>
                        <h2>Create New Activity</h2>
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
                                    {actionLoading ? 'Creating...' : 'Create Activity'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <Modal onClose={() => { setShowEditModal(false); resetForm(); }}>
                        <h2>Edit Activity</h2>
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
                                    {actionLoading ? 'Updating...' : 'Update Activity'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* View Modal */}
                {showViewModal && selectedActivity && (
                    <Modal onClose={() => setShowViewModal(false)}>
                        <h2>Activity Details</h2>
                        <div className={styles.viewDetails}>
                            {/* Basic Information */}
                            <div className={styles.detailSection}>
                                <h3>Basic Information</h3>
                                <div className={styles.detailRow}>
                                    <strong>Name:</strong>
                                    <span>{selectedActivity.name}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Type:</strong>
                                    <span>
                                        {selectedActivity.type === 'NatureActivity' && '🌿 Nature Activity'}
                                        {selectedActivity.type === 'AdventureActivity' && '🏔️ Adventure Activity'}
                                        {selectedActivity.type === 'CulturalActivity' && '🏛️ Cultural Activity'}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Description:</strong>
                                    <span>{selectedActivity.description || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Price:</strong>
                                    <span>${selectedActivity.pricePerPerson}/person</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Rating:</strong>
                                    <span>{'⭐'.repeat(Math.round(selectedActivity.activityRating))} {selectedActivity.activityRating}</span>
                                </div>
                            </div>

                            {/* Activity Details */}
                            <div className={styles.detailSection}>
                                <h3>Activity Details</h3>
                                <div className={styles.detailRow}>
                                    <strong>Duration:</strong>
                                    <span>{selectedActivity.durationHours} hours</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Difficulty:</strong>
                                    <span>{selectedActivity.difficultyLevel}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Max Participants:</strong>
                                    <span>{selectedActivity.maxParticipants || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Minimum Age:</strong>
                                    <span>{selectedActivity.minAge || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Schedule:</strong>
                                    <span>{selectedActivity.schedule || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <strong>Languages:</strong>
                                    <span>{selectedActivity.activityLanguages || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Type-specific details */}
                            {selectedActivity.type === 'AdventureActivity' && (
                                <div className={styles.detailSection}>
                                    <h3>Adventure Details</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Risk Level:</strong>
                                        <span>{selectedActivity.riskLevel || 'N/A'}/10</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Required Equipment:</strong>
                                        <span>{selectedActivity.requiredEquipment || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Physical Fitness Required:</strong>
                                        <span>{selectedActivity.physicalFitnessRequired || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Safety Briefing Required:</strong>
                                        <span>{selectedActivity.safetyBriefingRequired ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            )}

                            {selectedActivity.type === 'CulturalActivity' && (
                                <div className={styles.detailSection}>
                                    <h3>Cultural Details</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Cultural Theme:</strong>
                                        <span>{selectedActivity.culturalTheme || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Historical Period:</strong>
                                        <span>{selectedActivity.historicalPeriod || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Audio Guide Available:</strong>
                                        <span>{selectedActivity.audioGuideAvailable ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Photography Allowed:</strong>
                                        <span>{selectedActivity.photographyAllowed ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            )}

                            {selectedActivity.type === 'NatureActivity' && (
                                <div className={styles.detailSection}>
                                    <h3>Nature Details</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Ecosystem Type:</strong>
                                        <span>{selectedActivity.ecosystemType || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Wildlife Spotting:</strong>
                                        <span>{selectedActivity.wildlifeSpotting || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Best Time to Visit:</strong>
                                        <span>{selectedActivity.bestTimeToVisit || 'N/A'}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <strong>Binoculars Provided:</strong>
                                        <span>{selectedActivity.binocularsProvided ? 'Yes' : 'No'}</span>
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
                        <p>Are you sure you want to delete "{selectedActivity?.name}"?</p>
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

                {/* Compare Activities Modal */}
                {showCompareModal && (
                    <Modal onClose={() => setShowCompareModal(false)}>
                        <h2>Compare Activities</h2>
                        <div className={styles.form}>
                            <div className={styles.formSection}>
                                <h3>Select Activities to Compare</h3>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>First Activity</label>
                                        <select
                                            value={compareActivity1?.id || ''}
                                            onChange={(e) => {
                                                const activity = activities.find(a => a.id === e.target.value);
                                                setCompareActivity1(activity || null);
                                            }}
                                            disabled={actionLoading}
                                        >
                                            <option value="">Select activity...</option>
                                            {activities.map(activity => (
                                                <option key={activity.id} value={activity.id}>
                                                    {activity.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Second Activity</label>
                                        <select
                                            value={compareActivity2?.id || ''}
                                            onChange={(e) => {
                                                const activity = activities.find(a => a.id === e.target.value);
                                                setCompareActivity2(activity || null);
                                            }}
                                            disabled={actionLoading}
                                        >
                                            <option value="">Select activity...</option>
                                            {activities.map(activity => (
                                                <option key={activity.id} value={activity.id}>
                                                    {activity.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {compareResult && (
                                <div className={styles.formSection}>
                                    <h3>Comparison Results</h3>
                                    <div className={styles.detailSection}>
                                        <h4>🏆 Winner: {compareResult.comparison?.winner?.name}</h4>
                                        <p>{compareResult.summary}</p>

                                        {compareResult.comparison?.differences && (
                                            <div>
                                                <h5>Detailed Comparison:</h5>
                                                {compareResult.comparison.differences.price && (
                                                    <div className={styles.detailRow}>
                                                        <strong>Price:</strong>
                                                        <span>
                                                            {compareResult.comparison.differences.price.cheaper} is cheaper by ${compareResult.comparison.differences.price.difference}
                                                        </span>
                                                    </div>
                                                )}
                                                {compareResult.comparison.differences.rating && (
                                                    <div className={styles.detailRow}>
                                                        <strong>Rating:</strong>
                                                        <span>
                                                            {compareResult.comparison.differences.rating.better_rated} has better rating
                                                        </span>
                                                    </div>
                                                )}
                                                {compareResult.comparison.differences.duration && (
                                                    <div className={styles.detailRow}>
                                                        <strong>Duration:</strong>
                                                        <span>
                                                            {compareResult.comparison.differences.duration.longer} is longer
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowCompareModal(false)} disabled={actionLoading}>
                                Cancel
                            </button>
                            <button
                                className={styles.primaryBtn}
                                onClick={handleCompare}
                                disabled={actionLoading || !compareActivity1 || !compareActivity2}
                            >
                                {actionLoading ? 'Comparing...' : 'Compare Activities'}
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