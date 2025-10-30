import { useState, useEffect } from "react";
import Layout from "@/src/layout/Layout";
import {
    getAllBookings,
    getBookingById,
    getBookingsByTourist,
    createBooking,
    updateBooking,
    deleteBooking,
    BOOKING_STATUS
} from "@/pages/api/booking";

const BookingsPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // all, byId, byTourist, create
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Form states
    const [searchId, setSearchId] = useState("");
    const [searchTouristId, setSearchTouristId] = useState("");
    const [formData, setFormData] = useState({
        booking_id: "",
        tourist_id: "",
        booking_date: new Date().toISOString().split('T')[0],
        booking_status: BOOKING_STATUS.CONFIRMED,
        confirmation_code: ""
    });

    // Edit mode
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        booking_date: "",
        booking_status: ""
    });

    // Load all bookings on component mount
    useEffect(() => {
        if (activeTab === "all") {
            handleGetAllBookings();
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

    const handleGetAllBookings = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getAllBookings();
            console.log('All bookings data:', data);

            // Ensure we have an array
            const bookingsList = Array.isArray(data?.bookings) ? data.bookings :
                Array.isArray(data) ? data : [];

            setBookings(bookingsList);
            setSuccess(`Loaded ${data?.count || bookingsList.length} booking(s)`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch bookings";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching bookings:", err);
            setBookings([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleGetBookingById = async () => {
        if (!searchId.trim()) {
            setError("Please enter a booking ID");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getBookingById(searchId);
            setSelectedBooking(data);
            setSuccess("Booking found successfully");
        } catch (err) {
            setError(err.response?.data?.detail || "Booking not found");
            console.error("Error fetching booking:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetBookingsByTourist = async () => {
        if (!searchTouristId.trim()) {
            setError("Please enter a tourist ID");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getBookingsByTourist(searchTouristId);
            setBookings(data.bookings || []);
            setSuccess(`Found ${data.count || 0} booking(s) for tourist ${searchTouristId}`);
        } catch (err) {
            setError(err.response?.data?.detail || "No bookings found for this tourist");
            console.error("Error fetching bookings by tourist:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        if (!formData.tourist_id.trim()) {
            setError("Tourist ID is required");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Clean the tourist ID - remove "tourist_" prefix if present
            const cleanTouristId = formData.tourist_id.replace(/^tourist_/i, '').trim();

            // Prepare the data for the API
            const dataToSend = {
                tourist_id: cleanTouristId,
                booking_date: formData.booking_date,
                booking_status: formData.booking_status
            };

            // Only add optional fields if they have values
            if (formData.booking_id && formData.booking_id.trim()) {
                dataToSend.booking_id = formData.booking_id.trim();
            }

            if (formData.confirmation_code && formData.confirmation_code.trim()) {
                dataToSend.confirmation_code = formData.confirmation_code.trim();
            }

            console.log('Sending booking data:', dataToSend);
            const result = await createBooking(dataToSend);
            console.log('Create booking result:', result);

            // Check if result has a message or success indicator
            const successMessage = result?.message || "Booking created successfully!";
            setSuccess(successMessage);

            // Reset form
            setFormData({
                booking_id: "",
                tourist_id: "",
                booking_date: new Date().toISOString().split('T')[0],
                booking_status: BOOKING_STATUS.CONFIRMED,
                confirmation_code: ""
            });

            // Refresh bookings after a short delay
            setTimeout(() => {
                if (activeTab === "all") {
                    handleGetAllBookings();
                }
            }, 500);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to create booking";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error creating booking:", err);
            console.error("Error response:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (booking) => {
        setEditingId(booking.booking_id);
        setEditFormData({
            booking_date: booking.booking_date?.split('T')[0] || "",
            booking_status: booking.booking_status || BOOKING_STATUS.CONFIRMED
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({
            booking_date: "",
            booking_status: ""
        });
    };

    const handleUpdateBooking = async (bookingId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await updateBooking(bookingId, editFormData);
            setSuccess("Booking updated successfully!");
            setEditingId(null);
            // Refresh bookings
            if (activeTab === "all") {
                handleGetAllBookings();
            } else if (activeTab === "byTourist" && searchTouristId) {
                handleGetBookingsByTourist();
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update booking");
            console.error("Error updating booking:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!confirm("Are you sure you want to delete this booking?")) {
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteBooking(bookingId);
            setSuccess("Booking deleted successfully!");
            // Refresh bookings
            if (activeTab === "all") {
                handleGetAllBookings();
            } else if (activeTab === "byTourist" && searchTouristId) {
                handleGetBookingsByTourist();
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete booking");
            console.error("Error deleting booking:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return { bg: "#d4edda", border: "#c3e6cb", text: "#155724", icon: "check-circle" };
            case "pending":
                return { bg: "#fff3cd", border: "#ffc107", text: "#856404", icon: "clock" };
            case "cancelled":
                return { bg: "#f8d7da", border: "#f5c6cb", text: "#721c24", icon: "times-circle" };
            default:
                return { bg: "#e7f5ff", border: "#00B4D8", text: "#00B4D8", icon: "info-circle" };
        }
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div style={{
                    background: "linear-gradient(135deg, #00B4D8 0%, #0098b8 100%)",
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
                                            <i className="fas fa-calendar-check" style={{ fontSize: "32px", color: "#fff" }} />
                                        </div>
                                        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", margin: 0 }}>
                                            Bookings Management
                                        </h1>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                                        Manage all your travel bookings in one place
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
                                        { id: "all", label: "All Bookings", icon: "list" },
                                        { id: "byId", label: "Search by ID", icon: "search" },
                                        { id: "byTourist", label: "By Tourist", icon: "user" },
                                        { id: "create", label: "Create Booking", icon: "plus-circle" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setError(null);
                                                setSuccess(null);
                                                setSelectedBooking(null);
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: "150px",
                                                padding: "20px 25px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                border: "none",
                                                backgroundColor: activeTab === tab.id ? "#00B4D8" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#666",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                borderBottom: activeTab === tab.id ? "3px solid #0098b8" : "none"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = "#f0f9ff";
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
                                    {/* All Bookings Tab */}
                                    {activeTab === "all" && (
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                                                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                    All Bookings ({bookings.length})
                                                </h3>
                                                <button
                                                    onClick={handleGetAllBookings}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "12px 30px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#00B4D8",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#0098b8";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#00B4D8";
                                                    }}
                                                >
                                                    <i className="fas fa-sync-alt" style={{ marginRight: "8px" }} />
                                                    Refresh
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "60px 0" }}>
                                                    <div className="spinner-border" style={{ width: "50px", height: "50px", color: "#00B4D8" }} />
                                                    <p style={{ marginTop: "20px", color: "#666", fontSize: "16px" }}>Loading bookings...</p>
                                                </div>
                                            ) : bookings.length > 0 ? (
                                                <div className="row">
                                                    {bookings.map((booking, index) => {
                                                        const statusColors = getStatusColor(booking.booking_status);
                                                        const isEditing = editingId === booking.booking_id;

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
                                                                         e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,180,216,0.15)";
                                                                         e.currentTarget.style.borderColor = "#00B4D8";
                                                                         e.currentTarget.style.transform = "translateY(-5px)";
                                                                     }}
                                                                     onMouseLeave={(e) => {
                                                                         e.currentTarget.style.boxShadow = "none";
                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                         e.currentTarget.style.transform = "translateY(0)";
                                                                     }}>
                                                                    {/* Status Badge */}
                                                                    <div style={{
                                                                        position: "absolute",
                                                                        top: "15px",
                                                                        right: "15px",
                                                                        padding: "6px 12px",
                                                                        backgroundColor: statusColors.bg,
                                                                        border: `1px solid ${statusColors.border}`,
                                                                        borderRadius: "20px",
                                                                        fontSize: "12px",
                                                                        fontWeight: "700",
                                                                        color: statusColors.text,
                                                                        textTransform: "uppercase",
                                                                        display: "flex",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        <i className={`fas fa-${statusColors.icon}`} style={{ marginRight: "6px" }} />
                                                                        {String(booking.booking_status || 'unknown')}
                                                                    </div>

                                                                    {/* Booking ID */}
                                                                    <h4 style={{
                                                                        fontSize: "18px",
                                                                        fontWeight: "700",
                                                                        color: "#00B4D8",
                                                                        marginBottom: "15px",
                                                                        paddingRight: "100px"
                                                                    }}>
                                                                        <i className="fas fa-ticket-alt" style={{ marginRight: "8px" }} />
                                                                        {String(booking.booking_id || 'N/A')}
                                                                    </h4>

                                                                    {/* Booking Details */}
                                                                    <div style={{ marginBottom: "15px" }}>
                                                                        <div style={{ marginBottom: "10px" }}>
                                                                            <i className="fas fa-user" style={{ color: "#666", marginRight: "8px", width: "16px" }} />
                                                                            <span style={{ fontSize: "14px", color: "#666" }}>
                                                                                <strong>Tourist:</strong> {String(booking.tourist_id || 'N/A')}
                                                                            </span>
                                                                        </div>

                                                                        {isEditing ? (
                                                                            <>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Date:
                                                                                    </label>
                                                                                    <input
                                                                                        type="date"
                                                                                        value={editFormData.booking_date}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, booking_date: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "8px",
                                                                                            fontSize: "14px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Status:
                                                                                    </label>
                                                                                    <select
                                                                                        value={editFormData.booking_status}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, booking_status: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "8px",
                                                                                            fontSize: "14px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0",
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                    >
                                                                                        <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
                                                                                        <option value={BOOKING_STATUS.PENDING}>Pending</option>
                                                                                        <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                                                                                    </select>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <i className="fas fa-calendar" style={{ color: "#666", marginRight: "8px", width: "16px" }} />
                                                                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                                                                        <strong>Date:</strong> {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                                {booking.confirmation_code && (
                                                                                    <div style={{ marginBottom: "10px" }}>
                                                                                        <i className="fas fa-barcode" style={{ color: "#666", marginRight: "8px", width: "16px" }} />
                                                                                        <span style={{ fontSize: "14px", color: "#666" }}>
                                                                                            <strong>Code:</strong> {String(booking.confirmation_code)}
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
                                                                                    onClick={() => handleUpdateBooking(booking.booking_id)}
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
                                                                                    onClick={() => handleStartEdit(booking)}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#00B4D8",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#0098b8"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#00B4D8"}
                                                                                >
                                                                                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteBooking(booking.booking_id)}
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
                                                        No Bookings Found
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Click refresh to load bookings or create a new one
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Search by ID Tab */}
                                    {activeTab === "byId" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Search Booking by ID
                                            </h3>
                                            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                                                <input
                                                    type="text"
                                                    value={searchId}
                                                    onChange={(e) => setSearchId(e.target.value)}
                                                    placeholder="Enter booking ID (e.g., BKG-001)"
                                                    style={{
                                                        flex: 1,
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                                <button
                                                    onClick={handleGetBookingById}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "14px 40px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#00B4D8",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#0098b8";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#00B4D8";
                                                    }}
                                                >
                                                    <i className="fas fa-search" style={{ marginRight: "8px" }} />
                                                    Search
                                                </button>
                                            </div>

                                            {loading && (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#00B4D8" }} />
                                                </div>
                                            )}

                                            {selectedBooking && !loading && (
                                                <div style={{
                                                    backgroundColor: "#f0f9ff",
                                                    borderRadius: "15px",
                                                    padding: "30px",
                                                    border: "2px solid #bfe6ff"
                                                }}>
                                                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#00B4D8", marginBottom: "20px" }}>
                                                        <i className="fas fa-ticket-alt" style={{ marginRight: "10px" }} />
                                                        Booking Details
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Booking ID:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {String(selectedBooking.booking_id || 'N/A')}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Tourist ID:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {String(selectedBooking.tourist_id || 'N/A')}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Booking Date:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedBooking.booking_date ? new Date(selectedBooking.booking_date).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Status:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px", textTransform: "capitalize" }}>
                                                                {String(selectedBooking.booking_status || 'N/A')}
                                                            </p>
                                                        </div>
                                                        {selectedBooking.confirmation_code && (
                                                            <div className="col-md-12" style={{ marginBottom: "15px" }}>
                                                                <strong style={{ color: "#666", fontSize: "14px" }}>Confirmation Code:</strong>
                                                                <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                    {String(selectedBooking.confirmation_code)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Search by Tourist Tab */}
                                    {activeTab === "byTourist" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Search Bookings by Tourist
                                            </h3>
                                            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                                                <input
                                                    type="text"
                                                    value={searchTouristId}
                                                    onChange={(e) => setSearchTouristId(e.target.value)}
                                                    placeholder="Enter tourist ID (e.g., tourist_123)"
                                                    style={{
                                                        flex: 1,
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                                <button
                                                    onClick={handleGetBookingsByTourist}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "14px 40px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#00B4D8",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#0098b8";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#00B4D8";
                                                    }}
                                                >
                                                    <i className="fas fa-search" style={{ marginRight: "8px" }} />
                                                    Search
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#00B4D8" }} />
                                                </div>
                                            ) : bookings.length > 0 ? (
                                                <div className="row">
                                                    {bookings.map((booking, index) => {
                                                        const statusColors = getStatusColor(booking.booking_status);
                                                        return (
                                                            <div key={index} className="col-lg-6" style={{ marginBottom: "25px" }}>
                                                                <div style={{
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: "15px",
                                                                    padding: "25px",
                                                                    border: "2px solid #e0e0e0",
                                                                    height: "100%",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                     onMouseEnter={(e) => {
                                                                         e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,180,216,0.15)";
                                                                         e.currentTarget.style.borderColor = "#00B4D8";
                                                                     }}
                                                                     onMouseLeave={(e) => {
                                                                         e.currentTarget.style.boxShadow = "none";
                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                     }}>
                                                                    <div style={{
                                                                        display: "inline-block",
                                                                        padding: "6px 12px",
                                                                        backgroundColor: statusColors.bg,
                                                                        border: `1px solid ${statusColors.border}`,
                                                                        borderRadius: "20px",
                                                                        fontSize: "12px",
                                                                        fontWeight: "700",
                                                                        color: statusColors.text,
                                                                        textTransform: "uppercase",
                                                                        marginBottom: "15px"
                                                                    }}>
                                                                        <i className={`fas fa-${statusColors.icon}`} style={{ marginRight: "6px" }} />
                                                                        {booking.booking_status}
                                                                    </div>
                                                                    <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#00B4D8", marginBottom: "15px" }}>
                                                                        {booking.booking_id}
                                                                    </h4>
                                                                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                                                                        <i className="fas fa-calendar" style={{ marginRight: "8px", width: "16px" }} />
                                                                        <strong>Date:</strong> {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                                                                    </div>
                                                                    {booking.confirmation_code && (
                                                                        <div style={{ fontSize: "14px", color: "#666" }}>
                                                                            <i className="fas fa-barcode" style={{ marginRight: "8px", width: "16px" }} />
                                                                            <strong>Code:</strong> {booking.confirmation_code}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : null}
                                        </div>
                                    )}

                                    {/* Create Booking Tab */}
                                    {activeTab === "create" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Create New Booking
                                            </h3>
                                            <form onSubmit={handleCreateBooking}>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Booking ID <span style={{ fontSize: "12px", fontWeight: "400", color: "#666" }}>(optional)</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.booking_id}
                                                                onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                                                                placeholder="e.g., BKG-001"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
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
                                                                Tourist ID <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.tourist_id}
                                                                onChange={(e) => setFormData({ ...formData, tourist_id: e.target.value })}
                                                                placeholder="e.g., d60cf620 or tourist_d60cf620"
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                            <small style={{ fontSize: "12px", color: "#666", marginTop: "5px", display: "block" }}>
                                                                Enter just the ID (e.g., d60cf620) without prefix
                                                            </small>
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
                                                                Booking Date <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={formData.booking_date}
                                                                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
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
                                                                Status <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <select
                                                                value={formData.booking_status}
                                                                onChange={(e) => setFormData({ ...formData, booking_status: e.target.value })}
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease",
                                                                    cursor: "pointer"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            >
                                                                <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
                                                                <option value={BOOKING_STATUS.PENDING}>Pending</option>
                                                                <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div style={{ marginBottom: "25px" }}>
                                                            <label style={{
                                                                display: "block",
                                                                marginBottom: "10px",
                                                                fontSize: "15px",
                                                                fontWeight: "600",
                                                                color: "#1a1a1a"
                                                            }}>
                                                                Confirmation Code <span style={{ fontSize: "12px", fontWeight: "400", color: "#666" }}>(optional)</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.confirmation_code}
                                                                onChange={(e) => setFormData({ ...formData, confirmation_code: e.target.value })}
                                                                placeholder="e.g., CONF123456"
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            booking_id: "",
                                                            tourist_id: "",
                                                            booking_date: new Date().toISOString().split('T')[0],
                                                            booking_status: BOOKING_STATUS.CONFIRMED,
                                                            confirmation_code: ""
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
                                                                Create Booking
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

export default BookingsPage;