import { useState } from "react";
import Layout from "@/src/layout/Layout";
import { generateThreeDayItinerary } from "@/pages/api/itineraries";

const ItinerairesPage = () => {
    const [startDate, setStartDate] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("Moderate");
    const [budgetPerNight, setBudgetPerNight] = useState("");
    const [preferredSeason, setPreferredSeason] = useState("Summer");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const difficultyLevels = ["Easy", "Moderate", "Difficult", "Expert"];
    const seasons = ["Spring", "Summer", "Autumn", "Winter", "Any Season"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startDate.trim()) {
            setError("Please enter a start date");
            return;
        }
        setLoading(true);
        setError(null);
        setResults(null);
        try {
            const data = await generateThreeDayItinerary(
                startDate,
                difficultyLevel,
                budgetPerNight || null,
                preferredSeason
            );

            console.log('Itinerary raw data:', data);

            // Parse the response data
            let itineraryData = null;
            if (data && data.itinerary) {
                itineraryData = data.itinerary;
            } else if (data && Array.isArray(data)) {
                itineraryData = data;
            } else if (data && typeof data === 'object') {
                itineraryData = data;
            }

            console.log('Parsed itinerary data:', itineraryData);

            // Structure the results
            const normalized = {
                query: `Itinerary starting ${startDate}, Difficulty: ${difficultyLevel}, Budget: ${budgetPerNight || 'N/A'}/night, Season: ${preferredSeason}`,
                startDate: data.start_date || startDate,
                endDate: data.end_date || null,
                status: data.status || 'success',
                totalPrice: data.total_price || null,
                totalEcoScore: data.total_eco_score || null,
                days: data.days || [],
                recommendations: data.recommendations || [],
                generationDate: data.generation_date || new Date().toISOString(),
                rawData: data
            };

            console.log('Normalized results:', normalized);
            setResults(normalized);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "An error occurred while generating the itinerary");
            console.error("Itinerary error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setStartDate("");
        setDifficultyLevel("Moderate");
        setBudgetPerNight("");
        setPreferredSeason("Summer");
        setResults(null);
        setError(null);
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div className="hero-wrapper-two">
                    <div className="single-slider">
                        <div
                            className="image-layer bg_cover"
                            style={{ backgroundImage: "url(assets/images/hero/hero-two_img-1.jpg)" }}
                        />
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-9">
                                    <div className="hero-content text-white text-center">
                                        <span className="ribbon">Itinerary Planning System</span>
                                        <h1 data-animation="fadeInDown" data-delay=".4s">Plan Your Perfect Trip</h1>
                                        <p className="text-white" style={{ fontSize: "18px", marginTop: "20px" }}>
                                            Create personalized 3-day itineraries tailored to your preferences
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Hero Section ======*/}

            {/*====== Start Planning Section ======*/}
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
                                        Create Your Itinerary
                                    </span>
                                    <h2 style={{ fontSize: "42px", marginTop: "15px", color: "#1a1a1a", fontWeight: "700" }}>
                                        Plan Your Trip
                                    </h2>
                                    <p style={{ color: "#666", marginTop: "15px", fontSize: "17px", maxWidth: "600px", margin: "15px auto 0" }}>
                                        Fill in the details to generate your personalized itinerary
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        {/* Start Date */}
                                        <div className="col-lg-6">
                                            <div className="form_group" style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "12px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Start Date <span style={{ color: "#ff4444" }}>*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="form-control"
                                                    style={{
                                                        width: "100%",
                                                        padding: "15px 20px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/* Difficulty Level */}
                                        <div className="col-lg-6">
                                            <div className="form_group" style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "12px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Difficulty Level <span style={{ color: "#ff4444" }}>*</span>
                                                </label>
                                                <select
                                                    value={difficultyLevel}
                                                    onChange={(e) => setDifficultyLevel(e.target.value)}
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
                                                    {difficultyLevels.map((level) => (
                                                        <option key={level} value={level}>
                                                            {level}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Budget per Night */}
                                        <div className="col-lg-6">
                                            <div className="form_group" style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "12px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Budget per Night (€)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={budgetPerNight}
                                                    onChange={(e) => setBudgetPerNight(e.target.value)}
                                                    placeholder="e.g., 100"
                                                    className="form-control"
                                                    min="0"
                                                    style={{
                                                        width: "100%",
                                                        padding: "15px 20px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/* Preferred Season */}
                                        <div className="col-lg-6">
                                            <div className="form_group" style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "12px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Preferred Season
                                                </label>
                                                <select
                                                    value={preferredSeason}
                                                    onChange={(e) => setPreferredSeason(e.target.value)}
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
                                                    {seasons.map((season) => (
                                                        <option key={season} value={season}>
                                                            {season}
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
                                            disabled={loading || !startDate}
                                            style={{
                                                padding: "16px 45px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                borderRadius: "10px",
                                                border: "2px solid #28a745",
                                                backgroundColor: "#28a745",
                                                color: "#fff",
                                                cursor: loading || !startDate ? "not-allowed" : "pointer",
                                                transition: "all 0.3s ease",
                                                opacity: loading || !startDate ? 0.6 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading && startDate) {
                                                    e.target.style.backgroundColor = "#218838";
                                                    e.target.style.borderColor = "#218838";
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 5px 15px rgba(40,167,69,0.3)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "#28a745";
                                                e.target.style.borderColor = "#28a745";
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane" style={{ marginRight: "10px" }} />
                                                    Generate Itinerary
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Results Display */}
                                {results && (
                                    <div className="results-section" style={{ marginTop: "60px" }}>
                                        <div className="results-header text-center mb-40">
                                            <span className="badge" style={{
                                                backgroundColor: "#e7f5ff",
                                                color: "#00B4D8",
                                                padding: "8px 20px",
                                                borderRadius: "20px",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                display: "inline-block",
                                                marginBottom: "15px"
                                            }}>
                                                Results
                                            </span>
                                            <h3 style={{ fontSize: "28px", color: "#1a1a1a", fontWeight: "700", marginBottom: "15px" }}>
                                                <i className="fas fa-route" style={{ color: "#00B4D8", marginRight: "15px" }} />
                                                Your Itinerary
                                            </h3>
                                            <p style={{ fontSize: "16px", color: "#666" }}>{results.query}</p>
                                        </div>

                                        {/* Status and Summary Info */}
                                        {results.status && (
                                            <div style={{
                                                padding: "20px 30px",
                                                backgroundColor: results.status === 'success' ? "#d4edda" : "#f8d7da",
                                                border: `2px solid ${results.status === 'success' ? "#c3e6cb" : "#f5c6cb"}`,
                                                borderRadius: "10px",
                                                marginBottom: "30px",
                                                textAlign: "center"
                                            }}>
                                                <i className={`fas fa-${results.status === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ marginRight: "10px", fontSize: "18px" }} />
                                                <strong style={{
                                                    fontSize: "16px",
                                                    color: results.status === 'success' ? "#155724" : "#721c24",
                                                    textTransform: "capitalize"
                                                }}>
                                                    Status: {results.status}
                                                </strong>
                                            </div>
                                        )}

                                        {/* Key Information Cards */}
                                        <div className="row mb-40">
                                            {results.startDate && (
                                                <div className="col-md-3">
                                                    <div style={{
                                                        padding: "20px",
                                                        backgroundColor: "#e7f5ff",
                                                        borderRadius: "12px",
                                                        textAlign: "center",
                                                        border: "2px solid #00B4D8"
                                                    }}>
                                                        <i className="fas fa-calendar-day" style={{ fontSize: "24px", color: "#00B4D8", marginBottom: "10px", display: "block" }} />
                                                        <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>
                                                            Start Date
                                                        </strong>
                                                        <span style={{ fontSize: "16px", color: "#1a1a1a", fontWeight: "600" }}>
                                                            {new Date(results.startDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {results.endDate && (
                                                <div className="col-md-3">
                                                    <div style={{
                                                        padding: "20px",
                                                        backgroundColor: "#e7f5ff",
                                                        borderRadius: "12px",
                                                        textAlign: "center",
                                                        border: "2px solid #00B4D8"
                                                    }}>
                                                        <i className="fas fa-calendar-check" style={{ fontSize: "24px", color: "#00B4D8", marginBottom: "10px", display: "block" }} />
                                                        <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>
                                                            End Date
                                                        </strong>
                                                        <span style={{ fontSize: "16px", color: "#1a1a1a", fontWeight: "600" }}>
                                                            {new Date(results.endDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {results.totalPrice !== null && (
                                                <div className="col-md-3">
                                                    <div style={{
                                                        padding: "20px",
                                                        backgroundColor: "#fff9e6",
                                                        borderRadius: "12px",
                                                        textAlign: "center",
                                                        border: "2px solid #ffc107"
                                                    }}>
                                                        <i className="fas fa-euro-sign" style={{ fontSize: "24px", color: "#ffc107", marginBottom: "10px", display: "block" }} />
                                                        <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>
                                                            Total Price
                                                        </strong>
                                                        <span style={{ fontSize: "16px", color: "#1a1a1a", fontWeight: "600" }}>
                                                            €{results.totalPrice}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {results.totalEcoScore !== null && (
                                                <div className="col-md-3">
                                                    <div style={{
                                                        padding: "20px",
                                                        backgroundColor: "#e8f5e9",
                                                        borderRadius: "12px",
                                                        textAlign: "center",
                                                        border: "2px solid #4caf50"
                                                    }}>
                                                        <i className="fas fa-leaf" style={{ fontSize: "24px", color: "#4caf50", marginBottom: "10px", display: "block" }} />
                                                        <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "5px", textTransform: "uppercase" }}>
                                                            Eco Score
                                                        </strong>
                                                        <span style={{ fontSize: "16px", color: "#1a1a1a", fontWeight: "600" }}>
                                                            {results.totalEcoScore}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Days Itinerary */}
                                        {results.days && results.days.length > 0 ? (
                                            <div className="days-itinerary">
                                                {results.days.map((day, dayIndex) => (
                                                    <div key={dayIndex} style={{
                                                        marginBottom: "30px",
                                                        backgroundColor: "#fff",
                                                        borderRadius: "15px",
                                                        border: "2px solid #e7f5ff",
                                                        overflow: "hidden",
                                                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
                                                    }}>
                                                        {/* Day Header */}
                                                        <div style={{
                                                            padding: "25px 30px",
                                                            backgroundColor: "#00B4D8",
                                                            color: "#fff",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between"
                                                        }}>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <div style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    backgroundColor: "rgba(255,255,255,0.2)",
                                                                    borderRadius: "50%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    marginRight: "15px",
                                                                    fontWeight: "700",
                                                                    fontSize: "20px"
                                                                }}>
                                                                    {dayIndex + 1}
                                                                </div>
                                                                <h4 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
                                                                    Day {dayIndex + 1}
                                                                </h4>
                                                            </div>
                                                        </div>

                                                        {/* Day Content */}
                                                        <div style={{ padding: "30px" }}>
                                                            <div className="row">
                                                                {/* Display day information */}
                                                                {Object.entries(day).map(([key, value], index) => {
                                                                    // Skip empty or null values
                                                                    if (value === null || value === undefined || value === '' ||
                                                                        (Array.isArray(value) && value.length === 0) ||
                                                                        (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)) {
                                                                        return null;
                                                                    }

                                                                    // Format the key for display
                                                                    const formattedKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                                                                        .split(' ')
                                                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                                        .join(' ');

                                                                    // Determine icon based on key
                                                                    let icon = "fas fa-info-circle";
                                                                    let iconColor = "#00B4D8";
                                                                    if (key.toLowerCase().includes('status')) icon = "fas fa-check-circle";
                                                                    else if (key.toLowerCase().includes('date')) { icon = "fas fa-calendar"; iconColor = "#00B4D8"; }
                                                                    else if (key.toLowerCase().includes('price') || key.toLowerCase().includes('cost')) { icon = "fas fa-euro-sign"; iconColor = "#ffc107"; }
                                                                    else if (key.toLowerCase().includes('eco')) { icon = "fas fa-leaf"; iconColor = "#4caf50"; }
                                                                    else if (key.toLowerCase().includes('day')) { icon = "fas fa-map-marked-alt"; iconColor = "#00B4D8"; }
                                                                    else if (key.toLowerCase().includes('recommend')) { icon = "fas fa-star"; iconColor = "#ffc107"; }
                                                                    else if (key.toLowerCase().includes('accommodation') || key.toLowerCase().includes('hotel') || key.toLowerCase().includes('lodging')) {
                                                                        icon = "fas fa-hotel";
                                                                        iconColor = "#9c27b0";
                                                                    }
                                                                    else if (key.toLowerCase().includes('activity') || key.toLowerCase().includes('activities')) {
                                                                        icon = "fas fa-hiking";
                                                                        iconColor = "#ff5722";
                                                                    }
                                                                    else if (key.toLowerCase().includes('description')) {
                                                                        icon = "fas fa-align-left";
                                                                        iconColor = "#607d8b";
                                                                    }

                                                                    // Format the value for display
                                                                    let displayValue = value;
                                                                    let isComplexObject = false;

                                                                    // Check if it's an accommodation object
                                                                    if (typeof value === 'object' && !Array.isArray(value)) {
                                                                        isComplexObject = true;

                                                                        // Special handling for accommodation objects
                                                                        if (key.toLowerCase().includes('accommodation')) {
                                                                            const accommodation = value;
                                                                            displayValue = (
                                                                                <div style={{ marginTop: "5px" }}>
                                                                                    {accommodation.name && (
                                                                                        <div style={{ marginBottom: "10px" }}>
                                                                                            <strong style={{ color: "#1a1a1a", fontSize: "16px", display: "block", marginBottom: "5px" }}>
                                                                                                {accommodation.name}
                                                                                            </strong>
                                                                                        </div>
                                                                                    )}
                                                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                                                                                        {accommodation.description && (
                                                                                            <div style={{ gridColumn: "1 / -1", marginBottom: "5px", color: "#666", lineHeight: "1.5" }}>
                                                                                                <i className="fas fa-info-circle" style={{ marginRight: "6px", color: "#00B4D8", fontSize: "12px" }} />
                                                                                                {accommodation.description}
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.pricePerNight !== undefined && (
                                                                                            <div>
                                                                                                <i className="fas fa-euro-sign" style={{ marginRight: "6px", color: "#ffc107", fontSize: "11px" }} />
                                                                                                <strong>€{accommodation.pricePerNight}</strong>/night
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.rating !== undefined && (
                                                                                            <div>
                                                                                                <i className="fas fa-star" style={{ marginRight: "6px", color: "#ffc107", fontSize: "11px" }} />
                                                                                                <strong>{accommodation.rating}</strong>/5
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.numberOfRooms !== undefined && (
                                                                                            <div>
                                                                                                <i className="fas fa-bed" style={{ marginRight: "6px", color: "#607d8b", fontSize: "11px" }} />
                                                                                                {accommodation.numberOfRooms} rooms
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.maxGuests !== undefined && (
                                                                                            <div>
                                                                                                <i className="fas fa-users" style={{ marginRight: "6px", color: "#607d8b", fontSize: "11px" }} />
                                                                                                Up to {accommodation.maxGuests} guests
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.wifiAvailable !== undefined && accommodation.wifiAvailable && (
                                                                                            <div>
                                                                                                <i className="fas fa-wifi" style={{ marginRight: "6px", color: "#4caf50", fontSize: "11px" }} />
                                                                                                WiFi Available
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.parkingAvailable !== undefined && accommodation.parkingAvailable && (
                                                                                            <div>
                                                                                                <i className="fas fa-parking" style={{ marginRight: "6px", color: "#4caf50", fontSize: "11px" }} />
                                                                                                Parking Available
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.eco_score !== undefined && (
                                                                                            <div>
                                                                                                <i className="fas fa-leaf" style={{ marginRight: "6px", color: "#4caf50", fontSize: "11px" }} />
                                                                                                Eco Score: {accommodation.eco_score}
                                                                                            </div>
                                                                                        )}
                                                                                        {accommodation.ecoCertified !== undefined && accommodation.ecoCertified && (
                                                                                            <div>
                                                                                                <i className="fas fa-certificate" style={{ marginRight: "6px", color: "#4caf50", fontSize: "11px" }} />
                                                                                                Eco Certified
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    {accommodation.uri && (
                                                                                        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e0e0e0" }}>
                                                                                            <a
                                                                                                href={accommodation.uri}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                style={{
                                                                                                    color: "#00B4D8",
                                                                                                    fontSize: "13px",
                                                                                                    textDecoration: "none",
                                                                                                    display: "inline-flex",
                                                                                                    alignItems: "center"
                                                                                                }}
                                                                                            >
                                                                                                <i className="fas fa-external-link-alt" style={{ marginRight: "6px", fontSize: "11px" }} />
                                                                                                View Details
                                                                                            </a>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        } else {
                                                                            // For other complex objects, create a nice formatted display
                                                                            displayValue = (
                                                                                <div style={{ marginTop: "5px" }}>
                                                                                    {Object.entries(value).map(([objKey, objValue], objIndex) => {
                                                                                        if (objValue === null || objValue === undefined || objValue === '') return null;

                                                                                        const formattedObjKey = objKey.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                                                                                            .split(' ')
                                                                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                                                            .join(' ');

                                                                                        return (
                                                                                            <div key={objIndex} style={{
                                                                                                marginBottom: "8px",
                                                                                                paddingLeft: "10px",
                                                                                                borderLeft: "3px solid #00B4D8"
                                                                                            }}>
                                                                                                <span style={{ color: "#666", fontSize: "13px" }}>
                                                                                                    <strong>{formattedObjKey}:</strong>{' '}
                                                                                                    {typeof objValue === 'object' ? JSON.stringify(objValue) : String(objValue)}
                                                                                                </span>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            );
                                                                        }
                                                                    } else if (Array.isArray(value)) {
                                                                        displayValue = value.map((item, i) => {
                                                                            if (typeof item === 'object') {
                                                                                return (
                                                                                    <div key={i} style={{
                                                                                        marginBottom: "12px",
                                                                                        paddingBottom: "12px",
                                                                                        borderBottom: i < value.length - 1 ? "1px solid #e0e0e0" : "none"
                                                                                    }}>
                                                                                        {Object.entries(item).map(([itemKey, itemValue], itemIndex) => {
                                                                                            if (itemValue === null || itemValue === undefined || itemValue === '') return null;

                                                                                            const formattedItemKey = itemKey.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

                                                                                            return (
                                                                                                <div key={itemIndex} style={{ marginBottom: "5px", fontSize: "13px" }}>
                                                                                                    <strong style={{ color: "#666" }}>{formattedItemKey}:</strong>{' '}
                                                                                                    <span style={{ color: "#333" }}>
                                                                                                        {typeof itemValue === 'object' ? JSON.stringify(itemValue) : String(itemValue)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            return <div key={i} style={{ marginBottom: "5px", fontSize: "14px" }}>• {String(item)}</div>;
                                                                        });
                                                                    } else {
                                                                        displayValue = String(value);
                                                                    }

                                                                    return (
                                                                        <div key={index} className="col-md-6" style={{ marginBottom: "20px" }}>
                                                                            <div style={{
                                                                                padding: "20px",
                                                                                backgroundColor: "#f8f9fa",
                                                                                borderRadius: "10px",
                                                                                border: "1px solid #e0e0e0",
                                                                                height: "100%"
                                                                            }}>
                                                                                <div style={{ display: "flex", alignItems: "start" }}>
                                                                                    <i className={icon} style={{
                                                                                        color: iconColor,
                                                                                        fontSize: "18px",
                                                                                        marginRight: "12px",
                                                                                        marginTop: "3px"
                                                                                    }} />
                                                                                    <div style={{ flex: 1 }}>
                                                                                        <strong style={{
                                                                                            fontSize: "14px",
                                                                                            color: "#00B4D8",
                                                                                            display: "block",
                                                                                            marginBottom: "8px",
                                                                                            textTransform: "uppercase",
                                                                                            letterSpacing: "0.5px"
                                                                                        }}>
                                                                                            {formattedKey}
                                                                                        </strong>
                                                                                        <div style={{
                                                                                            fontSize: "15px",
                                                                                            color: "#333",
                                                                                            lineHeight: "1.6",
                                                                                            wordBreak: "break-word"
                                                                                        }}>
                                                                                            {isComplexObject ? displayValue : String(displayValue)}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div
                                                className="text-center mb-40"
                                                style={{
                                                    padding: "50px 30px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "10px",
                                                    border: "2px dashed #ddd"
                                                }}
                                            >
                                                <i className="fas fa-calendar-times" style={{ fontSize: "48px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                                                <p style={{ fontSize: "18px", color: "#666", marginBottom: "0", fontWeight: "500" }}>
                                                    No daily itinerary available.
                                                </p>
                                            </div>
                                        )}

                                        {/* Recommendations */}
                                        {results.recommendations && results.recommendations.length > 0 && (
                                            <div style={{
                                                padding: "30px",
                                                backgroundColor: "#fff9e6",
                                                border: "2px solid #ffe0a3",
                                                borderRadius: "15px",
                                                marginTop: "30px"
                                            }}>
                                                <h4 style={{
                                                    fontSize: "20px",
                                                    color: "#1a1a1a",
                                                    fontWeight: "700",
                                                    marginBottom: "20px"
                                                }}>
                                                    <i className="fas fa-lightbulb" style={{ color: "#ffc107", marginRight: "10px" }} />
                                                    Recommendations
                                                </h4>
                                                <ul style={{ marginBottom: "0", paddingLeft: "25px" }}>
                                                    {results.recommendations.map((rec, index) => (
                                                        <li key={index} style={{
                                                            fontSize: "15px",
                                                            color: "#666",
                                                            marginBottom: "10px",
                                                            lineHeight: "1.6"
                                                        }}>
                                                            {typeof rec === 'object' ? JSON.stringify(rec) : rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Debug Section */}
                                        {results.rawData && (
                                            <details style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                                <summary style={{ cursor: "pointer", fontWeight: "600", color: "#00B4D8", fontSize: "16px" }}>
                                                    <i className="fas fa-code" style={{ marginRight: "8px" }} />
                                                    Debug: View Raw Response Data
                                                </summary>
                                                <pre style={{
                                                    marginTop: "15px",
                                                    padding: "20px",
                                                    backgroundColor: "#fff",
                                                    borderRadius: "8px",
                                                    overflow: "auto",
                                                    fontSize: "12px",
                                                    maxHeight: "400px",
                                                    border: "1px solid #e0e0e0"
                                                }}>
                                                    {JSON.stringify(results.rawData, null, 2)}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Planning Section ======*/}

            {/*====== Start Features Section ======*/}
            <section className="features-section pt-100 pb-80" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="section-title text-center mb-60">
                                <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600" }}>Features</span>
                                <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a" }}>Why Use Our Itinerary System?</h2>
                                <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
                                    Plan smart routes, schedules, and optimized itineraries
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
                                    <i className="fas fa-map-marked-alt" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Route Planning</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Plan routes efficiently with geospatial awareness</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInDown" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-route" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Smart Scheduling</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Create schedules that fit your preferences</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInUp" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-calendar-check" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Optimized Itineraries</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Get optimized plans tailored to your trip</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Features Section ======*/}
        </Layout>
    );
};

export default ItinerairesPage;