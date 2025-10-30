import { useState, useEffect } from "react";
import Layout from "@/src/layout/Layout";
import { getAllActivities, compareActivities } from "@/pages/api/activity";

const ActivitiesComparePage = () => {
    const [firstActivity, setFirstActivity] = useState("");
    const [secondActivity, setSecondActivity] = useState("");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all activities on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoadingActivities(true);
                const fetchedActivities = await getAllActivities();
                setActivities(fetchedActivities);
                console.log('Fetched activities:', fetchedActivities);
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('Failed to load activities. Please try again later.');
            } finally {
                setLoadingActivities(false);
            }
        };

        fetchActivities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstActivity || !secondActivity) {
            setError("Please select both activities to compare");
            return;
        }

        if (firstActivity === secondActivity) {
            setError("Please select two different activities");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const data = await compareActivities(firstActivity, secondActivity);
            console.log('Raw comparison data:', data);
            console.log('Data type:', typeof data);
            console.log('Data keys:', data ? Object.keys(data) : 'null');

            // Find the selected activity names
            const firstActivityName = activities.find(act => act.id === firstActivity)?.name || firstActivity;
            const secondActivityName = activities.find(act => act.id === secondActivity)?.name || secondActivity;

            // Extract comparison data - handle various response formats
            let comparisonData = null;
            let parsedComparison = null;

            // Check if data.comparison exists
            if (data && data.comparison) {
                console.log('Found data.comparison:', data.comparison);
                console.log('Comparison type:', typeof data.comparison);

                // If comparison is a string, try to parse it
                if (typeof data.comparison === 'string') {
                    try {
                        parsedComparison = JSON.parse(data.comparison);
                        console.log('Parsed comparison:', parsedComparison);
                    } catch (e) {
                        console.error('Error parsing comparison string:', e);
                        parsedComparison = data.comparison;
                    }
                } else {
                    parsedComparison = data.comparison;
                }

                comparisonData = parsedComparison;
            } else if (data) {
                // If no comparison field, use the whole data object
                console.log('No comparison field, using entire data object');
                comparisonData = data;
            }

            console.log('Final comparison data:', comparisonData);

            // Extract activity details and differences from the comparison data
            let activity1Data = {};
            let activity2Data = {};
            let differences = {};

            if (comparisonData) {
                // Try to extract structured data
                if (comparisonData.activity1) {
                    activity1Data = comparisonData.activity1;
                }
                if (comparisonData.activity2) {
                    activity2Data = comparisonData.activity2;
                }
                if (comparisonData.differences) {
                    differences = comparisonData.differences;
                }

                // If no structured data, try to parse from string format
                if (Object.keys(activity1Data).length === 0 && typeof comparisonData === 'object') {
                    // Look for activity data in various formats
                    Object.keys(comparisonData).forEach(key => {
                        const value = comparisonData[key];
                        if (key.includes('activity1') || key.includes('Activity1')) {
                            activity1Data[key] = value;
                        }
                        if (key.includes('activity2') || key.includes('Activity2')) {
                            activity2Data[key] = value;
                        }
                    });
                }
            }

            console.log('Extracted activity1Data:', activity1Data);
            console.log('Extracted activity2Data:', activity2Data);
            console.log('Extracted differences:', differences);

            // Structure the results in a clean format
            const normalized = {
                query: `Comparing ${firstActivityName} vs ${secondActivityName}`,
                activity1: {
                    id: firstActivity,
                    name: firstActivityName,
                    data: activity1Data
                },
                activity2: {
                    id: secondActivity,
                    name: secondActivityName,
                    data: activity2Data
                },
                differences: differences,
                comparisonData: comparisonData,
                status: data.status || 'success',
                summary: data.summary || null,
                winner: data.winner || null,
                rawData: data // Keep raw data for debugging
            };

            console.log('Normalized results:', normalized);
            setResults(normalized);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "An error occurred while comparing activities");
            console.error("Activities compare error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFirstActivity("");
        setSecondActivity("");
        setResults(null);
        setError(null);
    };

    // Get available activities for second dropdown (exclude first selection)
    const getAvailableActivitiesForSecond = () => {
        if (!firstActivity) return activities;
        return activities.filter(act => act.id !== firstActivity);
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div className="hero-wrapper-two">
                    <div className="single-slider">
                        <div className="image-layer bg_cover" style={{ backgroundImage: "url(assets/images/hero/hero-two_img-1.jpg)" }} />
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-9">
                                    <div className="hero-content text-white text-center">
                                        <span className="ribbon">Activity Comparison Tool</span>
                                        <h1 data-animation="fadeInDown" data-delay=".4s">Compare Activities</h1>
                                        <p className="text-white" style={{ fontSize: "18px", marginTop: "20px" }}>
                                            Compare and analyze different activities to find the perfect experience
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Hero Section ======*/}

            {/*====== Start Comparison Section ======*/}
            <section className="booking-form-section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10">
                            <div className="booking-form-wrapper" style={{
                                backgroundColor: "#fff",
                                borderRadius: "20px",
                                boxShadow: "0 10px 50px rgba(0,0,0,0.1)",
                                padding: "60px 50px",
                                border: "2px solid #e7f5ff"
                            }}>
                                <div className="section-title text-center mb-50">
                                    <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px" }}>
                                        Compare Activities
                                    </span>
                                    <h2 style={{ fontSize: "42px", marginTop: "15px", color: "#1a1a1a", fontWeight: "700" }}>
                                        Select Activities to Compare
                                    </h2>
                                    <p style={{ color: "#666", marginTop: "15px", fontSize: "17px", maxWidth: "600px", margin: "15px auto 0" }}>
                                        Choose two activities to see their comparison
                                    </p>
                                </div>

                                {loadingActivities ? (
                                    <div className="text-center" style={{ padding: "40px" }}>
                                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem", color: "#00B4D8" }}>
                                            <span className="sr-only">Loading activities...</span>
                                        </div>
                                        <p style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}>Loading activities...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* First Activity Selection */}
                                            <div className="col-lg-6">
                                                <div className="form_group" style={{ marginBottom: "30px" }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "12px",
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color: "#1a1a1a"
                                                    }}>
                                                        First Activity <span style={{ color: "#ff4444" }}>*</span>
                                                    </label>
                                                    <select
                                                        value={firstActivity}
                                                        onChange={(e) => setFirstActivity(e.target.value)}
                                                        className="form-control"
                                                        style={{
                                                            width: "100%",
                                                            padding: "15px 20px",
                                                            fontSize: "15px",
                                                            borderRadius: "10px",
                                                            border: "2px solid #e0e0e0",
                                                            backgroundColor: "#fff",
                                                            transition: "all 0.3s ease",
                                                            cursor: "pointer"
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                    >
                                                        <option value="">Select activity...</option>
                                                        {activities.map((activity) => (
                                                            <option key={activity.id} value={activity.id}>
                                                                {activity.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Second Activity Selection */}
                                            <div className="col-lg-6">
                                                <div className="form_group" style={{ marginBottom: "30px" }}>
                                                    <label style={{
                                                        display: "block",
                                                        marginBottom: "12px",
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color: "#1a1a1a"
                                                    }}>
                                                        Second Activity <span style={{ color: "#ff4444" }}>*</span>
                                                    </label>
                                                    <select
                                                        value={secondActivity}
                                                        onChange={(e) => setSecondActivity(e.target.value)}
                                                        className="form-control"
                                                        style={{
                                                            width: "100%",
                                                            padding: "15px 20px",
                                                            fontSize: "15px",
                                                            borderRadius: "10px",
                                                            border: "2px solid #e0e0e0",
                                                            backgroundColor: "#fff",
                                                            transition: "all 0.3s ease",
                                                            cursor: "pointer"
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                        disabled={!firstActivity}
                                                    >
                                                        <option value="">Select activity...</option>
                                                        {getAvailableActivitiesForSecond().map((activity) => (
                                                            <option key={activity.id} value={activity.id}>
                                                                {activity.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="alert alert-danger" style={{
                                                padding: "15px 20px",
                                                marginBottom: "30px",
                                                backgroundColor: "#fff3f3",
                                                border: "2px solid #ffcccc",
                                                borderRadius: "10px",
                                                color: "#cc0000"
                                            }}>
                                                <i className="fas fa-exclamation-circle" style={{ marginRight: "10px" }} />
                                                {error}
                                            </div>
                                        )}

                                        <div className="form_group text-center" style={{ marginTop: "20px" }}>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                style={{
                                                    padding: "16px 45px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    borderRadius: "10px",
                                                    border: "2px solid #6c757d",
                                                    backgroundColor: "#6c757d",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                    marginRight: "15px"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = "#5a6268";
                                                    e.target.style.borderColor = "#5a6268";
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 5px 15px rgba(108,117,125,0.3)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = "#6c757d";
                                                    e.target.style.borderColor = "#6c757d";
                                                    e.target.style.transform = "translateY(0)";
                                                    e.target.style.boxShadow = "none";
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading || !firstActivity || !secondActivity}
                                                style={{
                                                    padding: "16px 45px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    borderRadius: "10px",
                                                    border: "2px solid #00B4D8",
                                                    backgroundColor: "#00B4D8",
                                                    color: "#fff",
                                                    cursor: loading || !firstActivity || !secondActivity ? "not-allowed" : "pointer",
                                                    transition: "all 0.3s ease",
                                                    opacity: loading || !firstActivity || !secondActivity ? 0.6 : 1
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!loading && firstActivity && secondActivity) {
                                                        e.target.style.backgroundColor = "#0098b8";
                                                        e.target.style.borderColor = "#0098b8";
                                                        e.target.style.transform = "translateY(-2px)";
                                                        e.target.style.boxShadow = "0 5px 15px rgba(0,180,216,0.3)";
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = "#00B4D8";
                                                    e.target.style.borderColor = "#00B4D8";
                                                    e.target.style.transform = "translateY(0)";
                                                    e.target.style.boxShadow = "none";
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
                                                        Comparing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-balance-scale" style={{ marginRight: "10px" }} />
                                                        Compare Activities
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Results Display */}
                                {results && (
                                    <div className="results-section" style={{ marginTop: "60px" }}>
                                        <div className="results-header text-center mb-40">
                                            <h3 style={{ fontSize: "28px", color: "#1a1a1a", fontWeight: "700", marginBottom: "15px" }}>
                                                <i className="fas fa-chart-line" style={{ color: "#00B4D8", marginRight: "15px" }} />
                                                Comparison Results
                                            </h3>
                                            <p style={{ fontSize: "16px", color: "#666" }}>{results.query}</p>
                                        </div>

                                        {/* Status Display */}
                                        {results.status && (
                                            <div style={{
                                                padding: "20px 30px",
                                                backgroundColor: results.status === 'success' ? "#d4edda" : "#f8d7da",
                                                border: `2px solid ${results.status === 'success' ? "#c3e6cb" : "#f5c6cb"}`,
                                                borderRadius: "10px",
                                                marginBottom: "30px",
                                                textAlign: "center"
                                            }}>
                                                <strong style={{
                                                    fontSize: "16px",
                                                    color: results.status === 'success' ? "#155724" : "#721c24",
                                                    textTransform: "capitalize"
                                                }}>
                                                    Status: {results.status}
                                                </strong>
                                            </div>
                                        )}

                                        {/* Check if we have comparison data to display */}
                                        {(() => {
                                            const hasActivity1Data = results.activity1?.data && Object.keys(results.activity1.data).length > 0;
                                            const hasActivity2Data = results.activity2?.data && Object.keys(results.activity2.data).length > 0;
                                            const hasComparisonData = results.comparisonData && typeof results.comparisonData === 'object';
                                            const hasDifferences = results.differences && Object.keys(results.differences).length > 0;

                                            console.log('Display check:', { hasActivity1Data, hasActivity2Data, hasComparisonData, hasDifferences });

                                            if (!hasActivity1Data && !hasActivity2Data && !hasComparisonData) {
                                                return (
                                                    <div>
                                                        <div
                                                            className="text-center mb-40"
                                                            style={{
                                                                padding: "50px 30px",
                                                                backgroundColor: "#f8f9fa",
                                                                borderRadius: "10px",
                                                                border: "2px dashed #ddd"
                                                            }}
                                                        >
                                                            <i className="fas fa-inbox" style={{ fontSize: "48px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                                                            <p style={{ fontSize: "18px", color: "#666", marginBottom: "10px", fontWeight: "500" }}>
                                                                No comparison data available.
                                                            </p>
                                                            <p style={{ fontSize: "14px", color: "#999", marginBottom: "0" }}>
                                                                The backend may not have returned comparison data. Please try again.
                                                            </p>
                                                        </div>

                                                        {/* Debug: Show raw data */}
                                                        <details style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                                            <summary style={{ cursor: "pointer", fontWeight: "600", color: "#00B4D8" }}>
                                                                Debug: View Raw Response Data
                                                            </summary>
                                                            <pre style={{
                                                                marginTop: "15px",
                                                                padding: "15px",
                                                                backgroundColor: "#fff",
                                                                borderRadius: "8px",
                                                                overflow: "auto",
                                                                fontSize: "12px",
                                                                maxHeight: "400px"
                                                            }}>
                                                                {JSON.stringify(results.rawData, null, 2)}
                                                            </pre>
                                                        </details>
                                                    </div>
                                                );
                                            }

                                            // Collect all unique attributes from both activities
                                            const allAttributes = new Set();
                                            if (hasActivity1Data) {
                                                Object.keys(results.activity1.data).forEach(key => allAttributes.add(key));
                                            }
                                            if (hasActivity2Data) {
                                                Object.keys(results.activity2.data).forEach(key => allAttributes.add(key));
                                            }

                                            // If we have comparisonData but no activity data, try to extract from it
                                            if (allAttributes.size === 0 && hasComparisonData) {
                                                Object.keys(results.comparisonData).forEach(key => {
                                                    if (!['status', 'summary', 'winner'].includes(key)) {
                                                        allAttributes.add(key);
                                                    }
                                                });
                                            }

                                            return (
                                                <div className="comparison-data">
                                                    {/* Activity Headers */}
                                                    <div className="row mb-4">
                                                        <div className="col-md-4">
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#f8f9fa",
                                                                borderRadius: "10px",
                                                                textAlign: "center",
                                                                border: "2px solid #e0e0e0"
                                                            }}>
                                                                <strong style={{ fontSize: "14px", color: "#666", display: "block" }}>
                                                                    Attribute
                                                                </strong>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#e7f5ff",
                                                                borderRadius: "10px",
                                                                textAlign: "center",
                                                                border: "2px solid #00B4D8"
                                                            }}>
                                                                <strong style={{ fontSize: "16px", color: "#00B4D8" }}>
                                                                    {results.activity1?.name || 'Activity 1'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#e7f5ff",
                                                                borderRadius: "10px",
                                                                textAlign: "center",
                                                                border: "2px solid #00B4D8"
                                                            }}>
                                                                <strong style={{ fontSize: "16px", color: "#00B4D8" }}>
                                                                    {results.activity2?.name || 'Activity 2'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Display comparison rows */}
                                                    {Array.from(allAttributes).map((attribute, index) => {
                                                        const value1 = hasActivity1Data ? results.activity1.data[attribute] :
                                                            (hasComparisonData && results.comparisonData[`activity1_${attribute}`]) ||
                                                            (hasComparisonData && results.comparisonData[attribute]);
                                                        const value2 = hasActivity2Data ? results.activity2.data[attribute] :
                                                            (hasComparisonData && results.comparisonData[`activity2_${attribute}`]);
                                                        const diff = hasDifferences ? results.differences[attribute] : null;

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="comparison-row"
                                                                style={{
                                                                    marginBottom: "15px",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                            >
                                                                <div className="row align-items-center">
                                                                    <div className="col-md-4">
                                                                        <div style={{
                                                                            padding: "15px 20px",
                                                                            backgroundColor: "#f8f9fa",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid #e0e0e0"
                                                                        }}>
                                                                            <strong style={{
                                                                                fontSize: "14px",
                                                                                color: "#00B4D8",
                                                                                textTransform: "capitalize",
                                                                                display: "block"
                                                                            }}>
                                                                                {attribute.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                                                                            </strong>
                                                                            {diff && (
                                                                                <div style={{
                                                                                    marginTop: "8px",
                                                                                    fontSize: "12px",
                                                                                    color: "#666",
                                                                                    fontStyle: "italic"
                                                                                }}>
                                                                                    Diff: {typeof diff === 'object' ? JSON.stringify(diff) : diff}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div style={{
                                                                            padding: "15px 20px",
                                                                            backgroundColor: "#fff",
                                                                            border: "2px solid #e7f5ff",
                                                                            borderRadius: "8px",
                                                                            minHeight: "50px",
                                                                            display: "flex",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            <span style={{
                                                                                fontSize: "14px",
                                                                                color: "#333",
                                                                                fontWeight: "500",
                                                                                wordBreak: "break-word"
                                                                            }}>
                                                                                {value1 !== null && value1 !== undefined && value1 !== ''
                                                                                    ? (typeof value1 === 'object' ? JSON.stringify(value1) : String(value1))
                                                                                    : '—'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div style={{
                                                                            padding: "15px 20px",
                                                                            backgroundColor: "#fff",
                                                                            border: "2px solid #e7f5ff",
                                                                            borderRadius: "8px",
                                                                            minHeight: "50px",
                                                                            display: "flex",
                                                                            alignItems: "center"
                                                                        }}>
                                                                            <span style={{
                                                                                fontSize: "14px",
                                                                                color: "#333",
                                                                                fontWeight: "500",
                                                                                wordBreak: "break-word"
                                                                            }}>
                                                                                {value2 !== null && value2 !== undefined && value2 !== ''
                                                                                    ? (typeof value2 === 'object' ? JSON.stringify(value2) : String(value2))
                                                                                    : '—'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}

                                        {/* Summary Display */}
                                        {results.summary && (
                                            <div style={{
                                                padding: "25px 30px",
                                                backgroundColor: "#fff9e6",
                                                border: "2px solid #ffe0a3",
                                                borderRadius: "10px",
                                                marginTop: "30px"
                                            }}>
                                                <h4 style={{
                                                    fontSize: "18px",
                                                    color: "#1a1a1a",
                                                    fontWeight: "700",
                                                    marginBottom: "15px"
                                                }}>
                                                    <i className="fas fa-file-alt" style={{ color: "#ffc107", marginRight: "10px" }} />
                                                    Summary
                                                </h4>
                                                <p style={{
                                                    fontSize: "15px",
                                                    color: "#666",
                                                    marginBottom: "0",
                                                    lineHeight: "1.6"
                                                }}>
                                                    {typeof results.summary === 'object' ? JSON.stringify(results.summary) : results.summary}
                                                </p>
                                            </div>
                                        )}

                                        {/* Winner Display */}
                                        {results.winner && (
                                            <div style={{
                                                padding: "25px 30px",
                                                backgroundColor: "#e7f5ff",
                                                border: "2px solid #00B4D8",
                                                borderRadius: "10px",
                                                marginTop: "20px",
                                                textAlign: "center"
                                            }}>
                                                <i className="fas fa-trophy" style={{ fontSize: "32px", color: "#ffc107", marginBottom: "10px", display: "block" }} />
                                                <strong style={{ fontSize: "18px", color: "#00B4D8", display: "block", marginBottom: "10px" }}>
                                                    Winner: {typeof results.winner === 'object' ? (results.winner.name || JSON.stringify(results.winner)) : results.winner}
                                                </strong>
                                                {results.winner.reasoning && (
                                                    <p style={{
                                                        fontSize: "14px",
                                                        color: "#666",
                                                        marginTop: "10px",
                                                        marginBottom: "0"
                                                    }}>
                                                        {results.winner.reasoning}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Comparison Section ======*/}

            {/*====== Start Activities List Section ======*/}
            <section className="activities-list-section" style={{ paddingTop: "100px", paddingBottom: "100px", backgroundColor: "#fff" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="section-title text-center mb-60">
                                <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px" }}>
                                    Available Activities
                                </span>
                                <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a", fontWeight: "700" }}>
                                    All Activities
                                </h2>
                                <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
                                    Browse through all available activities and their details
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingActivities ? (
                        <div className="text-center" style={{ padding: "60px" }}>
                            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem", color: "#00B4D8" }}>
                                <span className="sr-only">Loading activities...</span>
                            </div>
                            <p style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}>Loading activities...</p>
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="row">
                            {activities.map((activity, index) => (
                                <div key={activity.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-12" style={{ marginBottom: "30px" }}>
                                    <div
                                        className="activity-card"
                                        style={{
                                            backgroundColor: "#fff",
                                            borderRadius: "15px",
                                            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                            overflow: "hidden",
                                            transition: "all 0.4s ease",
                                            height: "100%",
                                            border: "2px solid transparent",
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-10px)";
                                            e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)";
                                            e.currentTarget.style.borderColor = "#00B4D8";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)";
                                            e.currentTarget.style.borderColor = "transparent";
                                        }}
                                    >
                                        {/* Activity Header */}
                                        <div style={{
                                            padding: "25px",
                                            backgroundColor: "#f8f9fa",
                                            borderBottom: "2px solid #e7f5ff"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                                                <span style={{
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    color: "#fff",
                                                    backgroundColor: "#00B4D8",
                                                    padding: "5px 12px",
                                                    borderRadius: "20px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "1px"
                                                }}>
                                                    {activity.type ? activity.type.replace('Activity', '') : 'Activity'}
                                                </span>
                                                {activity.activityRating > 0 && (
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <i className="fas fa-star" style={{ color: "#ffc107", fontSize: "14px", marginRight: "5px" }} />
                                                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                                                            {activity.activityRating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 style={{
                                                fontSize: "20px",
                                                fontWeight: "700",
                                                color: "#1a1a1a",
                                                margin: "15px 0 0 0",
                                                lineHeight: "1.3"
                                            }}>
                                                {activity.name}
                                            </h3>
                                        </div>

                                        {/* Activity Body */}
                                        <div style={{ padding: "25px", flex: "1", display: "flex", flexDirection: "column" }}>
                                            {activity.description && (
                                                <p style={{
                                                    fontSize: "14px",
                                                    color: "#666",
                                                    lineHeight: "1.6",
                                                    marginBottom: "20px"
                                                }}>
                                                    {activity.description.length > 100
                                                        ? `${activity.description.substring(0, 100)}...`
                                                        : activity.description}
                                                </p>
                                            )}

                                            {/* Activity Details Grid */}
                                            <div style={{ marginTop: "auto" }}>
                                                <div className="row" style={{ marginBottom: "15px" }}>
                                                    <div className="col-6">
                                                        <div style={{
                                                            padding: "12px",
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                            textAlign: "center"
                                                        }}>
                                                            <i className="fas fa-dollar-sign" style={{ color: "#00B4D8", fontSize: "16px", marginBottom: "5px", display: "block" }} />
                                                            <span style={{ fontSize: "13px", color: "#666", display: "block" }}>Price</span>
                                                            <strong style={{ fontSize: "16px", color: "#1a1a1a", display: "block", marginTop: "3px" }}>
                                                                ${activity.pricePerPerson}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div style={{
                                                            padding: "12px",
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                            textAlign: "center"
                                                        }}>
                                                            <i className="fas fa-clock" style={{ color: "#00B4D8", fontSize: "16px", marginBottom: "5px", display: "block" }} />
                                                            <span style={{ fontSize: "13px", color: "#666", display: "block" }}>Duration</span>
                                                            <strong style={{ fontSize: "16px", color: "#1a1a1a", display: "block", marginTop: "3px" }}>
                                                                {activity.durationHours}h
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row" style={{ marginBottom: "15px" }}>
                                                    <div className="col-6">
                                                        <div style={{
                                                            padding: "12px",
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                            textAlign: "center"
                                                        }}>
                                                            <i className="fas fa-signal" style={{ color: "#00B4D8", fontSize: "16px", marginBottom: "5px", display: "block" }} />
                                                            <span style={{ fontSize: "13px", color: "#666", display: "block" }}>Difficulty</span>
                                                            <strong style={{ fontSize: "14px", color: "#1a1a1a", display: "block", marginTop: "3px" }}>
                                                                {activity.difficultyLevel}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div style={{
                                                            padding: "12px",
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                            textAlign: "center"
                                                        }}>
                                                            <i className="fas fa-users" style={{ color: "#00B4D8", fontSize: "16px", marginBottom: "5px", display: "block" }} />
                                                            <span style={{ fontSize: "13px", color: "#666", display: "block" }}>Max Group</span>
                                                            <strong style={{ fontSize: "16px", color: "#1a1a1a", display: "block", marginTop: "3px" }}>
                                                                {activity.maxParticipants}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                {activity.minAge > 0 && (
                                                    <div style={{
                                                        padding: "10px 15px",
                                                        backgroundColor: "#fff3e0",
                                                        borderRadius: "8px",
                                                        border: "1px solid #ffe0b2",
                                                        textAlign: "center",
                                                        marginTop: "10px"
                                                    }}>
                                                        <i className="fas fa-child" style={{ color: "#ff9800", marginRight: "8px", fontSize: "14px" }} />
                                                        <span style={{ fontSize: "13px", color: "#666" }}>Min Age: </span>
                                                        <strong style={{ fontSize: "13px", color: "#1a1a1a" }}>{activity.minAge} years</strong>
                                                    </div>
                                                )}

                                                {/* Activity Type Specific Info */}
                                                {activity.type === 'AdventureActivity' && activity.riskLevel && (
                                                    <div style={{
                                                        padding: "10px 15px",
                                                        backgroundColor: "#ffebee",
                                                        borderRadius: "8px",
                                                        border: "1px solid #ffcdd2",
                                                        textAlign: "center",
                                                        marginTop: "10px"
                                                    }}>
                                                        <i className="fas fa-exclamation-triangle" style={{ color: "#f44336", marginRight: "8px", fontSize: "14px" }} />
                                                        <span style={{ fontSize: "13px", color: "#666" }}>Risk Level: </span>
                                                        <strong style={{ fontSize: "13px", color: "#1a1a1a" }}>{activity.riskLevel}/5</strong>
                                                    </div>
                                                )}

                                                {activity.type === 'NatureActivity' && activity.ecosystemType && (
                                                    <div style={{
                                                        padding: "10px 15px",
                                                        backgroundColor: "#e8f5e9",
                                                        borderRadius: "8px",
                                                        border: "1px solid #c8e6c9",
                                                        textAlign: "center",
                                                        marginTop: "10px"
                                                    }}>
                                                        <i className="fas fa-leaf" style={{ color: "#4caf50", marginRight: "8px", fontSize: "14px" }} />
                                                        <span style={{ fontSize: "13px", color: "#1a1a1a" }}>{activity.ecosystemType}</span>
                                                    </div>
                                                )}

                                                {activity.type === 'CulturalActivity' && activity.culturalTheme && (
                                                    <div style={{
                                                        padding: "10px 15px",
                                                        backgroundColor: "#f3e5f5",
                                                        borderRadius: "8px",
                                                        border: "1px solid #e1bee7",
                                                        textAlign: "center",
                                                        marginTop: "10px"
                                                    }}>
                                                        <i className="fas fa-landmark" style={{ color: "#9c27b0", marginRight: "8px", fontSize: "14px" }} />
                                                        <span style={{ fontSize: "13px", color: "#1a1a1a" }}>{activity.culturalTheme}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity Footer */}
                                        <div style={{
                                            padding: "20px 25px",
                                            backgroundColor: "#f8f9fa",
                                            borderTop: "1px solid #e0e0e0"
                                        }}>
                                            <button
                                                onClick={() => {
                                                    if (!firstActivity) {
                                                        setFirstActivity(activity.id);
                                                    } else if (!secondActivity && firstActivity !== activity.id) {
                                                        setSecondActivity(activity.id);
                                                    }
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                style={{
                                                    width: "100%",
                                                    padding: "12px 20px",
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    borderRadius: "8px",
                                                    border: "2px solid #00B4D8",
                                                    backgroundColor: "transparent",
                                                    color: "#00B4D8",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = "#00B4D8";
                                                    e.target.style.color = "#fff";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = "transparent";
                                                    e.target.style.color = "#00B4D8";
                                                }}
                                            >
                                                <i className="fas fa-plus-circle" style={{ marginRight: "8px" }} />
                                                Add to Compare
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="text-center"
                            style={{
                                padding: "60px 30px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "15px",
                                border: "2px dashed #ddd"
                            }}
                        >
                            <i className="fas fa-inbox" style={{ fontSize: "64px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                            <h3 style={{ fontSize: "24px", color: "#666", marginBottom: "10px", fontWeight: "600" }}>
                                No Activities Available
                            </h3>
                            <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                There are currently no activities to display.
                            </p>
                        </div>
                    )}
                </div>
            </section>
            {/*====== End Activities List Section ======*/}

            {/*====== Start Features Section ======*/}
            <section className="features-section pt-100 pb-80" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="section-title text-center mb-60">
                                <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600" }}>Features</span>
                                <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a" }}>Why Use Our Comparison Tool?</h2>
                                <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
                                    Make data-driven decisions with smart comparisons and insights
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInUp" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-balance-scale" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Smart Comparison</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Compare key attributes side by side</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInDown" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-chart-bar" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Data Analysis</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Analyze metrics to choose the best experience</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInUp" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-tasks" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Activity Insights</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Get insights to find the right activity for you</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Features Section ======*/}
        </Layout>
    );
};

export default ActivitiesComparePage;