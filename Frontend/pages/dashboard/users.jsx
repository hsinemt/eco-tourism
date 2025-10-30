import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './users.module.css';
import {
    getAllTourists,
    getTouristById,
    createTourist,
    updateTourist,
    deleteTourist,
    getAllGuides,
    getGuideById,
    createGuide,
    updateGuide,
    deleteGuide
} from '../api/users';

export default function Users() {
    const [activeTab, setActiveTab] = useState('tourists'); // 'tourists' or 'guides'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Tourist form data
    const [touristFormData, setTouristFormData] = useState({
        name: '',
        email: '',
        nationality: '',
        preferences: ''
    });

    // Guide form data
    const [guideFormData, setGuideFormData] = useState({
        name: '',
        language: '',
        certification: '',
        experienceYears: ''
    });

    // Fetch users based on active tab
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            if (activeTab === 'tourists') {
                const data = await getAllTourists();
                setUsers(data);
            } else {
                const data = await getAllGuides();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    // Handle form input changes
    const handleTouristChange = (e) => {
        const { name, value } = e.target;
        setTouristFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGuideChange = (e) => {
        const { name, value } = e.target;
        setGuideFormData(prev => ({ ...prev, [name]: value }));
    };

    // Create new user
    const handleCreate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            if (activeTab === 'tourists') {
                await createTourist(touristFormData);
            } else {
                await createGuide(guideFormData);
            }
            setShowCreateModal(false);
            await fetchUsers();
            resetForm();
            alert(`${activeTab === 'tourists' ? 'Tourist' : 'Guide'} created successfully!`);
        } catch (error) {
            console.error('Error creating user:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error creating user. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Update user
    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            setError('');
            if (activeTab === 'tourists') {
                await updateTourist(selectedUser.id, touristFormData);
            } else {
                await updateGuide(selectedUser.id, guideFormData);
            }
            setShowEditModal(false);
            await fetchUsers();
            resetForm();
            alert(`${activeTab === 'tourists' ? 'Tourist' : 'Guide'} updated successfully!`);
        } catch (error) {
            console.error('Error updating user:', error);
            const backendError = error.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(`Validation errors: ${backendError.map(err => err.msg || err).join(', ')}`);
            } else if (typeof backendError === 'string') {
                setError(backendError);
            } else {
                setError('Error updating user. Please check the data and try again.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Delete user
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            setError('');
            if (activeTab === 'tourists') {
                await deleteTourist(selectedUser.id);
            } else {
                await deleteGuide(selectedUser.id);
            }
            setShowDeleteModal(false);
            await fetchUsers();
            alert(`${activeTab === 'tourists' ? 'Tourist' : 'Guide'} deleted successfully!`);
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error deleting user. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    // View single user
    const handleView = async (id) => {
        try {
            setError('');
            let data;
            if (activeTab === 'tourists') {
                data = await getTouristById(id);
            } else {
                data = await getGuideById(id);
            }
            setSelectedUser(data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Error fetching user details.');
        }
    };

    // Open edit modal
    const openEditModal = (user) => {
        setSelectedUser(user);
        if (activeTab === 'tourists') {
            setTouristFormData({
                name: user.name || '',
                email: user.email || '',
                nationality: user.nationality || '',
                preferences: user.preferences || ''
            });
        } else {
            setGuideFormData({
                name: user.name || '',
                language: user.language || '',
                certification: user.certification || '',
                experienceYears: user.experienceYears?.toString() || ''
            });
        }
        setShowEditModal(true);
    };

    // Open delete confirmation
    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Reset form
    const resetForm = () => {
        setTouristFormData({
            name: '',
            email: '',
            nationality: '',
            preferences: ''
        });
        setGuideFormData({
            name: '',
            language: '',
            certification: '',
            experienceYears: ''
        });
        setError('');
    };

    // Render tourist form
    const renderTouristForm = () => (
        <div className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={touristFormData.name}
                    onChange={handleTouristChange}
                    required
                    disabled={actionLoading}
                    placeholder="Enter full name"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={touristFormData.email}
                    onChange={handleTouristChange}
                    disabled={actionLoading}
                    placeholder="Enter email address"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="nationality">Nationality</label>
                <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={touristFormData.nationality}
                    onChange={handleTouristChange}
                    disabled={actionLoading}
                    placeholder="Enter nationality"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="preferences">Travel Preferences</label>
                <textarea
                    id="preferences"
                    name="preferences"
                    value={touristFormData.preferences}
                    onChange={handleTouristChange}
                    disabled={actionLoading}
                    rows="4"
                    placeholder="Enter travel preferences (e.g., eco-tourism, cultural activities)"
                />
            </div>
        </div>
    );

    // Render guide form
    const renderGuideForm = () => (
        <div className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Guide Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={guideFormData.name}
                    onChange={handleGuideChange}
                    required
                    disabled={actionLoading}
                    placeholder="Enter guide name"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="language">Language *</label>
                <input
                    type="text"
                    id="language"
                    name="language"
                    value={guideFormData.language}
                    onChange={handleGuideChange}
                    required
                    disabled={actionLoading}
                    placeholder="Enter language (e.g., English, French)"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="certification">Certification</label>
                <input
                    type="text"
                    id="certification"
                    name="certification"
                    value={guideFormData.certification}
                    onChange={handleGuideChange}
                    disabled={actionLoading}
                    placeholder="Enter certification details"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="experienceYears">Years of Experience</label>
                <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    value={guideFormData.experienceYears}
                    onChange={handleGuideChange}
                    disabled={actionLoading}
                    min="0"
                    placeholder="Enter years of experience"
                />
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Users Management</h1>
                        <p>Manage tourists and tour guides</p>
                    </div>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            resetForm();
                            setShowCreateModal(true);
                        }}
                    >
                        + Add New {activeTab === 'tourists' ? 'Tourist' : 'Guide'}
                    </button>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'tourists' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('tourists')}
                    >
                        Tourists
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'guides' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('guides')}
                    >
                        Tour Guides
                    </button>
                </div>

                {/* Error Message */}
                {error && <div className={styles.error}>{error}</div>}

                {/* Loading State */}
                {loading ? (
                    <div className={styles.loading}>Loading {activeTab}...</div>
                ) : (
                    <>
                        {/* Table */}
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    {activeTab === 'tourists' ? (
                                        <>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Nationality</th>
                                            <th>Preferences</th>
                                            <th>Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Name</th>
                                            <th>Language</th>
                                            <th>Certification</th>
                                            <th>Experience (Years)</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'tourists' ? 5 : 5} className={styles.noData}>
                                            No {activeTab} found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id || user.uri}>
                                            {activeTab === 'tourists' ? (
                                                <>
                                                    <td>{user.name}</td>
                                                    <td>{user.email || 'N/A'}</td>
                                                    <td>{user.nationality || 'N/A'}</td>
                                                    <td>{user.preferences ? user.preferences.substring(0, 50) + '...' : 'N/A'}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{user.name}</td>
                                                    <td>{user.language}</td>
                                                    <td>{user.certification || 'N/A'}</td>
                                                    <td>{user.experienceYears || 0}</td>
                                                </>
                                            )}
                                            <td className={styles.actions}>
                                                <button
                                                    className={styles.viewBtn}
                                                    onClick={() => handleView(user.id)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => openDeleteModal(user)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        <p className={styles.tableFooter}>
                            {users.length} {activeTab} available
                        </p>
                    </>
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
                            <h2>Create New {activeTab === 'tourists' ? 'Tourist' : 'Guide'}</h2>

                            {error && <div className={styles.error}>{error}</div>}

                            <form onSubmit={handleCreate}>
                                {activeTab === 'tourists' ? renderTouristForm() : renderGuideForm()}

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
                                        {actionLoading ? 'Creating...' : 'Create'}
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
                            <h2>Edit {activeTab === 'tourists' ? 'Tourist' : 'Guide'}</h2>

                            {error && <div className={styles.error}>{error}</div>}

                            <form onSubmit={handleUpdate}>
                                {activeTab === 'tourists' ? renderTouristForm() : renderGuideForm()}

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
                                        {actionLoading ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {showViewModal && selectedUser && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowViewModal(false)}
                            >
                                ×
                            </button>
                            <h2>{activeTab === 'tourists' ? 'Tourist' : 'Guide'} Details</h2>

                            <div className={styles.viewDetails}>
                                <div className={styles.detailSection}>
                                    <h3>Basic Information</h3>
                                    <div className={styles.detailRow}>
                                        <strong>Name:</strong>
                                        <span>{selectedUser.name}</span>
                                    </div>
                                    {activeTab === 'tourists' ? (
                                        <>
                                            <div className={styles.detailRow}>
                                                <strong>Email:</strong>
                                                <span>{selectedUser.email || 'N/A'}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <strong>Nationality:</strong>
                                                <span>{selectedUser.nationality || 'N/A'}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <strong>Preferences:</strong>
                                                <span>{selectedUser.preferences || 'N/A'}</span>
                                            </div>
                                            {selectedUser.registrationDate && (
                                                <div className={styles.detailRow}>
                                                    <strong>Registration Date:</strong>
                                                    <span>{new Date(selectedUser.registrationDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className={styles.detailRow}>
                                                <strong>Language:</strong>
                                                <span>{selectedUser.language}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <strong>Certification:</strong>
                                                <span>{selectedUser.certification || 'N/A'}</span>
                                            </div>
                                            <div className={styles.detailRow}>
                                                <strong>Experience:</strong>
                                                <span>{selectedUser.experienceYears || 0} years</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button onClick={() => setShowViewModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                            <h2>Confirm Deletion</h2>

                            <p className={styles.warning}>
                                Are you sure you want to delete "{selectedUser.name}"?
                                <br /><br />
                                This action cannot be undone.
                            </p>

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
                                    {actionLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
