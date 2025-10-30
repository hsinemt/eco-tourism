import { useState } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './itineraries.module.css';
import { generateThreeDayItinerary } from '../api/itineraries';

export default function Itineraries() {
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form states
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [difficulty, setDifficulty] = useState('Moderate');
    const [budgetPerNight, setBudgetPerNight] = useState('');
    const [preferredSeason, setPreferredSeason] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    // Generate itinerary
    const handleGenerateItinerary = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Generating itinerary with params:', {
                startDate,
                difficulty,
                budgetPerNight: budgetPerNight ? parseFloat(budgetPerNight) : null,
                preferredSeason
            });

            const data = await generateThreeDayItinerary(
                startDate,
                difficulty,
                budgetPerNight ? parseFloat(budgetPerNight) : null,
                preferredSeason
            );

            console.log('Generated itinerary:', data);
            setItinerary(data);
        } catch (err) {
            let errorMsg = 'Failed to generate itinerary';

            if (err.response) {
                errorMsg = err.response.data?.detail || err.response.data?.message || 'Server error';
            } else if (err.request) {
                if (err.code === 'ERR_NETWORK' || err.message.includes('CORS')) {
                    errorMsg = 'Network Error: Backend server may not be running on http://localhost:8000';
                } else {
                    errorMsg = 'Network error: No response from server';
                }
            } else {
                errorMsg = err.message;
            }

            setError(errorMsg);
            console.error('Error generating itinerary:', err);
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
                        <h1>✈️ Itinerary Generator</h1>
                        <p>Create personalized eco-friendly travel plans</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button className={styles.dismissError} onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Generator Section */}
                <div className={styles.section}>
                    <h2>🎯 Create Your 3-Day Itinerary</h2>

                    <div className={styles.generatorForm}>
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
                                <label>Difficulty Level *</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <option value="Easy">🟢 Easy</option>
                                    <option value="Intermediate">🟡 Intermediate</option>
                                    <option value="Moderate">🟠 Moderate</option>
                                    <option value="Difficult">🔴 Difficult</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Budget per Night (€)</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 100"
                                    value={budgetPerNight}
                                    onChange={(e) => setBudgetPerNight(e.target.value)}
                                    min="0"
                                    step="10"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Preferred Season</label>
                                <select
                                    value={preferredSeason}
                                    onChange={(e) => setPreferredSeason(e.target.value)}
                                >
                                    <option value="">Any Season</option>
                                    <option value="Spring">🌸 Spring</option>
                                    <option value="Summer">☀️ Summer</option>
                                    <option value="Autumn">🍂 Autumn</option>
                                    <option value="Winter">❄️ Winter</option>
                                </select>
                            </div>
                        </div>

                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerateItinerary}
                            disabled={loading}
                        >
                            {loading ? '⏳ Generating...' : '✨ Generate Itinerary'}
                        </button>
                    </div>
                </div>

                {/* Generated Itinerary */}
                {itinerary && (
                    <div className={styles.section}>
                        <div className={styles.itineraryHeader}>
                            <div>
                                <h2>🗺️ Your 3-Day Itinerary</h2>
                                <p>Generated: {new Date(itinerary.generation_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Recommendations */}
                        {itinerary.recommendations && (
                            <div className={styles.recommendationsBox}>
                                <h3>🌍 Eco-Friendly Highlights</h3>
                                <div className={styles.recommendationItem}>
                                    <strong>Overall Eco Score:</strong>
                                    <span className={styles.ecoScore}>{itinerary.total_eco_score.toFixed(1)}/100</span>
                                </div>
                                <div className={styles.recommendationItem}>
                                    <strong>Total Budget:</strong>
                                    <span className={styles.budget}>€{itinerary.total_price.toFixed(2)}</span>
                                </div>
                                {itinerary.recommendations.certification_status && (
                                    <div className={styles.recommendationItem}>
                                        <strong>Certification:</strong>
                                        <span>{itinerary.recommendations.certification_status}</span>
                                    </div>
                                )}
                                {itinerary.recommendations.tips && (
                                    <div className={styles.tips}>
                                        <strong>💡 Tips:</strong>
                                        <ul>
                                            {itinerary.recommendations.tips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Days Grid */}
                        <div className={styles.daysGrid}>
                            {itinerary.days?.map((day) => (
                                <div key={day.day} className={styles.dayCard}>
                                    <div className={styles.dayHeader}>
                                        <h3>Day {day.day}</h3>
                                        <span className={styles.date}>{formatDate(day.date)}</span>
                                    </div>

                                    <p className={styles.description}>{day.description}</p>

                                    <div className={styles.dayStats}>
                                        <div className={styles.stat}>
                                            <span>Eco Score</span>
                                            <strong>{day.eco_score.toFixed(1)}</strong>
                                        </div>
                                        <div className={styles.stat}>
                                            <span>Total Price</span>
                                            <strong>€{day.total_price.toFixed(2)}</strong>
                                        </div>
                                        <div className={styles.stat}>
                                            <span>Activities</span>
                                            <strong>{day.activities?.length || 0}</strong>
                                        </div>
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

                {/* Day Details Modal */}
                {showModal && selectedDay && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={closeModal}>×</button>

                            <h2>Day {selectedDay.day} - {formatDate(selectedDay.date)}</h2>
                            <p className={styles.dayDescription}>{selectedDay.description}</p>

                            {/* Accommodation */}
                            <div className={styles.sectionBlock}>
                                <h3>🏨 Accommodation</h3>
                                {selectedDay.accommodation && (
                                    <div className={styles.accommodationBlock}>
                                        <div className={styles.accommodationHeader}>
                                            <h4>{selectedDay.accommodation.name}</h4>
                                            <span className={styles.rating}>
                        ⭐ {selectedDay.accommodation.rating}/5
                      </span>
                                        </div>
                                        <p>{selectedDay.accommodation.description}</p>
                                        <div className={styles.accommodationDetails}>
                                            <span>💰 €{selectedDay.accommodation.pricePerNight}/night</span>
                                            <span>🛏️ {selectedDay.accommodation.numberOfRooms} rooms</span>
                                            <span>👥 Max {selectedDay.accommodation.maxGuests} guests</span>
                                            {selectedDay.accommodation.ecoCertified && (
                                                <span>✅ Eco Certified</span>
                                            )}
                                            {selectedDay.accommodation.wifiAvailable && (
                                                <span>📶 WiFi</span>
                                            )}
                                            {selectedDay.accommodation.parkingAvailable && (
                                                <span>🚗 Parking</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Activities */}
                            <div className={styles.sectionBlock}>
                                <h3>🎯 Activities</h3>
                                <div className={styles.activitiesList}>
                                    {selectedDay.activities?.map((activity, idx) => (
                                        <div key={idx} className={styles.activityBlock}>
                                            <div className={styles.activityHeader}>
                                                <h4>{activity.name}</h4>
                                                <span className={styles.time}>{activity.time_slot}</span>
                                            </div>
                                            <p>{activity.description}</p>
                                            <div className={styles.activityDetails}>
                                                <span>💰 €{activity.pricePerPerson}/person</span>
                                                <span>⏱️ {activity.durationHours}h</span>
                                                <span>📊 Difficulty: {activity.difficultyLevel}</span>
                                                <span>⭐ {activity.rating}/5</span>
                                                <span>🎭 {activity.activityType}</span>
                                            </div>
                                            {activity.activityLanguages && (
                                                <p className={styles.languages}>
                                                    🗣️ Languages: {activity.activityLanguages}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Day Summary */}
                            <div className={styles.daySummary}>
                                <div className={styles.summaryItem}>
                                    <span>Eco Score:</span>
                                    <strong>{selectedDay.eco_score.toFixed(1)}</strong>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>Total Price:</span>
                                    <strong>€{selectedDay.total_price.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
