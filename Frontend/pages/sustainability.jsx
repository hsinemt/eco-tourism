import { useState, useEffect } from "react";
import Layout from "@/src/layout/Layout";
import {
    getAllIndicators,
    getIndicatorById,
    createIndicator,
    updateIndicator,
    deleteIndicator,
    getCarbonLeaders,
    getRenewableLeaders,
    getWaterEfficient
} from "@/pages/api/sustainability";

const SustainabilityPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // all, byId, stats, create
    const [indicators, setIndicators] = useState([]);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form states
    const [searchId, setSearchId] = useState("");
    const [statsType, setStatsType] = useState("carbon"); // carbon, renewable, water
    const [formData, setFormData] = useState({
        indicatorName: "",
        indicatorType: "CarbonFootprint",
        indicatorValue: "",
        measurementUnit: "",
        targetValue: "",
        measurementDate: new Date().toISOString().split('T')[0]
    });

    // Edit mode
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        indicatorId: "",
        indicatorName: "",
        indicatorValue: "",
        measurementUnit: "",
        targetValue: "",
        measurementDate: ""
    });

    // Load all indicators on component mount
    useEffect(() => {
        if (activeTab === "all") {
            handleGetAllIndicators();
        }
    }, [activeTab]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleGetAllIndicators = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getAllIndicators();
            console.log('All indicators response:', data);

            // Handle the response structure: {status: 'success', count: 6, indicators: Array(6)}
            let indicatorsList = [];

            if (data && Array.isArray(data.indicators)) {
                indicatorsList = data.indicators;
            } else if (Array.isArray(data)) {
                indicatorsList = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                indicatorsList = data.data;
            }

            console.log('Processed indicators list:', indicatorsList);
            setIndicators(indicatorsList);
            setSuccess(`Loaded ${indicatorsList.length} sustainability indicator(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch indicators";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching indicators:", err);
            setIndicators([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGetIndicatorById = async () => {
        if (!searchId.trim()) {
            setError("Please enter an indicator ID");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getIndicatorById(searchId);
            setSelectedIndicator(data);
            setSuccess("Indicator found successfully");
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Indicator not found";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching indicator:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetStats = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            let data;
            console.log('Fetching stats for type:', statsType);

            if (statsType === "carbon") {
                data = await getCarbonLeaders();
            } else if (statsType === "renewable") {
                data = await getRenewableLeaders();
            } else if (statsType === "water") {
                data = await getWaterEfficient();
            }

            console.log('Raw stats response:', data);
            console.log('Stats type:', typeof data);
            console.log('Is array?', Array.isArray(data));

            setStatsData(data);

            // Count the items
            let itemCount = 0;
            if (Array.isArray(data)) {
                itemCount = data.length;
            } else if (data && Array.isArray(data.indicators)) {
                itemCount = data.indicators.length;
            } else if (data && data.data && Array.isArray(data.data)) {
                itemCount = data.data.length;
            }

            setSuccess(`Loaded ${itemCount} ${statsType} statistic(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to fetch statistics";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching stats:", err);
            console.error("Error response:", err.response);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateIndicator = async (e) => {
        e.preventDefault();
        if (!formData.activity_id.trim()) {
            setError("Activity ID is required");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const dataToSend = {
                activity_id: formData.activity_id.trim(),
                carbon_footprint: parseFloat(formData.carbon_footprint) || 0,
                renewable_energy_usage: parseFloat(formData.renewable_energy_usage) || 0,
                water_usage: parseFloat(formData.water_usage) || 0,
                waste_management_score: parseFloat(formData.waste_management_score) || 0,
                biodiversity_impact: parseFloat(formData.biodiversity_impact) || 0,
                community_benefit_score: parseFloat(formData.community_benefit_score) || 0
            };

            console.log('Sending indicator data:', dataToSend);
            const result = await createIndicator(dataToSend);
            console.log('Create indicator result:', result);

            setSuccess("Sustainability indicator created successfully!");

            // Reset form
            setFormData({
                activity_id: "",
                carbon_footprint: "",
                renewable_energy_usage: "",
                water_usage: "",
                waste_management_score: "",
                biodiversity_impact: "",
                community_benefit_score: ""
            });

            // Refresh indicators after a short delay
            setTimeout(() => {
                if (activeTab === "all") {
                    handleGetAllIndicators();
                }
            }, 500);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to create indicator";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error creating indicator:", err);
            console.error("Error response:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (indicator) => {
        setEditingId(indicator.indicatorId || indicator.id);
        setEditFormData({
            indicatorId: indicator.indicatorId || "",
            indicatorName: indicator.indicatorName || "",
            indicatorValue: indicator.indicatorValue || "",
            measurementUnit: indicator.measurementUnit || "",
            targetValue: indicator.targetValue || "",
            measurementDate: indicator.measurementDate ? indicator.measurementDate.split('T')[0] : ""
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({
            indicatorId: "",
            indicatorName: "",
            indicatorValue: "",
            measurementUnit: "",
            targetValue: "",
            measurementDate: ""
        });
    };

    const handleUpdateIndicator = async (indicatorId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const dataToSend = {
                activity_id: editFormData.activity_id.trim(),
                carbon_footprint: parseFloat(editFormData.carbon_footprint) || 0,
                renewable_energy_usage: parseFloat(editFormData.renewable_energy_usage) || 0,
                water_usage: parseFloat(editFormData.water_usage) || 0,
                waste_management_score: parseFloat(editFormData.waste_management_score) || 0,
                biodiversity_impact: parseFloat(editFormData.biodiversity_impact) || 0,
                community_benefit_score: parseFloat(editFormData.community_benefit_score) || 0
            };

            await updateIndicator(indicatorId, dataToSend);
            setSuccess("Indicator updated successfully!");
            setEditingId(null);
            // Refresh indicators
            handleGetAllIndicators();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to update indicator";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error updating indicator:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteIndicator = async (indicatorId) => {
        if (!confirm("Are you sure you want to delete this indicator?")) {
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteIndicator(indicatorId);
            setSuccess("Indicator deleted successfully!");
            // Refresh indicators
            handleGetAllIndicators();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to delete indicator";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error deleting indicator:", err);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return { bg: "#d4edda", border: "#c3e6cb", text: "#155724" };
        if (score >= 60) return { bg: "#d1ecf1", border: "#bee5eb", text: "#0c5460" };
        if (score >= 40) return { bg: "#fff3cd", border: "#ffeaa7", text: "#856404" };
        return { bg: "#f8d7da", border: "#f5c6cb", text: "#721c24" };
    };

    const renderMetricBadge = (label, value, unit = "", icon = "chart-line") => {
        const scoreColors = getScoreColor(value);
        return (
            <div style={{
                padding: "12px 15px",
                backgroundColor: scoreColors.bg,
                border: `1px solid ${scoreColors.border}`,
                borderRadius: "8px",
                marginBottom: "10px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>
                        <i className={`fas fa-${icon}`} style={{ marginRight: "6px" }} />
                        {label}
                    </span>
                    <span style={{ fontSize: "16px", color: scoreColors.text, fontWeight: "700" }}>
                        {value}{unit}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
                                            <i className="fas fa-leaf" style={{ fontSize: "32px", color: "#fff" }} />
                                        </div>
                                        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", margin: 0 }}>
                                            Sustainability Management
                                        </h1>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                                        Track and manage environmental sustainability indicators
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Hero Section ======*/}

            {/*====== Start Main Section ======*/}
            <section style={{ paddingTop: "80px", paddingBottom: "100px", backgroundColor: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-12">
                            {/* Notification Messages */}
                            {error && (
                                <div style={{
                                    padding: "15px 20px",
                                    marginBottom: "30px",
                                    backgroundColor: "#fff3f3",
                                    border: "2px solid #ffcccc",
                                    borderRadius: "10px",
                                    color: "#cc0000",
                                    display: "flex",
                                    alignItems: "center",
                                    animation: "slideDown 0.3s ease"
                                }}>
                                    <i className="fas fa-exclamation-circle" style={{ marginRight: "12px", fontSize: "20px" }} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div style={{
                                    padding: "15px 20px",
                                    marginBottom: "30px",
                                    backgroundColor: "#d4edda",
                                    border: "2px solid #c3e6cb",
                                    borderRadius: "10px",
                                    color: "#155724",
                                    display: "flex",
                                    alignItems: "center",
                                    animation: "slideDown 0.3s ease"
                                }}>
                                    <i className="fas fa-check-circle" style={{ marginRight: "12px", fontSize: "20px" }} />
                                    <span>{success}</span>
                                </div>
                            )}

                            {/* Tab Navigation */}
                            <div style={{
                                backgroundColor: "#fff",
                                borderRadius: "15px 15px 0 0",
                                boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    display: "flex",
                                    borderBottom: "2px solid #e0e0e0",
                                    flexWrap: "wrap"
                                }}>
                                    {[
                                        { id: "all", label: "All Indicators", icon: "list" },
                                        { id: "byId", label: "Search by ID", icon: "search" },
                                        { id: "stats", label: "Statistics", icon: "chart-bar" },
                                        { id: "create", label: "Create Indicator", icon: "plus-circle" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setError(null);
                                                setSuccess(null);
                                                setSelectedIndicator(null);
                                                setStatsData(null);
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: "150px",
                                                padding: "20px 25px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                border: "none",
                                                backgroundColor: activeTab === tab.id ? "#10b981" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#666",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                borderBottom: activeTab === tab.id ? "3px solid #059669" : "none"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = "#ecfdf5";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = "transparent";
                                                }
                                            }}
                                        >
                                            <i className={`fas fa-${tab.icon}`} style={{ marginRight: "8px" }} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div style={{ padding: "40px" }}>
                                    {/* All Indicators Tab */}
                                    {activeTab === "all" && (
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                                                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                    All Indicators ({indicators.length})
                                                </h3>
                                                <button
                                                    onClick={handleGetAllIndicators}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "12px 30px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#10b981",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#059669";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#10b981";
                                                    }}
                                                >
                                                    <i className="fas fa-sync-alt" style={{ marginRight: "8px" }} />
                                                    Refresh
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "60px 0" }}>
                                                    <div className="spinner-border" style={{ width: "50px", height: "50px", color: "#10b981" }} />
                                                    <p style={{ marginTop: "20px", color: "#666", fontSize: "16px" }}>Loading indicators...</p>
                                                </div>
                                            ) : indicators.length > 0 ? (
                                                <div className="row">
                                                    {indicators.map((indicator, index) => {
                                                        console.log(`Indicator ${index}:`, indicator);
                                                        const isEditing = editingId === indicator.indicatorId;

                                                        return (
                                                            <div key={index} className="col-lg-6 col-xl-4" style={{ marginBottom: "25px" }}>
                                                                <div style={{
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: "15px",
                                                                    padding: "25px",
                                                                    border: "2px solid #e0e0e0",
                                                                    height: "100%",
                                                                    transition: "all 0.3s ease",
                                                                    position: "relative"
                                                                }}
                                                                     onMouseEnter={(e) => {
                                                                         e.currentTarget.style.boxShadow = "0 8px 25px rgba(16,185,129,0.15)";
                                                                         e.currentTarget.style.borderColor = "#10b981";
                                                                         e.currentTarget.style.transform = "translateY(-5px)";
                                                                     }}
                                                                     onMouseLeave={(e) => {
                                                                         e.currentTarget.style.boxShadow = "none";
                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                         e.currentTarget.style.transform = "translateY(0)";
                                                                     }}>
                                                                    {/* Indicator Name Header */}
                                                                    <h4 style={{
                                                                        fontSize: "18px",
                                                                        fontWeight: "700",
                                                                        color: "#10b981",
                                                                        marginBottom: "20px",
                                                                        display: "flex",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        <i className="fas fa-seedling" style={{ marginRight: "8px" }} />
                                                                        {String(indicator.indicatorId || indicator.id || 'Unknown')}
                                                                    </h4>

                                                                    {/* Indicator Details */}
                                                                    <div style={{ marginBottom: "15px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Indicator ID:
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editFormData.indicatorId}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, indicatorId: e.target.value })}
                                                                                        disabled
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "6px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0",
                                                                                            backgroundColor: "#f5f5f5"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Indicator Name:
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editFormData.indicatorName}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, indicatorName: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "6px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Value:
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        step="0.01"
                                                                                        value={editFormData.indicatorValue}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, indicatorValue: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "6px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Unit:
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editFormData.measurementUnit}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, measurementUnit: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "6px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div style={{
                                                                                    padding: "15px",
                                                                                    backgroundColor: "#f0f9ff",
                                                                                    borderRadius: "10px",
                                                                                    marginBottom: "10px",
                                                                                    border: "1px solid #bae6fd"
                                                                                }}>
                                                                                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "5px", fontWeight: "600" }}>
                                                                                        <i className="fas fa-tag" style={{ marginRight: "8px" }} />
                                                                                        Indicator Name
                                                                                    </div>
                                                                                    <div style={{ fontSize: "15px", color: "#1a1a1a", fontWeight: "500" }}>
                                                                                        {String(indicator.indicatorName || 'N/A')}
                                                                                    </div>
                                                                                </div>

                                                                                <div style={{
                                                                                    padding: "15px",
                                                                                    backgroundColor: getScoreColor(indicator.indicatorValue || 0).bg,
                                                                                    borderRadius: "10px",
                                                                                    marginBottom: "10px",
                                                                                    border: `1px solid ${getScoreColor(indicator.indicatorValue || 0).border}`
                                                                                }}>
                                                                                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "5px", fontWeight: "600" }}>
                                                                                        <i className="fas fa-chart-line" style={{ marginRight: "8px" }} />
                                                                                        Value
                                                                                    </div>
                                                                                    <div style={{ fontSize: "24px", color: getScoreColor(indicator.indicatorValue || 0).text, fontWeight: "700" }}>
                                                                                        {parseFloat(indicator.indicatorValue) || 0} {indicator.measurementUnit || ''}
                                                                                    </div>
                                                                                </div>

                                                                                {indicator.targetValue && (
                                                                                    <div style={{
                                                                                        padding: "12px 15px",
                                                                                        backgroundColor: "#fff7ed",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "10px",
                                                                                        border: "1px solid #fed7aa"
                                                                                    }}>
                                                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                                            <span style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>
                                                                                                <i className="fas fa-bullseye" style={{ marginRight: "6px" }} />
                                                                                                Target
                                                                                            </span>
                                                                                            <span style={{ fontSize: "16px", color: "#ea580c", fontWeight: "700" }}>
                                                                                                {indicator.targetValue}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                {indicator.measurementDate && (
                                                                                    <div style={{
                                                                                        padding: "10px 15px",
                                                                                        backgroundColor: "#f8f9fa",
                                                                                        borderRadius: "8px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}>
                                                                                        <span style={{ fontSize: "12px", color: "#666" }}>
                                                                                            <i className="fas fa-calendar" style={{ marginRight: "6px" }} />
                                                                                            {new Date(indicator.measurementDate).toLocaleDateString()}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Action Buttons */}
                                                                    <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleUpdateIndicator(indicator.indicatorId)}
                                                                                    disabled={loading}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#10b981",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
                                                                                >
                                                                                    <i className="fas fa-save" style={{ marginRight: "6px" }} />
                                                                                    Save
                                                                                </button>
                                                                                <button
                                                                                    onClick={handleCancelEdit}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#6c757d",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#5a6268"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#6c757d"}
                                                                                >
                                                                                    <i className="fas fa-times" style={{ marginRight: "6px" }} />
                                                                                    Cancel
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleStartEdit(indicator)}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#10b981",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
                                                                                >
                                                                                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteIndicator(indicator.indicatorId)}
                                                                                    disabled={loading}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#dc3545",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
                                                                                >
                                                                                    <i className="fas fa-trash" style={{ marginRight: "6px" }} />
                                                                                    Delete
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div style={{
                                                    textAlign: "center",
                                                    padding: "60px 30px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "15px",
                                                    border: "2px dashed #ddd"
                                                }}>
                                                    <i className="fas fa-inbox" style={{ fontSize: "64px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                                                    <h4 style={{ fontSize: "22px", color: "#666", marginBottom: "10px", fontWeight: "600" }}>
                                                        No Indicators Found
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Click refresh to load indicators or create a new one
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Search by ID Tab */}
                                    {activeTab === "byId" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Search Indicator by ID
                                            </h3>
                                            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                                                <input
                                                    type="text"
                                                    value={searchId}
                                                    onChange={(e) => setSearchId(e.target.value)}
                                                    placeholder="Enter indicator ID or activity ID"
                                                    style={{
                                                        flex: 1,
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                                <button
                                                    onClick={handleGetIndicatorById}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "14px 40px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#10b981",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#059669";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#10b981";
                                                    }}
                                                >
                                                    <i className="fas fa-search" style={{ marginRight: "8px" }} />
                                                    Search
                                                </button>
                                            </div>

                                            {loading && (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#10b981" }} />
                                                </div>
                                            )}

                                            {selectedIndicator && !loading && (
                                                <div style={{
                                                    backgroundColor: "#ecfdf5",
                                                    borderRadius: "15px",
                                                    padding: "30px",
                                                    border: "2px solid #a7f3d0"
                                                }}>
                                                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#10b981", marginBottom: "20px" }}>
                                                        <i className="fas fa-leaf" style={{ marginRight: "10px" }} />
                                                        Indicator Details
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Activity ID:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {String(selectedIndicator.activity_id || 'N/A')}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Carbon Footprint:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedIndicator.carbon_footprint || 0} kg CO₂
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Renewable Energy Usage:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedIndicator.renewable_energy_usage || 0}%
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Water Usage:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedIndicator.water_usage || 0} L
                                                            </p>
                                                        </div>
                                                        <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Waste Management Score:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedIndicator.waste_management_score || 0}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Biodiversity Impact:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedIndicator.biodiversity_impact || 0}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Community Benefit Score:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedIndicator.community_benefit_score || 0}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Statistics Tab */}
                                    {activeTab === "stats" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Sustainability Statistics
                                            </h3>

                                            {/* Stats Type Selector */}
                                            <div style={{ marginBottom: "30px" }}>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <button
                                                            onClick={() => {
                                                                setStatsType("carbon");
                                                                setStatsData(null);
                                                            }}
                                                            style={{
                                                                width: "100%",
                                                                padding: "20px",
                                                                fontSize: "16px",
                                                                fontWeight: "600",
                                                                borderRadius: "10px",
                                                                border: statsType === "carbon" ? "2px solid #10b981" : "2px solid #e0e0e0",
                                                                backgroundColor: statsType === "carbon" ? "#ecfdf5" : "#fff",
                                                                color: statsType === "carbon" ? "#10b981" : "#666",
                                                                cursor: "pointer",
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <i className="fas fa-smog" style={{ marginRight: "8px", fontSize: "24px", display: "block", marginBottom: "8px" }} />
                                                            Carbon Leaders
                                                        </button>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <button
                                                            onClick={() => {
                                                                setStatsType("renewable");
                                                                setStatsData(null);
                                                            }}
                                                            style={{
                                                                width: "100%",
                                                                padding: "20px",
                                                                fontSize: "16px",
                                                                fontWeight: "600",
                                                                borderRadius: "10px",
                                                                border: statsType === "renewable" ? "2px solid #10b981" : "2px solid #e0e0e0",
                                                                backgroundColor: statsType === "renewable" ? "#ecfdf5" : "#fff",
                                                                color: statsType === "renewable" ? "#10b981" : "#666",
                                                                cursor: "pointer",
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <i className="fas fa-solar-panel" style={{ marginRight: "8px", fontSize: "24px", display: "block", marginBottom: "8px" }} />
                                                            Renewable Leaders
                                                        </button>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <button
                                                            onClick={() => {
                                                                setStatsType("water");
                                                                setStatsData(null);
                                                            }}
                                                            style={{
                                                                width: "100%",
                                                                padding: "20px",
                                                                fontSize: "16px",
                                                                fontWeight: "600",
                                                                borderRadius: "10px",
                                                                border: statsType === "water" ? "2px solid #10b981" : "2px solid #e0e0e0",
                                                                backgroundColor: statsType === "water" ? "#ecfdf5" : "#fff",
                                                                color: statsType === "water" ? "#10b981" : "#666",
                                                                cursor: "pointer",
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <i className="fas fa-tint" style={{ marginRight: "8px", fontSize: "24px", display: "block", marginBottom: "8px" }} />
                                                            Water Efficient
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleGetStats}
                                                    disabled={loading}
                                                    style={{
                                                        marginTop: "20px",
                                                        padding: "14px 40px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#10b981",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#059669";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#10b981";
                                                    }}
                                                >
                                                    <i className="fas fa-chart-bar" style={{ marginRight: "8px" }} />
                                                    Load Statistics
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#10b981" }} />
                                                </div>
                                            ) : statsData ? (
                                                <div>
                                                    {/* Check if statsData has indicators array */}
                                                    {(() => {
                                                        let dataArray = [];
                                                        if (Array.isArray(statsData)) {
                                                            dataArray = statsData;
                                                        } else if (statsData && Array.isArray(statsData.indicators)) {
                                                            dataArray = statsData.indicators;
                                                        } else if (statsData && statsData.data && Array.isArray(statsData.data)) {
                                                            dataArray = statsData.data;
                                                        }

                                                        console.log('Stats data array:', dataArray);

                                                        if (dataArray.length > 0) {
                                                            return (
                                                                <div>
                                                                    <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#666", marginBottom: "20px" }}>
                                                                        {statsType === "carbon" && "🏆 Top Carbon Footprint Leaders"}
                                                                        {statsType === "renewable" && "⚡ Top Renewable Energy Users"}
                                                                        {statsType === "water" && "💧 Most Water Efficient"}
                                                                    </h4>
                                                                    <div className="row">
                                                                        {dataArray.map((item, index) => (
                                                                            <div key={index} className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                                                <div style={{
                                                                                    backgroundColor: "#fff",
                                                                                    borderRadius: "10px",
                                                                                    padding: "20px",
                                                                                    border: "2px solid #e0e0e0",
                                                                                    transition: "all 0.3s ease",
                                                                                    height: "100%"
                                                                                }}
                                                                                     onMouseEnter={(e) => {
                                                                                         e.currentTarget.style.borderColor = "#10b981";
                                                                                         e.currentTarget.style.boxShadow = "0 5px 15px rgba(16,185,129,0.1)";
                                                                                         e.currentTarget.style.transform = "translateY(-5px)";
                                                                                     }}
                                                                                     onMouseLeave={(e) => {
                                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                                         e.currentTarget.style.boxShadow = "none";
                                                                                         e.currentTarget.style.transform = "translateY(0)";
                                                                                     }}>
                                                                                    <div style={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        justifyContent: "space-between",
                                                                                        marginBottom: "15px"
                                                                                    }}>
                                                                                        <div style={{
                                                                                            width: "40px",
                                                                                            height: "40px",
                                                                                            borderRadius: "50%",
                                                                                            backgroundColor: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : index === 2 ? "#cd7f32" : "#e0e0e0",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            fontWeight: "700",
                                                                                            fontSize: "18px",
                                                                                            color: "#fff"
                                                                                        }}>
                                                                                            {index + 1}
                                                                                        </div>
                                                                                        <h5 style={{
                                                                                            fontSize: "16px",
                                                                                            fontWeight: "700",
                                                                                            color: "#10b981",
                                                                                            margin: 0,
                                                                                            flex: 1,
                                                                                            marginLeft: "15px"
                                                                                        }}>
                                                                                            {String(item.indicatorId || item.indicatorName || 'N/A')}
                                                                                        </h5>
                                                                                    </div>

                                                                                    <div style={{
                                                                                        padding: "15px",
                                                                                        backgroundColor: "#f8f9fa",
                                                                                        borderRadius: "8px"
                                                                                    }}>
                                                                                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "5px" }}>
                                                                                            {item.indicatorName || 'No name'}
                                                                                        </div>
                                                                                        <div style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a" }}>
                                                                                            {item.indicatorValue || 0} {item.measurementUnit || ''}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div style={{
                                                                    textAlign: "center",
                                                                    padding: "40px",
                                                                    backgroundColor: "#f8f9fa",
                                                                    borderRadius: "10px"
                                                                }}>
                                                                    <i className="fas fa-chart-bar" style={{ fontSize: "48px", color: "#ccc", marginBottom: "15px", display: "block" }} />
                                                                    <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>No statistics available for this category</p>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            ) : (
                                                <div style={{
                                                    textAlign: "center",
                                                    padding: "60px 30px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "15px",
                                                    border: "2px dashed #ddd"
                                                }}>
                                                    <i className="fas fa-chart-bar" style={{ fontSize: "64px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                                                    <h4 style={{ fontSize: "22px", color: "#666", marginBottom: "10px", fontWeight: "600" }}>
                                                        Select a Statistics Type
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Choose a category above and click "Load Statistics"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Create Indicator Tab */}
                                    {activeTab === "create" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Create New Sustainability Indicator
                                            </h3>
                                            <form onSubmit={handleCreateIndicator}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Activity ID <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.activity_id}
                                                                onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
                                                                placeholder="e.g., ACT001"
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Carbon Footprint (kg CO₂)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={formData.carbon_footprint}
                                                                onChange={(e) => setFormData({ ...formData, carbon_footprint: e.target.value })}
                                                                placeholder="0.00"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Renewable Energy Usage (%)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="100"
                                                                value={formData.renewable_energy_usage}
                                                                onChange={(e) => setFormData({ ...formData, renewable_energy_usage: e.target.value })}
                                                                placeholder="0.00"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Water Usage (Liters)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={formData.water_usage}
                                                                onChange={(e) => setFormData({ ...formData, water_usage: e.target.value })}
                                                                placeholder="0.00"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Waste Management Score (0-100)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="100"
                                                                value={formData.waste_management_score}
                                                                onChange={(e) => setFormData({ ...formData, waste_management_score: e.target.value })}
                                                                placeholder="0.00"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Biodiversity Impact Score (0-100)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="100"
                                                                value={formData.biodiversity_impact}
                                                                onChange={(e) => setFormData({ ...formData, biodiversity_impact: e.target.value })}
                                                                placeholder="0.00"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Community Benefit Score (0-100)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="100"
                                                                value={formData.community_benefit_score}
                                                                onChange={(e) => setFormData({ ...formData, community_benefit_score: e.target.value })}
                                                                placeholder="0.00"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#10b981"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            activity_id: "",
                                                            carbon_footprint: "",
                                                            renewable_energy_usage: "",
                                                            water_usage: "",
                                                            waste_management_score: "",
                                                            biodiversity_impact: "",
                                                            community_benefit_score: ""
                                                        })}
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
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = "#6c757d";
                                                            e.target.style.borderColor = "#6c757d";
                                                        }}
                                                    >
                                                        <i className="fas fa-eraser" style={{ marginRight: "8px" }} />
                                                        Clear
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        style={{
                                                            flex: 1,
                                                            padding: "16px 40px",
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            borderRadius: "10px",
                                                            border: "none",
                                                            backgroundColor: loading ? "#ccc" : "#10b981",
                                                            color: "#fff",
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#059669";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#10b981";
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
                                                                Creating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-plus-circle" style={{ marginRight: "8px" }} />
                                                                Create Indicator
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Main Section ======*/}
        </Layout>
    );
};

export default SustainabilityPage;