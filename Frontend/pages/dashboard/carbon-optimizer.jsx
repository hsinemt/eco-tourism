import { useState } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './carbon-optimizer.module.css';
import { optimizeTrip } from '../api/carbon-optimizer';

export default function CarbonOptimizer() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form states
    const [touristId, setTouristId] = useState('tourist_d60cf620');
    const [accommodationId, setAccommodationId] = useState('ECO-001');
    const [activityIds, setActivityIds] = useState(['ADV-001', 'ADV-002', 'ADV-003']);
    const [activityInput, setActivityInput] = useState('');
    const [startDate, setStartDate] = useState('2025-11-01');
    const [endDate, setEndDate] = useState('2025-11-03');
    const [optimizationMode, setOptimizationMode] = useState('balanced');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    // Add activity ID
    const handleAddActivity = () => {
        if (activityInput.trim() && !activityIds.includes(activityInput.trim())) {
            setActivityIds([...activityIds, activityInput.trim()]);
            setActivityInput('');
        }
    };

    // Remove activity ID
    const handleRemoveActivity = (id) => {
        setActivityIds(activityIds.filter(a => a !== id));
    };

    // Optimize trip
    const handleOptimizeTrip = async () => {
        setLoading(true);
        setError(null);
        try {
            const tripData = {
                tourist_id: touristId,
                accommodation_id: accommodationId,
                activity_ids: activityIds,
                start_date: startDate,
                end_date: endDate,
                optimization_mode: optimizationMode
            };

            console.log('Optimizing trip with data:', tripData);
            const data = await optimizeTrip(tripData);
            console.log('Optimization result:', data);
            setResult(data);
        } catch (err) {
            let errorMsg = 'Failed to optimize trip';

            if (err.response) {
                errorMsg = err.response.data?.detail || err.response.data?.message || 'Server error';
            } else if (err.request) {
                if (err.code === 'ERR_NETWORK') {
                    errorMsg = 'Network Error: Backend server may not be running on http://localhost:8000';
                } else {
                    errorMsg = 'Network error: No response from server';
                }
            } else {
                errorMsg = err.message;
            }

            setError(errorMsg);
            console.error('Error optimizing trip:', err);
        } finally {
            setLoading(false);
        }
    };

    // View day details
    const handleViewDay = (day) => {
        setSelectedDay(day);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDay(null);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>🌍 Carbon Optimizer</h1>
                        <p>Optimize your trip with eco-friendly route planning</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button className={styles.dismissError} onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Optimizer Section */}
                <div className={styles.section}>
                    <h2>⚙️ Optimize Your Carbon Footprint</h2>

                    <div className={styles.generatorForm}>
                        {/* Basic Info Row */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Tourist ID *</label>
                                <input
                                    type="text"
                                    value={touristId}
                                    onChange={(e) => setTouristId(e.target.value)}
                                    placeholder="e.g., tourist_d60cf620"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Accommodation ID *</label>
                                <input
                                    type="text"
                                    value={accommodationId}
                                    onChange={(e) => setAccommodationId(e.target.value)}
                                    placeholder="e.g., ECO-001"
                                />
                            </div>
                        </div>

                        {/* Date Range Row */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Start Date *</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>End Date *</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Optimization Mode Row */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Optimization Mode *</label>
                                <select
                                    value={optimizationMode}
                                    onChange={(e) => setOptimizationMode(e.target.value)}
                                >
                                    <option value="greenest">🟢 Greenest - Minimize CO2 emissions</option>
                                    <option value="shortest">⚡ Shortest - Minimize travel time</option>
                                    <option value="balanced">⚖️ Balanced - Equilibrate time & CO2</option>
                                </select>
                            </div>
                        </div>

                        {/* Activity IDs Section */}
                        <div className={styles.activitiesSection}>
                            <label>Activities *</label>
                            <div className={styles.activityInputGroup}>
                                <input
                                    type="text"
                                    value={activityInput}
                                    onChange={(e) => setActivityInput(e.target.value)}
                                    placeholder="e.g., ADV-001"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                                />
                                <button
                                    className={styles.addBtn}
                                    onClick={handleAddActivity}
                                >
                                    + Add Activity
                                </button>
                            </div>

                            {/* Activity Tags */}
                            <div className={styles.activityTags}>
                                {activityIds.map((id) => (
                                    <span key={id} className={styles.activityTag}>
                    {id}
                                        <button
                                            className={styles.removeTag}
                                            onClick={() => handleRemoveActivity(id)}
                                        >
                      ×
                    </button>
                  </span>
                                ))}
                            </div>
                        </div>

                        {/* Optimize Button */}
                        <button
                            className={styles.optimizeBtn}
                            onClick={handleOptimizeTrip}
                            disabled={loading || activityIds.length === 0}
                        >
                            {loading ? '⏳ Optimizing...' : '🚀 Optimize Trip'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className={styles.section}>
                        <div className={styles.resultsHeader}>
                            <div>
                                <h2>🎯 Optimization Results</h2>
                                <p>Mode: <strong>{result.trip_summary.optimization_mode.toUpperCase()}</strong></p>
                            </div>
                        </div>

                        {/* Carbon Footprint Summary */}
                        <div className={styles.carbonBox}>
                            <h3>🌍 Carbon Footprint Summary</h3>
                            <div className={styles.carbonGrid}>
                                <div className={styles.carbonItem}>
                                    <div className={styles.rating}>{result.carbon_footprint.rating}</div>
                                    <h4>{result.carbon_footprint.category}</h4>
                                    <p className={styles.co2}>
                                        {result.carbon_footprint.total_co2_kg} kg CO₂
                                    </p>
                                </div>

                                <div className={styles.carbonItem}>
                                    <span>🌳 Trees Needed</span>
                                    <strong>{result.carbon_footprint.equivalent_trees_needed}</strong>
                                </div>

                                <div className={styles.carbonItem}>
                                    <span>🚗 Equivalent Car km</span>
                                    <strong>{result.carbon_footprint.equivalent_km_car.toFixed(2)} km</strong>
                                </div>

                                <div className={styles.carbonItem}>
                                    <span>⭐ Eco Score</span>
                                    <strong>{result.eco_score}/100</strong>
                                </div>
                            </div>
                        </div>

                        {/* Trip Summary */}
                        <div className={styles.summaryBox}>
                            <h3>📋 Trip Summary</h3>
                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryItem}>
                                    <span>Total Distance</span>
                                    <strong>{result.trip_summary.total_distance_km} km</strong>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>Total Segments</span>
                                    <strong>{result.trip_summary.total_segments}</strong>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>Total Cost</span>
                                    <strong>€{result.total_cost.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Day by Day Itinerary */}
                        {result.daily_itinerary && (
                            <div className={styles.itinerarySection}>
                                <h3>📅 Day-by-Day Itinerary</h3>
                                <div className={styles.daysGrid}>
                                    {result.daily_itinerary.map((day) => (
                                        <div key={day.day} className={styles.dayCard}>
                                            <div className={styles.dayHeader}>
                                                <h4>Day {day.day}</h4>
                                                <span className={styles.dateSpan}>{day.date}</span>
                                            </div>

                                            <div className={styles.activitiesCount}>
                                                {day.activities.length} activities
                                            </div>

                                            <button
                                                className={styles.viewDetailsBtn}
                                                onClick={() => handleViewDay(day)}
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Transport Segments */}
                        {result.transport_segments && (
                            <div className={styles.transportBox}>
                                <h3>🚗 Transport Segments</h3>
                                <div className={styles.segmentsList}>
                                    {result.transport_segments.map((segment, idx) => (
                                        <div key={idx} className={styles.segmentCard}>
                                            <div className={styles.segmentHeader}>
                                                <h4>{segment.from_location} → {segment.to_location}</h4>
                                                <span className={styles.ecoScore}>🌟 {segment.eco_score}</span>
                                            </div>

                                            <p className={styles.transportType}>{segment.transport_name}</p>

                                            <div className={styles.segmentDetails}>
                                                <div>
                                                    <span>Distance</span>
                                                    <strong>{segment.distance_km} km</strong>
                                                </div>
                                                <div>
                                                    <span>Duration</span>
                                                    <strong>{segment.duration_minutes} min</strong>
                                                </div>
                                                <div>
                                                    <span>CO₂</span>
                                                    <strong>{segment.co2_emissions_kg} kg</strong>
                                                </div>
                                                <div>
                                                    <span>Cost</span>
                                                    <strong>€{segment.cost_euros}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Compensation Suggestions */}
                        {result.compensation_suggestions && result.compensation_suggestions.length > 0 && (
                            <div className={styles.compensationBox}>
                                <h3>🌱 Recommended Compensation Products</h3>
                                <div className={styles.productsGrid}>
                                    {result.compensation_suggestions.map((product, idx) => (
                                        <div key={idx} className={styles.productCard}>
                                            <h4>{product.product_name}</h4>
                                            <p className={styles.producer}>By: {product.producer}</p>
                                            <p className={styles.description}>{product.description}</p>
                                            <div className={styles.productFooter}>
                                                <span className={styles.price}>€{product.price}</span>
                                                <span className={styles.offset}>
                          Offsets {product.carbon_offset_kg} kg CO₂
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Day Details Modal */}
                {showModal && selectedDay && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={closeModal}>×</button>

                            <h2>Day {selectedDay.day} - {selectedDay.date}</h2>

                            {/* Day Activities */}
                            <div className={styles.activitiesBox}>
                                <h3>📍 Activities & Transport</h3>
                                <div className={styles.timelineList}>
                                    {selectedDay.activities.map((activity, idx) => (
                                        <div key={idx} className={styles.timelineItem}>
                                            <div className={styles.timelineTime}>{activity.time}</div>

                                            <div className={styles.timelineContent}>
                                                <div className={styles.timelineType}>
                                                    {activity.type === 'transport' ? '🚗' : '📍'} {activity.type}
                                                </div>
                                                <p>{activity.description}</p>

                                                {activity.type === 'transport' && activity.distance_km && (
                                                    <div className={styles.transportInfo}>
                                                        <span>📏 {activity.distance_km} km</span>
                                                        <span>💨 {activity.co2_kg} kg CO₂</span>
                                                    </div>
                                                )}

                                                {activity.activity_id && (
                                                    <p className={styles.activityId}>ID: {activity.activity_id}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
