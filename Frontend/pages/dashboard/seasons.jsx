import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './seasons.module.css';
import {
    getAllSeasons,
    getPeakSeasons,
    getWarmestSeasons,
    createSeason,
    updateSeason,
    deleteSeason
} from '../api/seasons';

export default function Seasons() {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedSeason, setSelectedSeason] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        seasonName: '',
        startDate: '',
        endDate: '',
        averageTemperature: '',
        peakTourismSeason: false
    });

    useEffect(() => {
        fetchSeasons();
    }, [filter]);

    const fetchSeasons = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            console.log('Fetching seasons with filter:', filter);

            switch(filter) {
                case 'all':
                    data = await getAllSeasons();
                    break;
                case 'peak':
                    data = await getPeakSeasons();
                    break;
                case 'warmest':
                    data = await getWarmestSeasons();
                    break;
                default:
                    data = await getAllSeasons();
            }

            console.log('Raw API response:', data);

            // Handle different response structures
            let seasonsArray = [];

            if (Array.isArray(data)) {
                seasonsArray = data;
            } else if (data && Array.isArray(data.seasons)) {
                seasonsArray = data.seasons;
            } else if (data && Array.isArray(data.peakSeasons)) {
                seasonsArray = data.peakSeasons;
            } else if (data && Array.isArray(data.warmestSeasons)) {
                seasonsArray = data.warmestSeasons;
            } else if (data && typeof data === 'object') {
                seasonsArray = [data];
            }

            console.log('Processed seasons array:', seasonsArray);
            setSeasons(seasonsArray);

        } catch (error) {
            console.error('Error fetching seasons:', error);
            console.error('Error response:', error.response);

            const errorMsg = error.response?.data?.detail
                || error.response?.data?.message
                || error.message
                || 'Failed to load seasons. Please check if the backend is running.';

            setError(errorMsg);
            setSeasons([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredSeasons = Array.isArray(seasons)
        ? seasons.filter(season =>
            season.seasonName?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const handleAddSeason = () => {
        setModalMode('add');
        setFormData({
            seasonName: '',
            startDate: '',
            endDate: '',
            averageTemperature: '',
            peakTourismSeason: false
        });
        setShowModal(true);
    };

    // Open Edit Modal
    const handleEditSeason = (season) => {
        setModalMode('edit');
        setSelectedSeason(season);

        // Format dates for datetime-local input
        const formatDateForInput = (dateStr) => {
            if (!dateStr) return '';
            try {
                const date = new Date(dateStr);
                return date.toISOString().slice(0, 16);
            } catch (e) {
                return '';
            }
        };

        setFormData({
            seasonName: season.seasonName || '',
            startDate: formatDateForInput(season.startDate),
            endDate: formatDateForInput(season.endDate),
            averageTemperature: season.averageTemperature || '',
            peakTourismSeason: season.peakTourismSeason || false
        });
        setShowModal(true);
    };

    // Open View Modal
    const handleViewSeason = (season) => {
        setModalMode('view');
        setSelectedSeason(season);
        setShowModal(true);
    };

    // Open Delete Modal
    const handleDeleteSeason = (season) => {
        setModalMode('delete');
        setSelectedSeason(season);
        setShowModal(true);
    };

    // Submit form (Add or Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Format dates for backend (ISO format)
            const formatDateForBackend = (dateStr) => {
                if (!dateStr) return null;
                try {
                    const date = new Date(dateStr);
                    return date.toISOString();
                } catch (e) {
                    return dateStr;
                }
            };

            const seasonData = {
                seasonName: formData.seasonName,
                startDate: formatDateForBackend(formData.startDate),
                endDate: formatDateForBackend(formData.endDate),
                averageTemperature: parseFloat(formData.averageTemperature),
                peakTourismSeason: formData.peakTourismSeason
            };

            if (modalMode === 'add') {
                await createSeason(seasonData);
            } else if (modalMode === 'edit') {
                await updateSeason(selectedSeason.seasonName, seasonData);
            }

            await fetchSeasons();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to save season: ${err.response?.data?.detail || err.message}`);
            console.error('Error saving season:', err);
        }
    };

    // Confirm Delete
    const confirmDelete = async () => {
        setError(null);
        try {
            await deleteSeason(selectedSeason.seasonName);
            await fetchSeasons();
            setShowModal(false);
        } catch (err) {
            setError(`Failed to delete season: ${err.response?.data?.detail || err.message}`);
            console.error('Error deleting season:', err);
        }
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedSeason(null);
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>🌤️ Seasons</h1>
                        <p>Manage tourism seasons and climate data</p>
                    </div>
                    <button className={styles.primaryBtn} onClick={handleAddSeason}>
                        + Add New Season
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
                        placeholder="Search seasons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* Filters */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                            data-filter="all"
                        >
                            📊 All Seasons
                        </button>
                        <button
                            onClick={() => handleFilterChange('peak')}
                            className={`${styles.filterBtn} ${filter === 'peak' ? styles.active : ''}`}
                            data-filter="peak"
                        >
                            🔥 Peak Tourism
                        </button>
                        <button
                            onClick={() => handleFilterChange('warmest')}
                            className={`${styles.filterBtn} ${filter === 'warmest' ? styles.active : ''}`}
                            data-filter="warmest"
                        >
                            ☀️ Warmest
                        </button>
                    </div>
                </div>

                {/* Seasons Table */}
                <div className={styles.section}>
                    <h2>Seasons List ({filteredSeasons.length})</h2>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading seasons...</p>
                        </div>
                    ) : filteredSeasons.length === 0 ? (
                        <div className={styles.noData}>No seasons found</div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Season Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Avg. Temperature</th>
                                    <th>Peak Tourism</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredSeasons.map((season, index) => (
                                    <tr key={season.uri || index}>
                                        <td>
                                            <strong>{season.seasonName}</strong>
                                        </td>
                                        <td>{formatDate(season.startDate)}</td>
                                        <td>{formatDate(season.endDate)}</td>
                                        <td>
                        <span className={styles.tempBadge}>
                          {season.averageTemperature ? `${season.averageTemperature}°C` : 'N/A'}
                        </span>
                                        </td>
                                        <td>
                                            {season.peakTourismSeason ? (
                                                <span className={styles.peakBadge}>🔥 Peak</span>
                                            ) : (
                                                <span className={styles.normalBadge}>Regular</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.viewBtn}
                                                    onClick={() => handleViewSeason(season)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() => handleEditSeason(season)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteSeason(season)}
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
                            {modalMode === 'view' && selectedSeason && (
                                <div className={styles.viewDetails}>
                                    <h2>Season Details</h2>
                                    <div className={styles.detailSection}>
                                        <h3>Basic Information</h3>
                                        <div className={styles.detailRow}>
                                            <strong>Season Name:</strong>
                                            <span>{selectedSeason.seasonName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Start Date:</strong>
                                            <span>{formatDate(selectedSeason.startDate)}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>End Date:</strong>
                                            <span>{formatDate(selectedSeason.endDate)}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Average Temperature:</strong>
                                            <span>{selectedSeason.averageTemperature ? `${selectedSeason.averageTemperature}°C` : 'N/A'}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <strong>Peak Tourism:</strong>
                                            <span>{selectedSeason.peakTourismSeason ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add/Edit Mode */}
                            {(modalMode === 'add' || modalMode === 'edit') && (
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <h2>{modalMode === 'add' ? 'Add New Season' : 'Edit Season'}</h2>

                                    <div className={styles.formSection}>
                                        <h3>Season Information</h3>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Season Name *</label>
                                                <input
                                                    type="text"
                                                    name="seasonName"
                                                    value={formData.seasonName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Spring, Summer"
                                                    required
                                                    disabled={modalMode === 'edit'}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Start Date *</label>
                                                <input
                                                    type="datetime-local"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>End Date *</label>
                                                <input
                                                    type="datetime-local"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Average Temperature (°C) *</label>
                                                <input
                                                    type="number"
                                                    name="averageTemperature"
                                                    value={formData.averageTemperature}
                                                    onChange={handleInputChange}
                                                    step="0.1"
                                                    placeholder="e.g., 25.5"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.checkboxGroup}>
                                            <input
                                                type="checkbox"
                                                name="peakTourismSeason"
                                                id="peakTourismSeason"
                                                checked={formData.peakTourismSeason}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="peakTourismSeason">🔥 Peak Tourism Season</label>
                                        </div>
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                        <button type="submit">
                                            {modalMode === 'add' ? 'Add Season' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Delete Mode */}
                            {modalMode === 'delete' && selectedSeason && (
                                <div>
                                    <h2>Delete Season</h2>
                                    <p className={styles.warning}>
                                        Are you sure you want to delete "{selectedSeason.seasonName}"?
                                        This action cannot be undone.
                                    </p>
                                    <div className={styles.modalActions}>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                        <button className={styles.dangerBtn} onClick={confirmDelete}>
                                            Delete Season
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
