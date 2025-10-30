import { useState, useEffect } from "react";
import Layout from "@/src/layout/Layout";
import {
    getAllLocations,
    getCities,
    getNaturalSites,
    getRegions,
    getLocationById,
    createCity,
    createNaturalSite,
    createRegion,
    updateCity,
    updateNaturalSite,
    updateRegion,
    deleteLocation,
    findNearbyLocations,
    LOCATION_TYPES,
    CLIMATE_TYPES
} from "@/pages/api/location";

const LocationsPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // all, cities, natural, regions, nearby, create
    const [locationType, setLocationType] = useState("City"); // City, NaturalSite, Region
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [nearbyLocations, setNearbyLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Search/Nearby states
    const [searchId, setSearchId] = useState("");
    const [nearbyLat, setNearbyLat] = useState("");
    const [nearbyLng, setNearbyLng] = useState("");
    const [nearbyRadius, setNearbyRadius] = useState("50");
    const [nearbyType, setNearbyType] = useState("");

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        address: "",
        description: "",
        // City fields
        population: "",
        postalCode: "",
        touristAttractions: "",
        // Natural Site fields
        protectedStatus: false,
        biodiversityIndex: "",
        areaSizeHectares: "",
        entryFee: "",
        // Region fields
        climateType: "",
        regionArea: "",
        mainAttractions: ""
    });

    // Edit mode
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        address: "",
        description: "",
        population: "",
        postalCode: "",
        touristAttractions: "",
        protectedStatus: false,
        biodiversityIndex: "",
        areaSizeHectares: "",
        entryFee: "",
        climateType: "",
        regionArea: "",
        mainAttractions: ""
    });

    // Load locations on component mount and tab change
    useEffect(() => {
        if (activeTab === "all") {
            handleGetAllLocations();
        } else if (activeTab === "cities") {
            handleGetCities();
        } else if (activeTab === "natural") {
            handleGetNaturalSites();
        } else if (activeTab === "regions") {
            handleGetRegions();
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

    const handleGetAllLocations = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getAllLocations();
            console.log('All locations:', data);
            setLocations(Array.isArray(data) ? data : []);
            setSuccess(`Loaded ${data.length} location(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch locations";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching locations:", err);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGetCities = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getCities();
            console.log('Cities:', data);
            setLocations(Array.isArray(data) ? data : []);
            setSuccess(`Loaded ${data.length} city(ies)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch cities";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching cities:", err);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGetNaturalSites = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getNaturalSites();
            console.log('Natural sites:', data);
            setLocations(Array.isArray(data) ? data : []);
            setSuccess(`Loaded ${data.length} natural site(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch natural sites";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching natural sites:", err);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGetRegions = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getRegions();
            console.log('Regions:', data);
            setLocations(Array.isArray(data) ? data : []);
            setSuccess(`Loaded ${data.length} region(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch regions";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching regions:", err);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFindNearby = async () => {
        if (!nearbyLat || !nearbyLng) {
            setError("Please enter latitude and longitude");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await findNearbyLocations(
                parseFloat(nearbyLat),
                parseFloat(nearbyLng),
                parseFloat(nearbyRadius) || 50,
                nearbyType || null
            );
            console.log('Nearby locations:', data);
            const locationsList = data.locations || data.nearby_locations || data || [];
            setNearbyLocations(Array.isArray(locationsList) ? locationsList : []);
            setSuccess(`Found ${locationsList.length} nearby location(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to find nearby locations";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error finding nearby locations:", err);
            setNearbyLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError("Location name is required");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const dataToSend = {
                ...formData,
                type: locationType,
                latitude: parseFloat(formData.latitude) || 0,
                longitude: parseFloat(formData.longitude) || 0,
                population: formData.population ? parseInt(formData.population) : 0,
                biodiversityIndex: formData.biodiversityIndex ? parseFloat(formData.biodiversityIndex) : 0,
                areaSizeHectares: formData.areaSizeHectares ? parseFloat(formData.areaSizeHectares) : 0,
                entryFee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
                regionArea: formData.regionArea ? parseFloat(formData.regionArea) : 0
            };

            console.log('Creating location:', dataToSend);

            let result;
            if (locationType === "City") {
                result = await createCity(dataToSend);
            } else if (locationType === "NaturalSite") {
                result = await createNaturalSite(dataToSend);
            } else if (locationType === "Region") {
                result = await createRegion(dataToSend);
            }

            console.log('Create result:', result);
            setSuccess(`${locationType} created successfully!`);

            // Reset form
            setFormData({
                name: "",
                latitude: "",
                longitude: "",
                address: "",
                description: "",
                population: "",
                postalCode: "",
                touristAttractions: "",
                protectedStatus: false,
                biodiversityIndex: "",
                areaSizeHectares: "",
                entryFee: "",
                climateType: "",
                regionArea: "",
                mainAttractions: ""
            });

            // Refresh list
            setTimeout(() => {
                if (activeTab === "all") handleGetAllLocations();
                else if (activeTab === "cities") handleGetCities();
                else if (activeTab === "natural") handleGetNaturalSites();
                else if (activeTab === "regions") handleGetRegions();
            }, 500);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to create location";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error creating location:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (location) => {
        setEditingId(location.uri_id || location.id);
        setEditFormData({
            name: location.name || "",
            latitude: location.latitude || "",
            longitude: location.longitude || "",
            address: location.address || "",
            description: location.description || "",
            population: location.population || "",
            postalCode: location.postalCode || "",
            touristAttractions: location.touristAttractions || "",
            protectedStatus: location.protectedStatus || false,
            biodiversityIndex: location.biodiversityIndex || "",
            areaSizeHectares: location.areaSizeHectares || "",
            entryFee: location.entryFee || "",
            climateType: location.climateType || "",
            regionArea: location.regionArea || "",
            mainAttractions: location.mainAttractions || ""
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({
            name: "",
            latitude: "",
            longitude: "",
            address: "",
            description: "",
            population: "",
            postalCode: "",
            touristAttractions: "",
            protectedStatus: false,
            biodiversityIndex: "",
            areaSizeHectares: "",
            entryFee: "",
            climateType: "",
            regionArea: "",
            mainAttractions: ""
        });
    };

    const handleUpdateLocation = async (location) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const dataToSend = {
                ...editFormData,
                type: location.type,
                latitude: parseFloat(editFormData.latitude) || 0,
                longitude: parseFloat(editFormData.longitude) || 0,
                population: editFormData.population ? parseInt(editFormData.population) : 0,
                biodiversityIndex: editFormData.biodiversityIndex ? parseFloat(editFormData.biodiversityIndex) : 0,
                areaSizeHectares: editFormData.areaSizeHectares ? parseFloat(editFormData.areaSizeHectares) : 0,
                entryFee: editFormData.entryFee ? parseFloat(editFormData.entryFee) : 0,
                regionArea: editFormData.regionArea ? parseFloat(editFormData.regionArea) : 0
            };

            const locationId = location.uri_id || location.id;

            if (location.type === "City") {
                await updateCity(locationId, dataToSend);
            } else if (location.type === "NaturalSite") {
                await updateNaturalSite(locationId, dataToSend);
            } else if (location.type === "Region") {
                await updateRegion(locationId, dataToSend);
            }

            setSuccess("Location updated successfully!");
            setEditingId(null);

            // Refresh list
            if (activeTab === "all") handleGetAllLocations();
            else if (activeTab === "cities") handleGetCities();
            else if (activeTab === "natural") handleGetNaturalSites();
            else if (activeTab === "regions") handleGetRegions();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to update location";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error updating location:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLocation = async (locationId) => {
        if (!confirm("Are you sure you want to delete this location?")) {
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteLocation(locationId);
            setSuccess("Location deleted successfully!");

            // Refresh list
            if (activeTab === "all") handleGetAllLocations();
            else if (activeTab === "cities") handleGetCities();
            else if (activeTab === "natural") handleGetNaturalSites();
            else if (activeTab === "regions") handleGetRegions();
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to delete location";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error deleting location:", err);
        } finally {
            setLoading(false);
        }
    };

    const getLocationIcon = (type) => {
        if (type === "City") return "city";
        if (type === "NaturalSite") return "tree";
        if (type === "Region") return "map-marked-alt";
        return "map-marker-alt";
    };

    const getLocationColor = (type) => {
        if (type === "City") return { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af" };
        if (type === "NaturalSite") return { bg: "#d1fae5", border: "#a7f3d0", text: "#065f46" };
        if (type === "Region") return { bg: "#fef3c7", border: "#fde68a", text: "#92400e" };
        return { bg: "#e5e7eb", border: "#d1d5db", text: "#374151" };
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
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
                                            <i className="fas fa-map-marked-alt" style={{ fontSize: "32px", color: "#fff" }} />
                                        </div>
                                        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", margin: 0 }}>
                                            Locations Management
                                        </h1>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                                        Manage cities, natural sites, and regions
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
                                        { id: "all", label: "All Locations", icon: "map-marked-alt" },
                                        { id: "cities", label: "Cities", icon: "city" },
                                        { id: "natural", label: "Natural Sites", icon: "tree" },
                                        { id: "regions", label: "Regions", icon: "globe-americas" },
                                        { id: "nearby", label: "Find Nearby", icon: "search-location" },
                                        { id: "create", label: "Create Location", icon: "plus-circle" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setError(null);
                                                setSuccess(null);
                                                setSelectedLocation(null);
                                                setNearbyLocations([]);
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: "140px",
                                                padding: "20px 15px",
                                                fontSize: "15px",
                                                fontWeight: "600",
                                                border: "none",
                                                backgroundColor: activeTab === tab.id ? "#3b82f6" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#666",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                borderBottom: activeTab === tab.id ? "3px solid #2563eb" : "none"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = "#eff6ff";
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
                                    {/* All Locations / Cities / Natural Sites / Regions Tabs */}
                                    {(activeTab === "all" || activeTab === "cities" || activeTab === "natural" || activeTab === "regions") && (
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                                                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                    {activeTab === "all" && `All Locations (${locations.length})`}
                                                    {activeTab === "cities" && `Cities (${locations.length})`}
                                                    {activeTab === "natural" && `Natural Sites (${locations.length})`}
                                                    {activeTab === "regions" && `Regions (${locations.length})`}
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        if (activeTab === "all") handleGetAllLocations();
                                                        else if (activeTab === "cities") handleGetCities();
                                                        else if (activeTab === "natural") handleGetNaturalSites();
                                                        else if (activeTab === "regions") handleGetRegions();
                                                    }}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "12px 30px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#3b82f6",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#2563eb";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#3b82f6";
                                                    }}
                                                >
                                                    <i className="fas fa-sync-alt" style={{ marginRight: "8px" }} />
                                                    Refresh
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "60px 0" }}>
                                                    <div className="spinner-border" style={{ width: "50px", height: "50px", color: "#3b82f6" }} />
                                                    <p style={{ marginTop: "20px", color: "#666", fontSize: "16px" }}>Loading locations...</p>
                                                </div>
                                            ) : locations.length > 0 ? (
                                                <div className="row">
                                                    {locations.map((location, index) => {
                                                        const isEditing = editingId === (location.uri_id || location.id);
                                                        const colors = getLocationColor(location.type);

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
                                                                         e.currentTarget.style.boxShadow = "0 8px 25px rgba(59,130,246,0.15)";
                                                                         e.currentTarget.style.borderColor = "#3b82f6";
                                                                         e.currentTarget.style.transform = "translateY(-5px)";
                                                                     }}
                                                                     onMouseLeave={(e) => {
                                                                         e.currentTarget.style.boxShadow = "none";
                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                         e.currentTarget.style.transform = "translateY(0)";
                                                                     }}>
                                                                    {/* Location Type Badge */}
                                                                    <div style={{
                                                                        position: "absolute",
                                                                        top: "20px",
                                                                        right: "20px",
                                                                        padding: "6px 12px",
                                                                        backgroundColor: colors.bg,
                                                                        border: `1px solid ${colors.border}`,
                                                                        borderRadius: "20px",
                                                                        fontSize: "12px",
                                                                        fontWeight: "600",
                                                                        color: colors.text
                                                                    }}>
                                                                        <i className={`fas fa-${getLocationIcon(location.type)}`} style={{ marginRight: "5px" }} />
                                                                        {location.type}
                                                                    </div>

                                                                    {/* Location Header */}
                                                                    <h4 style={{
                                                                        fontSize: "18px",
                                                                        fontWeight: "700",
                                                                        color: "#3b82f6",
                                                                        marginBottom: "20px",
                                                                        paddingRight: "100px"
                                                                    }}>
                                                                        <i className="fas fa-map-marker-alt" style={{ marginRight: "8px" }} />
                                                                        {location.name || 'Unknown'}
                                                                    </h4>

                                                                    {/* Location Details */}
                                                                    <div style={{ marginBottom: "15px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Name"
                                                                                    value={editFormData.name}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                                                                                    step="0.000001"
                                                                                    placeholder="Latitude"
                                                                                    value={editFormData.latitude}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, latitude: e.target.value })}
                                                                                    style={{
                                                                                        width: "48%",
                                                                                        padding: "8px",
                                                                                        marginBottom: "10px",
                                                                                        marginRight: "4%",
                                                                                        fontSize: "13px",
                                                                                        borderRadius: "6px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}
                                                                                />
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.000001"
                                                                                    placeholder="Longitude"
                                                                                    value={editFormData.longitude}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, longitude: e.target.value })}
                                                                                    style={{
                                                                                        width: "48%",
                                                                                        padding: "8px",
                                                                                        marginBottom: "10px",
                                                                                        fontSize: "13px",
                                                                                        borderRadius: "6px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}
                                                                                />
                                                                                <textarea
                                                                                    placeholder="Address"
                                                                                    value={editFormData.address}
                                                                                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                                                                    rows={2}
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        padding: "8px",
                                                                                        marginBottom: "10px",
                                                                                        fontSize: "13px",
                                                                                        borderRadius: "6px",
                                                                                        border: "1px solid #e0e0e0"
                                                                                    }}
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div style={{
                                                                                    padding: "10px 12px",
                                                                                    backgroundColor: "#f8f9fa",
                                                                                    borderRadius: "8px",
                                                                                    marginBottom: "8px",
                                                                                    fontSize: "13px"
                                                                                }}>
                                                                                    <i className="fas fa-map-pin" style={{ marginRight: "8px", color: "#666" }} />
                                                                                    {typeof location.latitude === 'number' ? location.latitude.toFixed(6) : (parseFloat(location.latitude) || 0).toFixed(6)}, {typeof location.longitude === 'number' ? location.longitude.toFixed(6) : (parseFloat(location.longitude) || 0).toFixed(6)}
                                                                                </div>
                                                                                {location.address && (
                                                                                    <div style={{
                                                                                        padding: "10px 12px",
                                                                                        backgroundColor: "#f8f9fa",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "8px",
                                                                                        fontSize: "13px"
                                                                                    }}>
                                                                                        <i className="fas fa-home" style={{ marginRight: "8px", color: "#666" }} />
                                                                                        {location.address}
                                                                                    </div>
                                                                                )}
                                                                                {location.description && (
                                                                                    <div style={{
                                                                                        padding: "10px 12px",
                                                                                        backgroundColor: "#f8f9fa",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "8px",
                                                                                        fontSize: "13px",
                                                                                        color: "#666"
                                                                                    }}>
                                                                                        {location.description}
                                                                                    </div>
                                                                                )}
                                                                                {/* Type-specific fields */}
                                                                                {location.type === "City" && location.population > 0 && (
                                                                                    <div style={{
                                                                                        padding: "10px 12px",
                                                                                        backgroundColor: "#dbeafe",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "8px",
                                                                                        fontSize: "13px",
                                                                                        fontWeight: "600",
                                                                                        color: "#1e40af"
                                                                                    }}>
                                                                                        <i className="fas fa-users" style={{ marginRight: "8px" }} />
                                                                                        Population: {location.population.toLocaleString()}
                                                                                    </div>
                                                                                )}
                                                                                {location.type === "NaturalSite" && (
                                                                                    <div style={{
                                                                                        padding: "10px 12px",
                                                                                        backgroundColor: "#d1fae5",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "8px",
                                                                                        fontSize: "13px",
                                                                                        fontWeight: "600",
                                                                                        color: "#065f46"
                                                                                    }}>
                                                                                        <i className="fas fa-shield-alt" style={{ marginRight: "8px" }} />
                                                                                        {location.protectedStatus ? "Protected" : "Not Protected"}
                                                                                        {location.areaSizeHectares > 0 && ` • ${location.areaSizeHectares} ha`}
                                                                                    </div>
                                                                                )}
                                                                                {location.type === "Region" && location.climateType && (
                                                                                    <div style={{
                                                                                        padding: "10px 12px",
                                                                                        backgroundColor: "#fef3c7",
                                                                                        borderRadius: "8px",
                                                                                        marginBottom: "8px",
                                                                                        fontSize: "13px",
                                                                                        fontWeight: "600",
                                                                                        color: "#92400e"
                                                                                    }}>
                                                                                        <i className="fas fa-cloud-sun" style={{ marginRight: "8px" }} />
                                                                                        Climate: {location.climateType}
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
                                                                                    onClick={() => handleUpdateLocation(location)}
                                                                                    disabled={loading}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#3b82f6",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
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
                                                                                    onClick={() => handleStartEdit(location)}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#3b82f6",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
                                                                                >
                                                                                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteLocation(location.uri_id || location.id)}
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
                                                        No Locations Found
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Click refresh to load locations or create a new one
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Find Nearby Tab */}
                                    {activeTab === "nearby" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Find Nearby Locations
                                            </h3>

                                            {/* Search Form */}
                                            <div style={{
                                                backgroundColor: "#f8f9fa",
                                                padding: "30px",
                                                borderRadius: "15px",
                                                marginBottom: "30px"
                                            }}>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                            Latitude
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.000001"
                                                            value={nearbyLat}
                                                            onChange={(e) => setNearbyLat(e.target.value)}
                                                            placeholder="e.g., 36.8065"
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                fontSize: "14px",
                                                                borderRadius: "8px",
                                                                border: "2px solid #e0e0e0"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                            Longitude
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.000001"
                                                            value={nearbyLng}
                                                            onChange={(e) => setNearbyLng(e.target.value)}
                                                            placeholder="e.g., 10.1815"
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                fontSize: "14px",
                                                                borderRadius: "8px",
                                                                border: "2px solid #e0e0e0"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                            Radius (km)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={nearbyRadius}
                                                            onChange={(e) => setNearbyRadius(e.target.value)}
                                                            placeholder="50"
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                fontSize: "14px",
                                                                borderRadius: "8px",
                                                                border: "2px solid #e0e0e0"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                            Type (optional)
                                                        </label>
                                                        <select
                                                            value={nearbyType}
                                                            onChange={(e) => setNearbyType(e.target.value)}
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                fontSize: "14px",
                                                                borderRadius: "8px",
                                                                border: "2px solid #e0e0e0"
                                                            }}
                                                        >
                                                            <option value="">All Types</option>
                                                            <option value="City">City</option>
                                                            <option value="NaturalSite">Natural Site</option>
                                                            <option value="Region">Region</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2" style={{ display: "flex", alignItems: "flex-end" }}>
                                                        <button
                                                            onClick={handleFindNearby}
                                                            disabled={loading}
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                borderRadius: "8px",
                                                                border: "none",
                                                                backgroundColor: "#3b82f6",
                                                                color: "#fff",
                                                                cursor: loading ? "not-allowed" : "pointer"
                                                            }}
                                                        >
                                                            <i className="fas fa-search" style={{ marginRight: "8px" }} />
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Results */}
                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#3b82f6" }} />
                                                </div>
                                            ) : nearbyLocations.length > 0 ? (
                                                <div className="row">
                                                    {nearbyLocations.map((location, index) => {
                                                        const colors = getLocationColor(location.type);
                                                        return (
                                                            <div key={index} className="col-md-6 col-lg-4" style={{ marginBottom: "20px" }}>
                                                                <div style={{
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: "10px",
                                                                    padding: "20px",
                                                                    border: "2px solid #e0e0e0",
                                                                    height: "100%"
                                                                }}>
                                                                    <div style={{
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "flex-start",
                                                                        marginBottom: "15px"
                                                                    }}>
                                                                        <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#3b82f6", margin: 0 }}>
                                                                            {location.name || location.locationName}
                                                                        </h5>
                                                                        <span style={{
                                                                            padding: "4px 10px",
                                                                            backgroundColor: colors.bg,
                                                                            border: `1px solid ${colors.border}`,
                                                                            borderRadius: "15px",
                                                                            fontSize: "11px",
                                                                            fontWeight: "600",
                                                                            color: colors.text
                                                                        }}>
                                                                            {location.type}
                                                                        </span>
                                                                    </div>
                                                                    <div style={{ fontSize: "13px", color: "#666" }}>
                                                                        <i className="fas fa-map-pin" style={{ marginRight: "6px" }} />
                                                                        {typeof location.latitude === 'number' ? location.latitude.toFixed(4) : (parseFloat(location.latitude) || 0).toFixed(4)}, {typeof location.longitude === 'number' ? location.longitude.toFixed(4) : (parseFloat(location.longitude) || 0).toFixed(4)}
                                                                    </div>
                                                                    {location.distance && (
                                                                        <div style={{
                                                                            marginTop: "10px",
                                                                            padding: "8px 12px",
                                                                            backgroundColor: "#eff6ff",
                                                                            borderRadius: "6px",
                                                                            fontSize: "13px",
                                                                            fontWeight: "600",
                                                                            color: "#1e40af"
                                                                        }}>
                                                                            <i className="fas fa-route" style={{ marginRight: "6px" }} />
                                                                            {typeof location.distance === 'number' ? location.distance.toFixed(2) : (parseFloat(location.distance) || 0).toFixed(2)} km away
                                                                        </div>
                                                                    )}
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
                                                    <i className="fas fa-search-location" style={{ fontSize: "64px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                                                    <h4 style={{ fontSize: "22px", color: "#666", marginBottom: "10px", fontWeight: "600" }}>
                                                        Search for Nearby Locations
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Enter coordinates above and click Search
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Create Location Tab */}
                                    {activeTab === "create" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Create New Location
                                            </h3>

                                            {/* Location Type Selector */}
                                            <div style={{ marginBottom: "30px" }}>
                                                <label style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", display: "block" }}>
                                                    Location Type
                                                </label>
                                                <div style={{ display: "flex", gap: "15px" }}>
                                                    {[
                                                        { type: "City", icon: "city", color: "#3b82f6" },
                                                        { type: "NaturalSite", icon: "tree", color: "#10b981" },
                                                        { type: "Region", icon: "globe-americas", color: "#f59e0b" }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.type}
                                                            onClick={() => setLocationType(option.type)}
                                                            style={{
                                                                flex: 1,
                                                                padding: "20px",
                                                                fontSize: "16px",
                                                                fontWeight: "600",
                                                                borderRadius: "12px",
                                                                border: locationType === option.type ? `3px solid ${option.color}` : "2px solid #e0e0e0",
                                                                backgroundColor: locationType === option.type ? `${option.color}15` : "#fff",
                                                                color: locationType === option.type ? option.color : "#666",
                                                                cursor: "pointer",
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <i className={`fas fa-${option.icon}`} style={{ fontSize: "32px", display: "block", marginBottom: "10px" }} />
                                                            {option.type === "NaturalSite" ? "Natural Site" : option.type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Form */}
                                            <form onSubmit={handleCreateLocation}>
                                                {/* Basic Information */}
                                                <div style={{
                                                    backgroundColor: "#f8f9fa",
                                                    padding: "25px",
                                                    borderRadius: "12px",
                                                    marginBottom: "25px"
                                                }}>
                                                    <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#1a1a1a" }}>
                                                        Basic Information
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div style={{ marginBottom: "20px" }}>
                                                                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                    Name <span style={{ color: "#dc3545" }}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.name}
                                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                    placeholder="Enter location name"
                                                                    required
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "12px 15px",
                                                                        fontSize: "14px",
                                                                        borderRadius: "8px",
                                                                        border: "2px solid #e0e0e0"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div style={{ marginBottom: "20px" }}>
                                                                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                    Latitude
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.000001"
                                                                    value={formData.latitude}
                                                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                                                    placeholder="0.000000"
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "12px 15px",
                                                                        fontSize: "14px",
                                                                        borderRadius: "8px",
                                                                        border: "2px solid #e0e0e0"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div style={{ marginBottom: "20px" }}>
                                                                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                    Longitude
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.000001"
                                                                    value={formData.longitude}
                                                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                                                    placeholder="0.000000"
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "12px 15px",
                                                                        fontSize: "14px",
                                                                        borderRadius: "8px",
                                                                        border: "2px solid #e0e0e0"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div style={{ marginBottom: "20px" }}>
                                                                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                    Address
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.address}
                                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                                    placeholder="Enter address"
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "12px 15px",
                                                                        fontSize: "14px",
                                                                        borderRadius: "8px",
                                                                        border: "2px solid #e0e0e0"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div style={{ marginBottom: "0" }}>
                                                                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    value={formData.description}
                                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                                    placeholder="Enter description"
                                                                    rows={3}
                                                                    style={{
                                                                        width: "100%",
                                                                        padding: "12px 15px",
                                                                        fontSize: "14px",
                                                                        borderRadius: "8px",
                                                                        border: "2px solid #e0e0e0"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Type-specific Fields */}
                                                {locationType === "City" && (
                                                    <div style={{
                                                        backgroundColor: "#eff6ff",
                                                        padding: "25px",
                                                        borderRadius: "12px",
                                                        marginBottom: "25px"
                                                    }}>
                                                        <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#1e40af" }}>
                                                            <i className="fas fa-city" style={{ marginRight: "8px" }} />
                                                            City Information
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Population
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={formData.population}
                                                                        onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                                                                        placeholder="0"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #bfdbfe"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Postal Code
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={formData.postalCode}
                                                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                                        placeholder="Enter postal code"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #bfdbfe"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div style={{ marginBottom: "0" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Tourist Attractions
                                                                    </label>
                                                                    <textarea
                                                                        value={formData.touristAttractions}
                                                                        onChange={(e) => setFormData({ ...formData, touristAttractions: e.target.value })}
                                                                        placeholder="List main tourist attractions"
                                                                        rows={2}
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #bfdbfe"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {locationType === "NaturalSite" && (
                                                    <div style={{
                                                        backgroundColor: "#ecfdf5",
                                                        padding: "25px",
                                                        borderRadius: "12px",
                                                        marginBottom: "25px"
                                                    }}>
                                                        <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#065f46" }}>
                                                            <i className="fas fa-tree" style={{ marginRight: "8px" }} />
                                                            Natural Site Information
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={formData.protectedStatus}
                                                                            onChange={(e) => setFormData({ ...formData, protectedStatus: e.target.checked })}
                                                                            style={{ marginRight: "8px", width: "18px", height: "18px" }}
                                                                        />
                                                                        Protected Status
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Biodiversity Index
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        value={formData.biodiversityIndex}
                                                                        onChange={(e) => setFormData({ ...formData, biodiversityIndex: e.target.value })}
                                                                        placeholder="0.0"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #a7f3d0"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Area Size (Hectares)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={formData.areaSizeHectares}
                                                                        onChange={(e) => setFormData({ ...formData, areaSizeHectares: e.target.value })}
                                                                        placeholder="0.00"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #a7f3d0"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "0" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Entry Fee
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={formData.entryFee}
                                                                        onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                                                                        placeholder="0.00"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #a7f3d0"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {locationType === "Region" && (
                                                    <div style={{
                                                        backgroundColor: "#fef3c7",
                                                        padding: "25px",
                                                        borderRadius: "12px",
                                                        marginBottom: "25px"
                                                    }}>
                                                        <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#92400e" }}>
                                                            <i className="fas fa-globe-americas" style={{ marginRight: "8px" }} />
                                                            Region Information
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Climate Type
                                                                    </label>
                                                                    <select
                                                                        value={formData.climateType}
                                                                        onChange={(e) => setFormData({ ...formData, climateType: e.target.value })}
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #fde68a"
                                                                        }}
                                                                    >
                                                                        <option value="">Select climate type</option>
                                                                        {Object.values(CLIMATE_TYPES).map((climate) => (
                                                                            <option key={climate} value={climate}>{climate}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div style={{ marginBottom: "20px" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Region Area (km²)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={formData.regionArea}
                                                                        onChange={(e) => setFormData({ ...formData, regionArea: e.target.value })}
                                                                        placeholder="0.00"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #fde68a"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div style={{ marginBottom: "0" }}>
                                                                    <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                                                                        Main Attractions
                                                                    </label>
                                                                    <textarea
                                                                        value={formData.mainAttractions}
                                                                        onChange={(e) => setFormData({ ...formData, mainAttractions: e.target.value })}
                                                                        placeholder="Describe main attractions"
                                                                        rows={2}
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "12px 15px",
                                                                            fontSize: "14px",
                                                                            borderRadius: "8px",
                                                                            border: "2px solid #fde68a"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Submit Buttons */}
                                                <div style={{ display: "flex", gap: "15px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            name: "",
                                                            latitude: "",
                                                            longitude: "",
                                                            address: "",
                                                            description: "",
                                                            population: "",
                                                            postalCode: "",
                                                            touristAttractions: "",
                                                            protectedStatus: false,
                                                            biodiversityIndex: "",
                                                            areaSizeHectares: "",
                                                            entryFee: "",
                                                            climateType: "",
                                                            regionArea: "",
                                                            mainAttractions: ""
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
                                                            backgroundColor: loading ? "#ccc" : "#3b82f6",
                                                            color: "#fff",
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.3s ease"
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
                                                                Create {locationType === "NaturalSite" ? "Natural Site" : locationType}
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

export default LocationsPage;