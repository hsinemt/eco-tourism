import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './analytics.module.css';
import {
    getCarbonStatistics,
    getStatisticsByRegion,
    getTopEcoActivities,
    getActivityTypes,
    getAccommodationsStats,
    getDifficultyDistribution,
    getCompleteDashboard
} from '../api/analytics';

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [carbonStats, setCarbonStats] = useState(null);
    const [regionStats, setRegionStats] = useState([]);
    const [topEco, setTopEco] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [accommodationStats, setAccommodationStats] = useState([]);
    const [difficultyStats, setDifficultyStats] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAllAnalytics();
    }, []);

    // Helper function to extract SPARQL values
    const getValue = (field) => {
        if (!field) return null;
        if (typeof field === 'object' && 'value' in field) {
            return field.value;
        }
        return field;
    };

    // Parse SPARQL result array
    const parseSparqlResults = (results) => {
        if (!results || !Array.isArray(results)) return [];

        return results.map(item => {
            const parsed = {};
            for (const [key, valueObj] of Object.entries(item)) {
                parsed[key] = getValue(valueObj);
            }
            return parsed;
        });
    };

    const fetchAllAnalytics = async () => {
        setLoading(true);
        setError('');

        let hasErrors = false;

        // 1. Carbon Statistics
        try {
            const carbonResponse = await getCarbonStatistics();
            const carbonData = carbonResponse?.carbon_statistics;
            console.log('✅ Carbon stats:', carbonData);

            if (carbonData) {
                setCarbonStats(carbonData);
            }
        } catch (err) {
            console.error('❌ Carbon stats error:', err);
            hasErrors = true;
        }

        // 2. Statistics by Region - HANDLE OBJECT FORMAT
        try {
            const regionResponse = await getStatisticsByRegion();
            const regionData = regionResponse?.regions;
            console.log('✅ Region stats:', regionData);

            if (regionData && typeof regionData === 'object') {
                // Convert object to array format
                const regionArray = Object.entries(regionData).map(([region, count]) => ({
                    region: region,
                    activityCount: count,
                    count: count
                }));
                setRegionStats(regionArray);
            }
        } catch (err) {
            console.error('❌ Region stats error:', err);
            hasErrors = true;
        }

        // 3. Top Eco Activities
        try {
            const ecoResponse = await getTopEcoActivities(10);
            const ecoData = ecoResponse?.top_activities;
            console.log('✅ Top eco activities:', ecoData);
            if (Array.isArray(ecoData)) {
                setTopEco(ecoData);
            }
        } catch (err) {
            console.error('❌ Top eco error:', err);
            hasErrors = true;
        }

        // 4. Activity Types Distribution - HANDLE OBJECT FORMAT
        try {
            const typesResponse = await getActivityTypes();
            const typesData = typesResponse?.activity_types;
            console.log('✅ Activity types:', typesData);

            if (typesData && typeof typesData === 'object') {
                // Convert object to array format
                const typesArray = Object.entries(typesData).map(([type, count]) => ({
                    type: type,
                    activityType: type,
                    count: count,
                    total: count
                }));
                setActivityTypes(typesArray);
            }
        } catch (err) {
            console.error('❌ Activity types error:', err);
            hasErrors = true;
        }

        // 5. Accommodations Statistics - HANDLE OBJECT FORMAT
        try {
            const accResponse = await getAccommodationsStats();
            const accData = accResponse?.accommodations;
            console.log('✅ Accommodation stats:', accData);

            if (accData && typeof accData === 'object') {
                // Convert object to display format
                const accArray = [{
                    type: 'All Accommodations',
                    count: accData.total_accommodations || 0,
                    avgCapacity: accData.average_capacity || 0
                }];
                setAccommodationStats(accArray);
            }
        } catch (err) {
            console.error('❌ Accommodation stats error:', err);
            hasErrors = true;
        }

        // 6. Difficulty Distribution - HANDLE OBJECT FORMAT
        try {
            const diffResponse = await getDifficultyDistribution();
            const diffData = diffResponse?.by_difficulty;
            console.log('✅ Difficulty stats:', diffData);

            if (diffData && typeof diffData === 'object') {
                // Convert object to array format
                const diffArray = Object.entries(diffData).map(([difficulty, count]) => ({
                    difficulty: difficulty,
                    difficultyLevel: difficulty,
                    count: count
                }));
                setDifficultyStats(diffArray);
            }
        } catch (err) {
            console.error('❌ Difficulty stats error:', err);
            hasErrors = true;
        }

        // 7. Complete Dashboard
        try {
            const dashResponse = await getCompleteDashboard();
            console.log('✅ Complete dashboard:', dashResponse);
            setDashboardData(dashResponse);

            // Use dashboard data as fallback
            if (dashResponse?.dashboard) {
                const dash = dashResponse.dashboard;

                // Fallback for top eco if not already loaded
                if (dash.top_eco_activities && (!topEco || topEco.length === 0)) {
                    console.log('Using top eco from dashboard');
                    setTopEco(dash.top_eco_activities);
                }
            }
        } catch (err) {
            console.error('❌ Dashboard error:', err);
            hasErrors = true;
        }

        setLastUpdated(new Date().toLocaleString());

        if (hasErrors) {
            setError('Some analytics data failed to load. Check console for details.');
        }

        setLoading(false);
    };


    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAllAnalytics();
        setRefreshing(false);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>📊 Analytics & Reporting</h1>
                        <p>Comprehensive insights and statistics from all 7 endpoints</p>
                        {lastUpdated && (
                            <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
                        )}
                    </div>
                    <button
                        className={styles.refreshBtn}
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        {refreshing ? '⟳ Refreshing...' : '🔄 Refresh Data'}
                    </button>
                </div>

                {/* Error Message */}
                {error && <div className={styles.error}>{error}</div>}

                {/* Loading State */}
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading analytics from all endpoints...</p>
                    </div>
                ) : (
                    <>
                        {/* 1. Carbon Footprint Statistics */}
                        <div className={styles.section}>
                            <h2>🌱 Carbon Footprint Statistics</h2>
                            <div className={styles.statsGrid}>
                                {carbonStats && typeof carbonStats === 'object' && !Array.isArray(carbonStats) ? (
                                    <>
                                        {carbonStats.total_activities !== undefined && (
                                            <div className={styles.statCard}>
                                                <div className={styles.statIcon}>📊</div>
                                                <div className={styles.statContent}>
                                                    <h3>Total Activities</h3>
                                                    <div className={styles.statValue}>{carbonStats.total_activities}</div>
                                                    <div className={styles.statLabel}>Activities Tracked</div>
                                                </div>
                                            </div>
                                        )}
                                        {carbonStats.average !== undefined && (
                                            <div className={styles.statCard}>
                                                <div className={styles.statIcon}>📈</div>
                                                <div className={styles.statContent}>
                                                    <h3>Average Impact</h3>
                                                    <div className={styles.statValue}>{parseFloat(carbonStats.average).toFixed(2)} kg</div>
                                                    <div className={styles.statLabel}>CO₂ per Activity</div>
                                                </div>
                                            </div>
                                        )}
                                        {carbonStats.median !== undefined && (
                                            <div className={styles.statCard}>
                                                <div className={styles.statIcon}>📊</div>
                                                <div className={styles.statContent}>
                                                    <h3>Median Impact</h3>
                                                    <div className={styles.statValue}>{parseFloat(carbonStats.median).toFixed(2)} kg</div>
                                                    <div className={styles.statLabel}>CO₂ Median</div>
                                                </div>
                                            </div>
                                        )}
                                        {carbonStats.min !== undefined && (
                                            <div className={styles.statCard}>
                                                <div className={styles.statIcon}>🌿</div>
                                                <div className={styles.statContent}>
                                                    <h3>Minimum Impact</h3>
                                                    <div className={styles.statValue}>{parseFloat(carbonStats.min).toFixed(2)} kg</div>
                                                    <div className={styles.statLabel}>Lowest CO₂</div>
                                                </div>
                                            </div>
                                        )}
                                        {carbonStats.max !== undefined && (
                                            <div className={styles.statCard}>
                                                <div className={styles.statIcon}>⚠️</div>
                                                <div className={styles.statContent}>
                                                    <h3>Maximum Impact</h3>
                                                    <div className={styles.statValue}>{parseFloat(carbonStats.max).toFixed(2)} kg</div>
                                                    <div className={styles.statLabel}>Highest CO₂</div>
                                                </div>
                                            </div>
                                        )}
                                        {carbonStats.std_dev !== undefined && (
                                            <div className={styles.statCard}>
                                                <div className={styles.statIcon}>📉</div>
                                                <div className={styles.statContent}>
                                                    <h3>Std Deviation</h3>
                                                    <div className={styles.statValue}>{parseFloat(carbonStats.std_dev).toFixed(2)}</div>
                                                    <div className={styles.statLabel}>Variability</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className={styles.noData}>No carbon statistics available</p>
                                )}
                            </div>
                        </div>

                        {/* 2. Top Eco-Friendly Activities */}
                        {topEco && topEco.length > 0 && (
                            <div className={styles.section}>
                                <h2>🌿 Top Eco-Friendly Activities</h2>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Activity Name</th>
                                            <th>Carbon Footprint</th>
                                            <th>URI</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {topEco.map((activity, index) => (
                                            <tr key={index}>
                                                <td className={styles.rankCell}>
                                                    <span className={styles.rank}>#{index + 1}</span>
                                                </td>
                                                <td>{activity.name || activity.activityName || 'N/A'}</td>
                                                <td>
                                                    {activity.carbon || activity.carbonFootprint
                                                        ? `${parseFloat(activity.carbon || activity.carbonFootprint).toFixed(2)} kg CO₂`
                                                        : 'N/A'}
                                                </td>
                                                <td style={{ fontSize: '0.8rem' }}>
                                                    {activity.uri && (
                                                        <a href={activity.uri} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
                                                            View
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 3. Activity Types Distribution */}
                        {activityTypes && activityTypes.length > 0 && (
                            <div className={styles.section}>
                                <h2>📈 Activity Types Distribution</h2>
                                <div className={styles.chartContainer}>
                                    <div className={styles.barChart}>
                                        {activityTypes.map((type, index) => {
                                            const typeName = type.type || type.activityType || 'Unknown';
                                            const count = parseInt(type.count || type.total || 0);
                                            const maxCount = Math.max(...activityTypes.map(t => parseInt(t.count || t.total || 0)));
                                            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                                            return (
                                                <div key={index} className={styles.barItem}>
                                                    <div className={styles.barLabel}>{typeName}</div>
                                                    <div className={styles.barWrapper}>
                                                        <div
                                                            className={styles.barFill}
                                                            style={{ width: `${percentage}%` }}
                                                        >
                                                            <span className={styles.barValue}>{count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Statistics by Region */}
                        {regionStats && regionStats.length > 0 && (
                            <div className={styles.section}>
                                <h2>🗺️ Statistics by Region</h2>
                                <div className={styles.regionGrid}>
                                    {regionStats.map((region, index) => (
                                        <div key={index} className={styles.regionCard}>
                                            <h3>{region.region || region.regionName || 'Unknown Region'}</h3>
                                            <div className={styles.regionStats}>
                                                <div className={styles.regionStat}>
                                                    <span className={styles.regionStatLabel}>Activities:</span>
                                                    <span className={styles.regionStatValue}>
                            {region.activityCount || region.count || 0}
                          </span>
                                                </div>
                                                {region.avgRating && (
                                                    <div className={styles.regionStat}>
                                                        <span className={styles.regionStatLabel}>Avg Rating:</span>
                                                        <span className={styles.regionStatValue}>
                              ⭐ {parseFloat(region.avgRating).toFixed(1)}
                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. Difficulty Distribution */}
                        {difficultyStats && difficultyStats.length > 0 && (
                            <div className={styles.section}>
                                <h2>💪 Activities by Difficulty Level</h2>
                                <div className={styles.difficultyGrid}>
                                    {difficultyStats.map((diff, index) => {
                                        const level = diff.difficulty || diff.difficultyLevel || 'Unknown';
                                        const count = parseInt(diff.count || 0);

                                        const colorMap = {
                                            'Easy': '#10b981',
                                            'Moderate': '#f59e0b',
                                            'Difficult': '#ef4444',
                                            'Easy-Moderate': '#84cc16',
                                            'Facile': '#10b981',
                                            'Modérée': '#f59e0b',
                                            'Difficile': '#ef4444',
                                        };

                                        const color = colorMap[level] || '#6366f1';

                                        return (
                                            <div
                                                key={index}
                                                className={styles.difficultyCard}
                                                style={{ borderColor: color }}
                                            >
                                                <div className={styles.difficultyHeader}>
                                                    <h3 style={{ color }}>{level}</h3>
                                                </div>
                                                <div className={styles.difficultyCount}>{count}</div>
                                                <div className={styles.difficultyLabel}>Activities</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 6. Accommodation Statistics */}
                        {/* 6. Accommodation Statistics */}
                        {accommodationStats && accommodationStats.length > 0 && (
                            <div className={styles.section}>
                                <h2>🏨 Accommodation Statistics</h2>
                                <div className={styles.accommodationGrid}>
                                    {accommodationStats.map((acc, index) => (
                                        <div key={index} className={styles.accommodationCard}>
                                            <div className={styles.accommodationIcon}>🏠</div>
                                            <h3>{acc.type || 'Accommodations'}</h3>
                                            <div className={styles.accommodationStats}>
                                                <div className={styles.accommodationStat}>
                                                    <span>Total:</span>
                                                    <strong>{acc.count || acc.total_accommodations || 0}</strong>
                                                </div>
                                                {acc.avgCapacity && (
                                                    <div className={styles.accommodationStat}>
                                                        <span>Avg Capacity:</span>
                                                        <strong>{acc.avgCapacity} people</strong>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
