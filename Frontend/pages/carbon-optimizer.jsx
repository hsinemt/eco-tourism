import { useState } from "react";
import Layout from "@/src/layout/Layout";
import { optimizeTrip } from "@/pages/api/carbon-optimizer";

const CarbonOptimizerPage = () => {
    const [touristId, setTouristId] = useState("");
    const [accommodationId, setAccommodationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [optimizationMode, setOptimizationMode] = useState("balanced");
    const [activities, setActivities] = useState([]);
    const [activityInput, setActivityInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const optimizationModes = [
        { value: "balanced", label: "⚖️ Balanced - Equilibrate time & CO2", icon: "fas fa-balance-scale" },
        { value: "eco", label: "🌱 Eco - Minimize carbon footprint", icon: "fas fa-leaf" },
        { value: "time", label: "⚡ Time - Minimize travel time", icon: "fas fa-clock" }
    ];

    const handleAddActivity = () => {
        if (activityInput.trim() && !activities.includes(activityInput.trim())) {
            setActivities([...activities, activityInput.trim()]);
            setActivityInput("");
        }
    };

    const handleRemoveActivity = (activityToRemove) => {
        setActivities(activities.filter(activity => activity !== activityToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddActivity();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!touristId.trim()) {
            setError("Please enter a Tourist ID");
            return;
        }
        if (!accommodationId.trim()) {
            setError("Please enter an Accommodation ID");
            return;
        }
        if (!startDate) {
            setError("Please select a start date");
            return;
        }
        if (!endDate) {
            setError("Please select an end date");
            return;
        }
        if (activities.length === 0) {
            setError("Please add at least one activity");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const payload = {
                tourist_id: touristId,
                accommodation_id: accommodationId,
                start_date: startDate,
                end_date: endDate,
                optimization_mode: optimizationMode,
                activity_ids: activities
            };

            console.log('Sending payload:', payload);
            const data = await optimizeTrip(payload);
            console.log('Received data:', data);

            setResults({
                ...data,
                query: `Optimizing trip for ${touristId} from ${startDate} to ${endDate}`
            });
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "An error occurred while optimizing your trip");
            console.error("Carbon optimizer error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setTouristId("");
        setAccommodationId("");
        setStartDate("");
        setEndDate("");
        setOptimizationMode("balanced");
        setActivities([]);
        setActivityInput("");
        setResults(null);
        setError(null);
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div style={{
                    background: "linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)",
                    padding: "80px 0",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-10">
                                <div style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "20px",
                                    padding: "40px",
                                    border: "1px solid rgba(255,255,255,0.2)"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                                        <div style={{
                                            width: "60px",
                                            height: "60px",
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            borderRadius: "15px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "20px"
                                        }}>
                                            <i className="fas fa-globe-americas" style={{ fontSize: "32px", color: "#fff" }} />
                                        </div>
                                        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", margin: 0 }}>
                                            Carbon Optimizer
                                        </h1>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                                        Optimize your trip with eco-friendly route planning
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Hero Section ======*/}

            {/*====== Start Optimization Form Section ======*/}
            <section style={{ paddingTop: "80px", paddingBottom: "100px", backgroundColor: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10">
                            <div style={{
                                backgroundColor: "#fff",
                                borderRadius: "20px",
                                boxShadow: "0 10px 50px rgba(0,0,0,0.08)",
                                padding: "50px",
                                border: "2px solid #e0e0e0"
                            }}>
                                {/* Section Title */}
                                <div style={{ marginBottom: "40px" }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                        <i className="fas fa-cog" style={{ fontSize: "28px", color: "#4a7c59", marginRight: "15px" }} />
                                        <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                            Optimize Your Carbon Footprint
                                        </h2>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        {/* Tourist ID */}
                                        <div className="col-lg-6">
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Tourist ID <span style={{ color: "#dc3545" }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={touristId}
                                                    onChange={(e) => setTouristId(e.target.value)}
                                                    placeholder="e.g., tourist_d60cf620"
                                                    style={{
                                                        width: "100%",
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/* Accommodation ID */}
                                        <div className="col-lg-6">
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Accommodation ID <span style={{ color: "#dc3545" }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={accommodationId}
                                                    onChange={(e) => setAccommodationId(e.target.value)}
                                                    placeholder="e.g., ECO-001"
                                                    style={{
                                                        width: "100%",
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/* Start Date */}
                                        <div className="col-lg-6">
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Start Date <span style={{ color: "#dc3545" }}>*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/* End Date */}
                                        <div className="col-lg-6">
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    End Date <span style={{ color: "#dc3545" }}>*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    min={startDate}
                                                    style={{
                                                        width: "100%",
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/* Optimization Mode */}
                                        <div className="col-lg-12">
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Optimization Mode <span style={{ color: "#dc3545" }}>*</span>
                                                </label>
                                                <select
                                                    value={optimizationMode}
                                                    onChange={(e) => setOptimizationMode(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease",
                                                        cursor: "pointer"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                >
                                                    {optimizationModes.map((mode) => (
                                                        <option key={mode.value} value={mode.value}>
                                                            {mode.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Activities */}
                                        <div className="col-lg-12">
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "10px",
                                                    fontSize: "15px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Activities <span style={{ color: "#dc3545" }}>*</span>
                                                </label>
                                                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                                                    <input
                                                        type="text"
                                                        value={activityInput}
                                                        onChange={(e) => setActivityInput(e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        placeholder="e.g., ADV-001"
                                                        style={{
                                                            flex: 1,
                                                            padding: "14px 18px",
                                                            fontSize: "15px",
                                                            borderRadius: "10px",
                                                            border: "2px solid #e0e0e0",
                                                            backgroundColor: "#fff",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = "#4a7c59"}
                                                        onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddActivity}
                                                        style={{
                                                            padding: "14px 30px",
                                                            fontSize: "15px",
                                                            fontWeight: "600",
                                                            borderRadius: "10px",
                                                            border: "none",
                                                            backgroundColor: "#10b981",
                                                            color: "#fff",
                                                            cursor: "pointer",
                                                            transition: "all 0.3s ease",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = "#059669";
                                                            e.target.style.transform = "translateY(-2px)";
                                                            e.target.style.boxShadow = "0 4px 12px rgba(16,185,129,0.3)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = "#10b981";
                                                            e.target.style.transform = "translateY(0)";
                                                            e.target.style.boxShadow = "none";
                                                        }}
                                                    >
                                                        <i className="fas fa-plus" style={{ marginRight: "8px" }} />
                                                        Add Activity
                                                    </button>
                                                </div>

                                                {/* Activity Tags */}
                                                {activities.length > 0 && (
                                                    <div style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                        padding: "15px",
                                                        backgroundColor: "#f8f9fa",
                                                        borderRadius: "10px",
                                                        border: "1px solid #e0e0e0"
                                                    }}>
                                                        {activities.map((activity, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    padding: "8px 16px",
                                                                    backgroundColor: "#2d5016",
                                                                    color: "#fff",
                                                                    borderRadius: "20px",
                                                                    fontSize: "14px",
                                                                    fontWeight: "600",
                                                                    gap: "8px"
                                                                }}
                                                            >
                                                                <span>{activity}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveActivity(activity)}
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        color: "#fff",
                                                                        cursor: "pointer",
                                                                        padding: "0",
                                                                        fontSize: "16px",
                                                                        lineHeight: "1",
                                                                        transition: "transform 0.2s ease"
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                                                                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {error && (
                                        <div style={{
                                            padding: "15px 20px",
                                            marginBottom: "30px",
                                            backgroundColor: "#fff3f3",
                                            border: "2px solid #ffcccc",
                                            borderRadius: "10px",
                                            color: "#cc0000",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            <i className="fas fa-exclamation-circle" style={{ marginRight: "12px", fontSize: "20px" }} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" }}>
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            style={{
                                                padding: "16px 40px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                borderRadius: "10px",
                                                border: "2px solid #6c757d",
                                                backgroundColor: "#6c757d",
                                                color: "#fff",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#5a6268";
                                                e.target.style.borderColor = "#5a6268";
                                                e.target.style.transform = "translateY(-2px)";
                                                e.target.style.boxShadow = "0 4px 12px rgba(108,117,125,0.3)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "#6c757d";
                                                e.target.style.borderColor = "#6c757d";
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        >
                                            <i className="fas fa-eraser" style={{ marginRight: "8px" }} />
                                            Clear
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                padding: "16px 50px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                borderRadius: "10px",
                                                border: "none",
                                                background: loading ? "#ccc" : "linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)",
                                                color: "#fff",
                                                cursor: loading ? "not-allowed" : "pointer",
                                                transition: "all 0.3s ease",
                                                boxShadow: loading ? "none" : "0 4px 15px rgba(45,80,22,0.3)"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 6px 20px rgba(45,80,22,0.4)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = loading ? "none" : "0 4px 15px rgba(45,80,22,0.3)";
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
                                                    Optimizing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-rocket" style={{ marginRight: "10px" }} />
                                                    Optimize Trip
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Results Display */}
                                {results && (
                                    <div style={{ marginTop: "60px" }}>
                                        {/* Results Header */}
                                        <div style={{
                                            padding: "30px",
                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            borderRadius: "15px 15px 0 0",
                                            color: "#fff"
                                        }}>
                                            <h3 style={{
                                                fontSize: "28px",
                                                fontWeight: "700",
                                                margin: 0,
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                <i className="fas fa-check-circle" style={{ marginRight: "15px", fontSize: "32px" }} />
                                                Optimization Results
                                            </h3>
                                            {results.query && (
                                                <p style={{
                                                    fontSize: "16px",
                                                    margin: "10px 0 0 0",
                                                    opacity: 0.95
                                                }}>
                                                    {results.query}
                                                </p>
                                            )}
                                        </div>

                                        <div style={{
                                            backgroundColor: "#fff",
                                            borderRadius: "0 0 15px 15px",
                                            border: "2px solid #e0e0e0",
                                            borderTop: "none"
                                        }}>
                                            {/* Trip Summary */}
                                            {results.trip_summary && (
                                                <div style={{ padding: "30px", borderBottom: "2px solid #f0f0f0" }}>
                                                    <h4 style={{
                                                        fontSize: "22px",
                                                        fontWeight: "700",
                                                        color: "#1a1a1a",
                                                        marginBottom: "25px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}>
                                                        <i className="fas fa-info-circle" style={{ color: "#4a7c59", marginRight: "12px" }} />
                                                        Trip Summary
                                                    </h4>

                                                    <div className="row">
                                                        <div className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#f0f9ff",
                                                                borderRadius: "12px",
                                                                border: "2px solid #bfe6ff"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                                    <i className="fas fa-user" style={{ color: "#00B4D8", fontSize: "20px", marginRight: "10px" }} />
                                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Tourist ID</span>
                                                                </div>
                                                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                                                                    {results.trip_summary.tourist_id}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#f0f9ff",
                                                                borderRadius: "12px",
                                                                border: "2px solid #bfe6ff"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                                    <i className="fas fa-hotel" style={{ color: "#9c27b0", fontSize: "20px", marginRight: "10px" }} />
                                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Accommodation</span>
                                                                </div>
                                                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                                                                    {results.trip_summary.accommodation_id}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#fff9e6",
                                                                borderRadius: "12px",
                                                                border: "2px solid #ffe0a3"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                                    <i className="fas fa-balance-scale" style={{ color: "#ffc107", fontSize: "20px", marginRight: "10px" }} />
                                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Mode</span>
                                                                </div>
                                                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: 0, textTransform: "capitalize" }}>
                                                                    {results.trip_summary.optimization_mode}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#e7f5ef",
                                                                borderRadius: "12px",
                                                                border: "2px solid #b3e0cc"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                                    <i className="fas fa-calendar-alt" style={{ color: "#4a7c59", fontSize: "20px", marginRight: "10px" }} />
                                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Dates</span>
                                                                </div>
                                                                <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                                                                    {results.trip_summary.start_date} → {results.trip_summary.end_date}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#fff3e0",
                                                                borderRadius: "12px",
                                                                border: "2px solid #ffcc80"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                                    <i className="fas fa-route" style={{ color: "#ff9800", fontSize: "20px", marginRight: "10px" }} />
                                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Total Segments</span>
                                                                </div>
                                                                <p style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                                    {results.trip_summary.total_segments}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                            <div style={{
                                                                padding: "20px",
                                                                backgroundColor: "#fce4ec",
                                                                borderRadius: "12px",
                                                                border: "2px solid #f8bbd0"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                                                    <i className="fas fa-road" style={{ color: "#e91e63", fontSize: "20px", marginRight: "10px" }} />
                                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Total Distance</span>
                                                                </div>
                                                                <p style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                                    {results.trip_summary.total_distance_km} km
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Daily Itinerary */}
                                            {results.daily_itinerary && results.daily_itinerary.length > 0 && (
                                                <div style={{ padding: "30px" }}>
                                                    <h4 style={{
                                                        fontSize: "22px",
                                                        fontWeight: "700",
                                                        color: "#1a1a1a",
                                                        marginBottom: "25px",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}>
                                                        <i className="fas fa-calendar-day" style={{ color: "#4a7c59", marginRight: "12px" }} />
                                                        Daily Itinerary
                                                    </h4>

                                                    {results.daily_itinerary.map((day, dayIndex) => (
                                                        <div key={dayIndex} style={{
                                                            marginBottom: "25px",
                                                            border: "2px solid #e0e0e0",
                                                            borderRadius: "15px",
                                                            overflow: "hidden"
                                                        }}>
                                                            {/* Day Header */}
                                                            <div style={{
                                                                padding: "20px 25px",
                                                                background: "linear-gradient(135deg, #4a7c59 0%, #2d5016 100%)",
                                                                color: "#fff",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between"
                                                            }}>
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    <div style={{
                                                                        width: "45px",
                                                                        height: "45px",
                                                                        backgroundColor: "rgba(255,255,255,0.2)",
                                                                        borderRadius: "12px",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        marginRight: "15px",
                                                                        fontWeight: "700",
                                                                        fontSize: "20px"
                                                                    }}>
                                                                        {day.day}
                                                                    </div>
                                                                    <div>
                                                                        <h5 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                                                                            Day {day.day}
                                                                        </h5>
                                                                        <p style={{ margin: "3px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
                                                                            {day.date}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Activities Timeline */}
                                                            {day.activities && day.activities.length > 0 && (
                                                                <div style={{ padding: "25px" }}>
                                                                    {day.activities.map((activity, actIndex) => (
                                                                        <div key={actIndex} style={{
                                                                            display: "flex",
                                                                            marginBottom: actIndex < day.activities.length - 1 ? "20px" : "0",
                                                                            position: "relative"
                                                                        }}>
                                                                            {/* Timeline Line */}
                                                                            {actIndex < day.activities.length - 1 && (
                                                                                <div style={{
                                                                                    position: "absolute",
                                                                                    left: "19px",
                                                                                    top: "40px",
                                                                                    bottom: "-20px",
                                                                                    width: "2px",
                                                                                    backgroundColor: "#e0e0e0"
                                                                                }} />
                                                                            )}

                                                                            {/* Time Badge */}
                                                                            <div style={{
                                                                                width: "80px",
                                                                                flexShrink: 0,
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                alignItems: "center",
                                                                                marginRight: "20px"
                                                                            }}>
                                                                                <div style={{
                                                                                    width: "40px",
                                                                                    height: "40px",
                                                                                    backgroundColor: activity.type === "transport" ? "#00B4D8" : "#10b981",
                                                                                    borderRadius: "50%",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center",
                                                                                    marginBottom: "8px",
                                                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                                                                                }}>
                                                                                    <i className={`fas fa-${activity.type === "transport" ? "car" : "hiking"}`} style={{
                                                                                        color: "#fff",
                                                                                        fontSize: "18px"
                                                                                    }} />
                                                                                </div>
                                                                                <span style={{
                                                                                    fontSize: "14px",
                                                                                    fontWeight: "700",
                                                                                    color: "#1a1a1a"
                                                                                }}>
                                                                                    {activity.time}
                                                                                </span>
                                                                            </div>

                                                                            {/* Activity Card */}
                                                                            <div style={{
                                                                                flex: 1,
                                                                                padding: "20px",
                                                                                backgroundColor: activity.type === "transport" ? "#f0f9ff" : "#e7f5ef",
                                                                                borderRadius: "12px",
                                                                                border: `2px solid ${activity.type === "transport" ? "#bfe6ff" : "#b3e0cc"}`
                                                                            }}>
                                                                                {/* Activity Type Badge */}
                                                                                <div style={{
                                                                                    display: "inline-flex",
                                                                                    alignItems: "center",
                                                                                    padding: "4px 12px",
                                                                                    backgroundColor: activity.type === "transport" ? "#00B4D8" : "#10b981",
                                                                                    color: "#fff",
                                                                                    borderRadius: "20px",
                                                                                    fontSize: "12px",
                                                                                    fontWeight: "700",
                                                                                    textTransform: "uppercase",
                                                                                    marginBottom: "12px"
                                                                                }}>
                                                                                    {activity.type}
                                                                                </div>

                                                                                {/* Description */}
                                                                                <p style={{
                                                                                    fontSize: "15px",
                                                                                    color: "#333",
                                                                                    margin: "0 0 15px 0",
                                                                                    lineHeight: "1.6",
                                                                                    fontWeight: "500"
                                                                                }}>
                                                                                    {activity.description}
                                                                                </p>

                                                                                {/* Activity Metrics */}
                                                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "15px" }}>
                                                                                    {activity.activity_id && (
                                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                                            <i className="fas fa-tag" style={{ color: "#666", fontSize: "14px", marginRight: "6px" }} />
                                                                                            <span style={{ fontSize: "13px", color: "#666" }}>
                                                                                                <strong>ID:</strong> {activity.activity_id}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    {activity.co2_kg !== undefined && (
                                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                                            <i className="fas fa-leaf" style={{ color: activity.co2_kg === 0 ? "#10b981" : "#f59e0b", fontSize: "14px", marginRight: "6px" }} />
                                                                                            <span style={{ fontSize: "13px", color: "#666" }}>
                                                                                                <strong>CO₂:</strong> {activity.co2_kg} kg
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                    {activity.distance_km !== undefined && (
                                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                                            <i className="fas fa-road" style={{ color: "#666", fontSize: "14px", marginRight: "6px" }} />
                                                                                            <span style={{ fontSize: "13px", color: "#666" }}>
                                                                                                <strong>Distance:</strong> {activity.distance_km} km
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Optimization Form Section ======*/}

            {/*====== Start Features Section ======*/}
            <section style={{ paddingTop: "80px", paddingBottom: "80px", backgroundColor: "#fff" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="section-title text-center mb-60">
                                <span style={{ fontSize: "16px", color: "#4a7c59", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Features
                                </span>
                                <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a", fontWeight: "700" }}>
                                    Why Use Carbon Optimizer?
                                </h2>
                                <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
                                    Reduce your environmental impact while planning the perfect trip
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-md-6">
                            <div style={{
                                padding: "40px 30px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "15px",
                                textAlign: "center",
                                height: "100%",
                                transition: "all 0.3s ease",
                                border: "2px solid transparent"
                            }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = "translateY(-10px)";
                                     e.currentTarget.style.boxShadow = "0 15px 35px rgba(74,124,89,0.2)";
                                     e.currentTarget.style.borderColor = "#4a7c59";
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = "translateY(0)";
                                     e.currentTarget.style.boxShadow = "none";
                                     e.currentTarget.style.borderColor = "transparent";
                                 }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto 25px",
                                    backgroundColor: "#e7f5ef",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <i className="fas fa-leaf" style={{ fontSize: "36px", color: "#4a7c59" }} />
                                </div>
                                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", marginBottom: "15px" }}>
                                    Eco-Friendly
                                </h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>
                                    Minimize your carbon footprint with optimized routes
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                            <div style={{
                                padding: "40px 30px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "15px",
                                textAlign: "center",
                                height: "100%",
                                transition: "all 0.3s ease",
                                border: "2px solid transparent"
                            }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = "translateY(-10px)";
                                     e.currentTarget.style.boxShadow = "0 15px 35px rgba(74,124,89,0.2)";
                                     e.currentTarget.style.borderColor = "#4a7c59";
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = "translateY(0)";
                                     e.currentTarget.style.boxShadow = "none";
                                     e.currentTarget.style.borderColor = "transparent";
                                 }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto 25px",
                                    backgroundColor: "#e7f5ef",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <i className="fas fa-route" style={{ fontSize: "36px", color: "#4a7c59" }} />
                                </div>
                                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", marginBottom: "15px" }}>
                                    Smart Routes
                                </h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>
                                    Get optimized routes that balance time and emissions
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                            <div style={{
                                padding: "40px 30px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "15px",
                                textAlign: "center",
                                height: "100%",
                                transition: "all 0.3s ease",
                                border: "2px solid transparent"
                            }}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = "translateY(-10px)";
                                     e.currentTarget.style.boxShadow = "0 15px 35px rgba(74,124,89,0.2)";
                                     e.currentTarget.style.borderColor = "#4a7c59";
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = "translateY(0)";
                                     e.currentTarget.style.boxShadow = "none";
                                     e.currentTarget.style.borderColor = "transparent";
                                 }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto 25px",
                                    backgroundColor: "#e7f5ef",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <i className="fas fa-chart-line" style={{ fontSize: "36px", color: "#4a7c59" }} />
                                </div>
                                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", marginBottom: "15px" }}>
                                    Track Impact
                                </h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>
                                    Monitor and reduce your environmental impact
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Features Section ======*/}
        </Layout>
    );
};

export default CarbonOptimizerPage;