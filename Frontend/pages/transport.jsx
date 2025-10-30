import { useState, useEffect } from "react";
import Layout from "@/src/layout/Layout";
import {
    getAllTransports,
    getTransportById,
    createBike,
    createElectricVehicle,
    createPublicTransport,
    updateTransport,
    deleteTransport,
    searchTransports,
    getZeroEmissionTransports,
    getCheapestTransports,
    getFastestTransports,
    getEcoScoreRanking
} from "@/pages/api/transport";

const TransportPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // all, search, stats, create
    const [transportType, setTransportType] = useState("Bike"); // Bike, ElectricVehicle, PublicTransport
    const [transports, setTransports] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [statsType, setStatsType] = useState("cheapest"); // cheapest, fastest, eco, zero-emission
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    // Form states for Bike
    const [bikeFormData, setBikeFormData] = useState({
        transportName: "",
        transportType: "City Bike",
        bikeModel: "",
        isElectric: false,
        batteryRange: "",
        rentalPricePerHour: "",
        pricePerKm: "",
        carbonEmissionPerKm: "",
        capacity: "1",
        availability: true,
        operatingHours: "24/7",
        averageSpeed: "",
        frameSize: "M",
        contactPhone: ""
    });

    // Form states for Electric Vehicle
    const [evFormData, setEvFormData] = useState({
        transportName: "",
        transportType: "Electric Car",
        vehicleModel: "",
        vehicleBatteryRange: "",
        chargingTime: "",
        seatingCapacity: "4",
        dailyRentalPrice: "",
        pricePerKm: "",
        carbonEmissionPerKm: "",
        capacity: "4",
        availability: true,
        hasAirConditioning: true,
        operatingHours: "24/7",
        averageSpeed: "",
        contactPhone: ""
    });

    // Form states for Public Transport
    const [ptFormData, setPtFormData] = useState({
        transportName: "",
        transportType: "Bus",
        lineNumber: "",
        routeDescription: "",
        ticketPrice: "",
        pricePerKm: "",
        carbonEmissionPerKm: "",
        capacity: "50",
        availability: true,
        frequencyMinutes: "30",
        accessibleForDisabled: true,
        operatingHours: "06:00-23:00",
        averageSpeed: "",
        contactPhone: ""
    });

    // Edit mode
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        transportName: "",
        availability: true,
        pricePerKm: "",
        operatingHours: ""
    });

    // Load transports on component mount
    useEffect(() => {
        if (activeTab === "all") {
            handleGetAllTransports();
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

    const handleGetAllTransports = async (type = null) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getAllTransports(type);
            console.log('All transports:', data);
            setTransports(Array.isArray(data) ? data : []);
            setSuccess(`Loaded ${data.length} transport option(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch transports";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching transports:", err);
            setTransports([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError("Please enter a search term");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await searchTransports(searchTerm);
            console.log('Search results:', data);
            setTransports(Array.isArray(data) ? data : []);
            setSuccess(`Found ${data.length} result(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to search transports";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error searching transports:", err);
            setTransports([]);
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
            if (statsType === "cheapest") {
                data = await getCheapestTransports();
            } else if (statsType === "fastest") {
                data = await getFastestTransports();
            } else if (statsType === "eco") {
                data = await getEcoScoreRanking();
            } else if (statsType === "zero-emission") {
                data = await getZeroEmissionTransports();
            }
            console.log('Stats data:', data);
            setStatsData(Array.isArray(data) ? data : []);
            setSuccess(`Loaded ${data.length} transport(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to fetch statistics";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching stats:", err);
            setStatsData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            let result;
            if (transportType === "Bike") {
                if (!bikeFormData.transportName.trim()) {
                    setError("Transport name is required");
                    setLoading(false);
                    return;
                }
                result = await createBike(bikeFormData);
                setBikeFormData({
                    transportName: "",
                    transportType: "City Bike",
                    bikeModel: "",
                    isElectric: false,
                    batteryRange: "",
                    rentalPricePerHour: "",
                    pricePerKm: "",
                    carbonEmissionPerKm: "",
                    capacity: "1",
                    availability: true,
                    operatingHours: "24/7",
                    averageSpeed: "",
                    frameSize: "M",
                    contactPhone: ""
                });
            } else if (transportType === "ElectricVehicle") {
                if (!evFormData.transportName.trim()) {
                    setError("Transport name is required");
                    setLoading(false);
                    return;
                }
                result = await createElectricVehicle(evFormData);
                setEvFormData({
                    transportName: "",
                    transportType: "Electric Car",
                    vehicleModel: "",
                    vehicleBatteryRange: "",
                    chargingTime: "",
                    seatingCapacity: "4",
                    dailyRentalPrice: "",
                    pricePerKm: "",
                    carbonEmissionPerKm: "",
                    capacity: "4",
                    availability: true,
                    hasAirConditioning: true,
                    operatingHours: "24/7",
                    averageSpeed: "",
                    contactPhone: ""
                });
            } else if (transportType === "PublicTransport") {
                if (!ptFormData.transportName.trim()) {
                    setError("Transport name is required");
                    setLoading(false);
                    return;
                }
                result = await createPublicTransport(ptFormData);
                setPtFormData({
                    transportName: "",
                    transportType: "Bus",
                    lineNumber: "",
                    routeDescription: "",
                    ticketPrice: "",
                    pricePerKm: "",
                    carbonEmissionPerKm: "",
                    capacity: "50",
                    availability: true,
                    frequencyMinutes: "30",
                    accessibleForDisabled: true,
                    operatingHours: "06:00-23:00",
                    averageSpeed: "",
                    contactPhone: ""
                });
            }

            console.log('Create result:', result);
            setSuccess(`${transportType} created successfully!`);

            // Refresh list
            setTimeout(() => {
                if (activeTab === "all") handleGetAllTransports();
            }, 500);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to create transport";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error creating transport:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (transport) => {
        setEditingId(transport.id);
        setEditFormData({
            transportName: transport.transportName || "",
            availability: transport.availability,
            pricePerKm: transport.pricePerKm || "",
            operatingHours: transport.operatingHours || ""
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({
            transportName: "",
            availability: true,
            pricePerKm: "",
            operatingHours: ""
        });
    };

    const handleUpdateTransport = async (transportId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await updateTransport(transportId, editFormData);
            setSuccess("Transport updated successfully!");
            setEditingId(null);
            handleGetAllTransports();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to update transport";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error updating transport:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransport = async (transportId) => {
        if (!confirm("Are you sure you want to delete this transport option?")) {
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteTransport(transportId);
            setSuccess("Transport deleted successfully!");
            handleGetAllTransports();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to delete transport";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error deleting transport:", err);
        } finally {
            setLoading(false);
        }
    };

    const getTransportIcon = (type) => {
        if (type?.includes("Bike") || type?.includes("bike")) return "bicycle";
        if (type?.includes("Electric") || type?.includes("EV") || type?.includes("Car")) return "car";
        if (type?.includes("Bus") || type?.includes("Metro") || type?.includes("Tram")) return "bus";
        return "shuttle-van";
    };

    const getTransportColor = (type) => {
        if (type?.includes("Bike") || type?.includes("bike"))
            return { bg: "#fef3c7", border: "#fde68a", text: "#92400e" };
        if (type?.includes("Electric") || type?.includes("EV") || type?.includes("Car"))
            return { bg: "#d1fae5", border: "#a7f3d0", text: "#065f46" };
        if (type?.includes("Bus") || type?.includes("Metro") || type?.includes("Tram"))
            return { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af" };
        return { bg: "#e5e7eb", border: "#d1d5db", text: "#374151" };
    };

    const getEmissionBadge = (emission) => {
        if (emission === 0) return { bg: "#d1fae5", border: "#a7f3d0", text: "#065f46", label: "Zero Emission" };
        if (emission < 50) return { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af", label: "Low Emission" };
        if (emission < 100) return { bg: "#fef3c7", border: "#fde68a", text: "#92400e", label: "Medium Emission" };
        return { bg: "#fee2e2", border: "#fecaca", text: "#991b1b", label: "High Emission" };
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
                                            <i className="fas fa-bus" style={{ fontSize: "32px", color: "#fff" }} />
                                        </div>
                                        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", margin: 0 }}>
                                            Transport Management
                                        </h1>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                                        Manage bikes, electric vehicles, and public transport options
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
                                        { id: "all", label: "All Transports", icon: "shuttle-van" },
                                        { id: "search", label: "Search", icon: "search" },
                                        { id: "stats", label: "Statistics", icon: "chart-line" },
                                        { id: "create", label: "Create Transport", icon: "plus-circle" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setError(null);
                                                setSuccess(null);
                                                setTransports([]);
                                                setStatsData([]);
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: "150px",
                                                padding: "20px 25px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                border: "none",
                                                backgroundColor: activeTab === tab.id ? "#f59e0b" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#666",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                borderBottom: activeTab === tab.id ? "3px solid #d97706" : "none"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = "#fff7ed";
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
                                    {/* All Transports Tab */}
                                    {activeTab === "all" && (
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                                                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                    All Transports ({transports.length})
                                                </h3>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <select
                                                        onChange={(e) => handleGetAllTransports(e.target.value || null)}
                                                        style={{
                                                            padding: "12px 20px",
                                                            fontSize: "14px",
                                                            borderRadius: "10px",
                                                            border: "2px solid #e0e0e0",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <option value="">All Types</option>
                                                        <option value="Bike">Bikes</option>
                                                        <option value="ElectricVehicle">Electric Vehicles</option>
                                                        <option value="PublicTransport">Public Transport</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleGetAllTransports()}
                                                        disabled={loading}
                                                        style={{
                                                            padding: "12px 30px",
                                                            fontSize: "15px",
                                                            fontWeight: "600",
                                                            borderRadius: "10px",
                                                            border: "none",
                                                            backgroundColor: "#f59e0b",
                                                            color: "#fff",
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#d97706";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = "#f59e0b";
                                                        }}
                                                    >
                                                        <i className="fas fa-sync-alt" style={{ marginRight: "8px" }} />
                                                        Refresh
                                                    </button>
                                                </div>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "60px 0" }}>
                                                    <div className="spinner-border" style={{ width: "50px", height: "50px", color: "#f59e0b" }} />
                                                    <p style={{ marginTop: "20px", color: "#666", fontSize: "16px" }}>Loading transports...</p>
                                                </div>
                                            ) : transports.length > 0 ? (
                                                <div className="row">
                                                    {transports.map((transport, index) => {
                                                        const isEditing = editingId === transport.id;
                                                        const colors = getTransportColor(transport.transportType);
                                                        const emissionBadge = getEmissionBadge(transport.carbonEmissionPerKm);

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
                                                                         e.currentTarget.style.boxShadow = "0 8px 25px rgba(245,158,11,0.15)";
                                                                         e.currentTarget.style.borderColor = "#f59e0b";
                                                                         e.currentTarget.style.transform = "translateY(-5px)";
                                                                     }}
                                                                     onMouseLeave={(e) => {
                                                                         e.currentTarget.style.boxShadow = "none";
                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                         e.currentTarget.style.transform = "translateY(0)";
                                                                     }}>
                                                                    {/* Type Badge */}
                                                                    <div style={{
                                                                        position: "absolute",
                                                                        top: "20px",
                                                                        right: "20px",
                                                                        padding: "6px 12px",
                                                                        backgroundColor: colors.bg,
                                                                        border: `1px solid ${colors.border}`,
                                                                        borderRadius: "20px",
                                                                        fontSize: "11px",
                                                                        fontWeight: "600",
                                                                        color: colors.text
                                                                    }}>
                                                                        <i className={`fas fa-${getTransportIcon(transport.transportType)}`} style={{ marginRight: "5px" }} />
                                                                        {transport.transportType}
                                                                    </div>

                                                                    {/* Transport Header */}
                                                                    <h4 style={{
                                                                        fontSize: "18px",
                                                                        fontWeight: "700",
                                                                        color: "#f59e0b",
                                                                        marginBottom: "20px",
                                                                        paddingRight: "120px"
                                                                    }}>
                                                                        <i className="fas fa-shuttle-van" style={{ marginRight: "8px" }} />
                                                                        {transport.transportName || 'Unknown'}
                                                                    </h4>

                                                                    {/* Transport Details */}
                                                                    <div style={{ marginBottom: "15px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Name"
                                                                                    value={editFormData.transportName}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, transportName: e.target.value })}
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        padding: "8px",
                                                                                        marginBottom: "10px",
                                                                                        fontSize: "13px",
                                                                                        borderRadius: "6px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}
                                                                                />
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    placeholder="Price per km"
                                                                                    value={editFormData.pricePerKm}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, pricePerKm: e.target.value })}
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        padding: "8px",
                                                                                        marginBottom: "10px",
                                                                                        fontSize: "13px",
                                                                                        borderRadius: "6px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Operating Hours"
                                                                                    value={editFormData.operatingHours}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, operatingHours: e.target.value })}
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        padding: "8px",
                                                                                        marginBottom: "10px",
                                                                                        fontSize: "13px",
                                                                                        borderRadius: "6px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}
                                                                                />
                                                                                <label style={{ display: "flex", alignItems: "center", fontSize: "13px" }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={editFormData.availability}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, availability: e.target.checked })}
                                                                                        style={{ marginRight: "8px", width: "16px", height: "16px" }}
                                                                                    />
                                                                                    Available
                                                                                </label>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {/* Emission Badge */}
                                                                                <div style={{
                                                                                    padding: "10px 12px",
                                                                                    backgroundColor: emissionBadge.bg,
                                                                                    border: `1px solid ${emissionBadge.border}`,
                                                                                    borderRadius: "8px",
                                                                                    marginBottom: "10px",
                                                                                    fontSize: "13px",
                                                                                    fontWeight: "600",
                                                                                    color: emissionBadge.text
                                                                                }}>
                                                                                    <i className="fas fa-leaf" style={{ marginRight: "8px" }} />
                                                                                    {emissionBadge.label} ({transport.carbonEmissionPerKm} g/km)
                                                                                </div>

                                                                                {/* Price */}
                                                                                <div style={{
                                                                                    padding: "10px 12px",
                                                                                    backgroundColor: "#f8f9fa",
                                                                                    borderRadius: "8px",
                                                                                    marginBottom: "8px",
                                                                                    fontSize: "13px"
                                                                                }}>
                                                                                    <i className="fas fa-dollar-sign" style={{ marginRight: "8px", color: "#666" }} />
                                                                                    ${transport.pricePerKm}/km
                                                                                </div>

                                                                                {/* Capacity */}
                                                                                <div style={{
                                                                                    padding: "10px 12px",
                                                                                    backgroundColor: "#f8f9fa",
                                                                                    borderRadius: "8px",
                                                                                    marginBottom: "8px",
                                                                                    fontSize: "13px"
                                                                                }}>
                                                                                    <i className="fas fa-users" style={{ marginRight: "8px", color: "#666" }} />
                                                                                    Capacity: {transport.capacity}
                                                                                </div>

                                                                                {/* Speed */}
                                                                                {transport.averageSpeed > 0 && (
                                                                                    <div style={{
                                                                                        padding: "10px 12px",
                                                                                        backgroundColor: "#f8f9fa",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "8px",
                                                                                        fontSize: "13px"
                                                                                    }}>
                                                                                        <i className="fas fa-tachometer-alt" style={{ marginRight: "8px", color: "#666" }} />
                                                                                        Avg Speed: {transport.averageSpeed} km/h
                                                                                    </div>
                                                                                )}

                                                                                {/* Operating Hours */}
                                                                                <div style={{
                                                                                    padding: "10px 12px",
                                                                                    backgroundColor: "#f8f9fa",
                                                                                    borderRadius: "8px",
                                                                                    marginBottom: "8px",
                                                                                    fontSize: "13px"
                                                                                }}>
                                                                                    <i className="fas fa-clock" style={{ marginRight: "8px", color: "#666" }} />
                                                                                    {transport.operatingHours}
                                                                                </div>

                                                                                {/* Availability */}
                                                                                <div style={{
                                                                                    padding: "8px 12px",
                                                                                    backgroundColor: transport.availability ? "#d1fae5" : "#fee2e2",
                                                                                    border: `1px solid ${transport.availability ? "#a7f3d0" : "#fecaca"}`,
                                                                                    borderRadius: "8px",
                                                                                    fontSize: "12px",
                                                                                    fontWeight: "600",
                                                                                    color: transport.availability ? "#065f46" : "#991b1b",
                                                                                    textAlign: "center"
                                                                                }}>
                                                                                    {transport.availability ? "✓ Available" : "✗ Not Available"}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Action Buttons */}
                                                                    <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleUpdateTransport(transport.id)}
                                                                                    disabled={loading}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#f59e0b",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
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
                                                                                    onClick={() => handleStartEdit(transport)}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#f59e0b",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
                                                                                >
                                                                                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteTransport(transport.id)}
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
                                                        No Transports Found
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Click refresh to load transports or create a new one
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Continue with Search, Stats, and Create tabs... */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default TransportPage;