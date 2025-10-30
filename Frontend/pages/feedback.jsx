import { useState, useEffect } from "react";
import Layout from "@/src/layout/Layout";
import {
    getAllFeedbacks,
    getFeedbackById,
    getActivityFeedback,
    submitFeedback,
    updateFeedback,
    deleteFeedback
} from "@/pages/api/feedback";

const FeedbackPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // all, byId, byActivity, create
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [activityStats, setActivityStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        limit: 100,
        offset: 0,
        min_rating: null,
        max_rating: null,
        user_name: ""
    });

    // Form states
    const [searchId, setSearchId] = useState("");
    const [searchActivityUri, setSearchActivityUri] = useState("");
    const [formData, setFormData] = useState({
        activity_uri: "",
        user_name: "",
        rating: 5,
        comment: ""
    });

    // Edit mode
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        activity_uri: "",
        user_name: "",
        rating: 5,
        comment: ""
    });

    // Pagination
    const [pagination, setPagination] = useState({
        total: 0,
        limit: 10,
        offset: 0,
        has_more: false
    });

    // Load all feedbacks on component mount
    useEffect(() => {
        if (activeTab === "all") {
            handleGetAllFeedbacks();
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

    const handleGetAllFeedbacks = async (customFilters = null) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const filtersToUse = customFilters || filters;

            // Build params object, only including non-null/non-empty values
            const params = {
                limit: filtersToUse.limit || 100, // Increase default limit
                offset: filtersToUse.offset || 0
            };

            if (filtersToUse.min_rating !== null && filtersToUse.min_rating !== undefined && filtersToUse.min_rating !== '') {
                params.min_rating = parseInt(filtersToUse.min_rating);
            }

            if (filtersToUse.max_rating !== null && filtersToUse.max_rating !== undefined && filtersToUse.max_rating !== '') {
                params.max_rating = parseInt(filtersToUse.max_rating);
            }

            if (filtersToUse.user_name && filtersToUse.user_name.trim()) {
                params.user_name = filtersToUse.user_name.trim();
            }

            console.log('Fetching feedbacks with params:', params);
            const data = await getAllFeedbacks(params);
            setFeedbacks(data.feedbacks || []);
            setPagination(data.pagination || {});

            let filterMsg = '';
            if (params.min_rating) filterMsg += ` (min rating: ${params.min_rating})`;
            if (params.max_rating) filterMsg += ` (max rating: ${params.max_rating})`;
            if (params.user_name) filterMsg += ` (user: ${params.user_name})`;

            setSuccess(`Loaded ${data.feedbacks?.length || 0} feedback(s)${filterMsg}`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to fetch feedbacks";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching feedbacks:", err);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGetFeedbackById = async () => {
        if (!searchId.trim()) {
            setError("Please enter a feedback ID");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getFeedbackById(searchId);
            setSelectedFeedback(data);
            setSuccess("Feedback found successfully");
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Feedback not found";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching feedback:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetActivityFeedback = async () => {
        if (!searchActivityUri.trim()) {
            setError("Please enter an activity URI");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const data = await getActivityFeedback(searchActivityUri);
            setFeedbacks(data.feedbacks || []);
            setActivityStats(data);
            setSuccess(`Found ${data.feedbacks?.length || 0} feedback(s) for this activity`);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "No feedbacks found for this activity";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error fetching activity feedback:", err);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!formData.activity_uri.trim()) {
            setError("Activity URI is required");
            return;
        }
        if (!formData.user_name.trim()) {
            setError("User name is required");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const dataToSend = {
                activity_uri: formData.activity_uri.trim(),
                user_name: formData.user_name.trim(),
                rating: parseInt(formData.rating),
                comment: formData.comment.trim()
            };

            console.log('Sending feedback data:', dataToSend);
            const result = await submitFeedback(dataToSend);
            console.log('Submit feedback result:', result);

            setSuccess("Feedback submitted successfully!");

            // Reset form
            setFormData({
                activity_uri: "",
                user_name: "",
                rating: 5,
                comment: ""
            });

            // Refresh feedbacks after a short delay
            setTimeout(() => {
                if (activeTab === "all") {
                    handleGetAllFeedbacks();
                }
            }, 500);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to submit feedback";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error submitting feedback:", err);
            console.error("Error response:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (feedback) => {
        setEditingId(feedback.id);
        setEditFormData({
            activity_uri: feedback.activity_uri || "",
            user_name: feedback.user_name || "",
            rating: feedback.rating || 5,
            comment: feedback.comment || ""
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({
            activity_uri: "",
            user_name: "",
            rating: 5,
            comment: ""
        });
    };

    const handleUpdateFeedback = async (feedbackId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await updateFeedback(feedbackId, editFormData);
            setSuccess("Feedback updated successfully!");
            setEditingId(null);
            // Refresh feedbacks
            if (activeTab === "all") {
                handleGetAllFeedbacks();
            } else if (activeTab === "byActivity" && searchActivityUri) {
                handleGetActivityFeedback();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to update feedback";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error updating feedback:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (!confirm("Are you sure you want to delete this feedback?")) {
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteFeedback(feedbackId);
            setSuccess("Feedback deleted successfully!");
            // Refresh feedbacks
            if (activeTab === "all") {
                handleGetAllFeedbacks();
            } else if (activeTab === "byActivity" && searchActivityUri) {
                handleGetActivityFeedback();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to delete feedback";
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            console.error("Error deleting feedback:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fas fa-star`}
                    style={{
                        color: i <= rating ? "#ffc107" : "#e0e0e0",
                        fontSize: "16px",
                        marginRight: "3px"
                    }}
                />
            );
        }
        return stars;
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div style={{
                    background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
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
                                            <i className="fas fa-comments" style={{ fontSize: "32px", color: "#fff" }} />
                                        </div>
                                        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: "700", margin: 0 }}>
                                            Feedback Management
                                        </h1>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: 0 }}>
                                        Manage and analyze customer feedback and reviews
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
                                        { id: "all", label: "All Feedbacks", icon: "list" },
                                        { id: "byId", label: "Search by ID", icon: "search" },
                                        { id: "byActivity", label: "By Activity", icon: "hiking" },
                                        { id: "create", label: "Submit Feedback", icon: "plus-circle" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setError(null);
                                                setSuccess(null);
                                                setSelectedFeedback(null);
                                                setActivityStats(null);
                                            }}
                                            style={{
                                                flex: 1,
                                                minWidth: "150px",
                                                padding: "20px 25px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                border: "none",
                                                backgroundColor: activeTab === tab.id ? "#9c27b0" : "transparent",
                                                color: activeTab === tab.id ? "#fff" : "#666",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                borderBottom: activeTab === tab.id ? "3px solid #7b1fa2" : "none"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = "#f3e5f5";
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
                                    {/* All Feedbacks Tab */}
                                    {activeTab === "all" && (
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                                                <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
                                                    All Feedbacks ({feedbacks.length})
                                                </h3>
                                                <button
                                                    onClick={handleGetAllFeedbacks}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "12px 30px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#9c27b0",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#7b1fa2";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#9c27b0";
                                                    }}
                                                >
                                                    <i className="fas fa-sync-alt" style={{ marginRight: "8px" }} />
                                                    Refresh
                                                </button>
                                            </div>

                                            {/* Filters */}
                                            <div style={{
                                                padding: "20px",
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "10px",
                                                marginBottom: "30px"
                                            }}>
                                                <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>Filters</h4>
                                                <div className="row">
                                                    <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                        <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                                                            Minimum Rating
                                                        </label>
                                                        <select
                                                            value={filters.min_rating === null ? "" : filters.min_rating}
                                                            onChange={(e) => setFilters({ ...filters, min_rating: e.target.value ? parseInt(e.target.value) : null })}
                                                            style={{
                                                                width: "100%",
                                                                padding: "10px",
                                                                borderRadius: "8px",
                                                                border: "1px solid #e0e0e0",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <option value="">Any</option>
                                                            <option value="1">1 Star</option>
                                                            <option value="2">2 Stars</option>
                                                            <option value="3">3 Stars</option>
                                                            <option value="4">4 Stars</option>
                                                            <option value="5">5 Stars</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                        <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                                                            Maximum Rating
                                                        </label>
                                                        <select
                                                            value={filters.max_rating === null ? "" : filters.max_rating}
                                                            onChange={(e) => setFilters({ ...filters, max_rating: e.target.value ? parseInt(e.target.value) : null })}
                                                            style={{
                                                                width: "100%",
                                                                padding: "10px",
                                                                borderRadius: "8px",
                                                                border: "1px solid #e0e0e0",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <option value="">Any</option>
                                                            <option value="1">1 Star</option>
                                                            <option value="2">2 Stars</option>
                                                            <option value="3">3 Stars</option>
                                                            <option value="4">4 Stars</option>
                                                            <option value="5">5 Stars</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                        <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                                                            User Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={filters.user_name}
                                                            onChange={(e) => setFilters({ ...filters, user_name: e.target.value })}
                                                            placeholder="Filter by user"
                                                            style={{
                                                                width: "100%",
                                                                padding: "10px",
                                                                borderRadius: "8px",
                                                                border: "1px solid #e0e0e0"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <button
                                                        onClick={() => handleGetAllFeedbacks(filters)}
                                                        disabled={loading}
                                                        style={{
                                                            marginTop: "15px",
                                                            padding: "10px 25px",
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                            borderRadius: "8px",
                                                            border: "none",
                                                            backgroundColor: "#9c27b0",
                                                            color: "#fff",
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#7b1fa2";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = "#9c27b0";
                                                        }}
                                                    >
                                                        <i className="fas fa-filter" style={{ marginRight: "8px" }} />
                                                        Apply Filters
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setFilters({
                                                                limit: 100,
                                                                offset: 0,
                                                                min_rating: null,
                                                                max_rating: null,
                                                                user_name: ""
                                                            });
                                                            handleGetAllFeedbacks({
                                                                limit: 100,
                                                                offset: 0,
                                                                min_rating: null,
                                                                max_rating: null,
                                                                user_name: ""
                                                            });
                                                        }}
                                                        disabled={loading}
                                                        style={{
                                                            marginTop: "15px",
                                                            padding: "10px 25px",
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                            borderRadius: "8px",
                                                            border: "1px solid #e0e0e0",
                                                            backgroundColor: "#fff",
                                                            color: "#666",
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#f8f9fa";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = "#fff";
                                                        }}
                                                    >
                                                        <i className="fas fa-times" style={{ marginRight: "8px" }} />
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "60px 0" }}>
                                                    <div className="spinner-border" style={{ width: "50px", height: "50px", color: "#9c27b0" }} />
                                                    <p style={{ marginTop: "20px", color: "#666", fontSize: "16px" }}>Loading feedbacks...</p>
                                                </div>
                                            ) : feedbacks.length > 0 ? (
                                                <div className="row">
                                                    {feedbacks.map((feedback, index) => {
                                                        const isEditing = editingId === feedback.id;

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
                                                                         e.currentTarget.style.boxShadow = "0 8px 25px rgba(156,39,176,0.15)";
                                                                         e.currentTarget.style.borderColor = "#9c27b0";
                                                                         e.currentTarget.style.transform = "translateY(-5px)";
                                                                     }}
                                                                     onMouseLeave={(e) => {
                                                                         e.currentTarget.style.boxShadow = "none";
                                                                         e.currentTarget.style.borderColor = "#e0e0e0";
                                                                         e.currentTarget.style.transform = "translateY(0)";
                                                                     }}>
                                                                    {/* Rating */}
                                                                    <div style={{
                                                                        position: "absolute",
                                                                        top: "15px",
                                                                        right: "15px",
                                                                        display: "flex",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        {renderStars(feedback.rating)}
                                                                    </div>

                                                                    {/* User Name */}
                                                                    <h4 style={{
                                                                        fontSize: "18px",
                                                                        fontWeight: "700",
                                                                        color: "#9c27b0",
                                                                        marginBottom: "15px",
                                                                        paddingRight: "100px"
                                                                    }}>
                                                                        <i className="fas fa-user-circle" style={{ marginRight: "8px" }} />
                                                                        {String(feedback.user_name || 'Anonymous')}
                                                                    </h4>

                                                                    {/* Feedback Details */}
                                                                    <div style={{ marginBottom: "15px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Activity URI:
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editFormData.activity_uri}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, activity_uri: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "8px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        User Name:
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editFormData.user_name}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, user_name: e.target.value })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "8px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Rating:
                                                                                    </label>
                                                                                    <select
                                                                                        value={editFormData.rating}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, rating: parseInt(e.target.value) })}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "8px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0",
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                    >
                                                                                        <option value="1">1 Star</option>
                                                                                        <option value="2">2 Stars</option>
                                                                                        <option value="3">3 Stars</option>
                                                                                        <option value="4">4 Stars</option>
                                                                                        <option value="5">5 Stars</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", display: "block", marginBottom: "5px" }}>
                                                                                        Comment:
                                                                                    </label>
                                                                                    <textarea
                                                                                        value={editFormData.comment}
                                                                                        onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                                                                                        rows={3}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            padding: "8px",
                                                                                            fontSize: "13px",
                                                                                            borderRadius: "6px",
                                                                                            border: "1px solid #e0e0e0",
                                                                                            resize: "vertical"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <i className="fas fa-hiking" style={{ color: "#666", marginRight: "8px", width: "16px" }} />
                                                                                    <span style={{ fontSize: "12px", color: "#666", wordBreak: "break-all" }}>
                                                                                        <strong>Activity:</strong> {String(feedback.activity_uri || 'N/A')}
                                                                                    </span>
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <i className="fas fa-comment-dots" style={{ color: "#666", marginRight: "8px", width: "16px" }} />
                                                                                    <span style={{ fontSize: "14px", color: "#333", fontStyle: "italic" }}>
                                                                                        "{String(feedback.comment || 'No comment')}"
                                                                                    </span>
                                                                                </div>
                                                                                <div style={{ marginBottom: "10px" }}>
                                                                                    <i className="fas fa-calendar" style={{ color: "#666", marginRight: "8px", width: "16px" }} />
                                                                                    <span style={{ fontSize: "13px", color: "#666" }}>
                                                                                        {feedback.created_at ? new Date(feedback.created_at).toLocaleDateString() : 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Action Buttons */}
                                                                    <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleUpdateFeedback(feedback.id)}
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
                                                                                    onClick={() => handleStartEdit(feedback)}
                                                                                    style={{
                                                                                        flex: 1,
                                                                                        padding: "10px",
                                                                                        fontSize: "14px",
                                                                                        fontWeight: "600",
                                                                                        borderRadius: "8px",
                                                                                        border: "none",
                                                                                        backgroundColor: "#9c27b0",
                                                                                        color: "#fff",
                                                                                        cursor: "pointer",
                                                                                        transition: "all 0.3s ease"
                                                                                    }}
                                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#7b1fa2"}
                                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#9c27b0"}
                                                                                >
                                                                                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteFeedback(feedback.id)}
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
                                                        No Feedbacks Found
                                                    </h4>
                                                    <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                        Click refresh to load feedbacks or submit a new one
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Search by ID Tab */}
                                    {activeTab === "byId" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Search Feedback by ID
                                            </h3>
                                            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                                                <input
                                                    type="text"
                                                    value={searchId}
                                                    onChange={(e) => setSearchId(e.target.value)}
                                                    placeholder="Enter feedback ID"
                                                    style={{
                                                        flex: 1,
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#9c27b0"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                                <button
                                                    onClick={handleGetFeedbackById}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "14px 40px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#9c27b0",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#7b1fa2";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#9c27b0";
                                                    }}
                                                >
                                                    <i className="fas fa-search" style={{ marginRight: "8px" }} />
                                                    Search
                                                </button>
                                            </div>

                                            {loading && (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#9c27b0" }} />
                                                </div>
                                            )}

                                            {selectedFeedback && !loading && (
                                                <div style={{
                                                    backgroundColor: "#f3e5f5",
                                                    borderRadius: "15px",
                                                    padding: "30px",
                                                    border: "2px solid #ce93d8"
                                                }}>
                                                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#9c27b0", marginBottom: "20px" }}>
                                                        <i className="fas fa-comment-dots" style={{ marginRight: "10px" }} />
                                                        Feedback Details
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>ID:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {String(selectedFeedback.id || 'N/A')}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>User Name:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {String(selectedFeedback.user_name || 'N/A')}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Rating:</strong>
                                                            <div style={{ marginTop: "5px" }}>
                                                                {renderStars(selectedFeedback.rating)}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Created At:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px" }}>
                                                                {selectedFeedback.created_at ? new Date(selectedFeedback.created_at).toLocaleString() : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-12" style={{ marginBottom: "15px" }}>
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Activity URI:</strong>
                                                            <p style={{ fontSize: "14px", color: "#1a1a1a", marginTop: "5px", wordBreak: "break-all" }}>
                                                                {String(selectedFeedback.activity_uri || 'N/A')}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <strong style={{ color: "#666", fontSize: "14px" }}>Comment:</strong>
                                                            <p style={{ fontSize: "16px", color: "#1a1a1a", marginTop: "5px", fontStyle: "italic" }}>
                                                                "{String(selectedFeedback.comment || 'No comment')}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Search by Activity Tab */}
                                    {activeTab === "byActivity" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Search Feedbacks by Activity
                                            </h3>
                                            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                                                <input
                                                    type="text"
                                                    value={searchActivityUri}
                                                    onChange={(e) => setSearchActivityUri(e.target.value)}
                                                    placeholder="Enter activity URI (e.g., http://www.ecotourism.org/ontology#Cultural_RomanRuins)"
                                                    style={{
                                                        flex: 1,
                                                        padding: "14px 18px",
                                                        fontSize: "15px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#9c27b0"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                                <button
                                                    onClick={handleGetActivityFeedback}
                                                    disabled={loading}
                                                    style={{
                                                        padding: "14px 40px",
                                                        fontSize: "15px",
                                                        fontWeight: "600",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        backgroundColor: "#9c27b0",
                                                        color: "#fff",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        transition: "all 0.3s ease",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) e.target.style.backgroundColor = "#7b1fa2";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = "#9c27b0";
                                                    }}
                                                >
                                                    <i className="fas fa-search" style={{ marginRight: "8px" }} />
                                                    Search
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div style={{ textAlign: "center", padding: "40px 0" }}>
                                                    <div className="spinner-border" style={{ width: "40px", height: "40px", color: "#9c27b0" }} />
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Activity Statistics */}
                                                    {activityStats && (
                                                        <div style={{
                                                            padding: "25px",
                                                            backgroundColor: "#f3e5f5",
                                                            borderRadius: "15px",
                                                            marginBottom: "30px",
                                                            border: "2px solid #ce93d8"
                                                        }}>
                                                            <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#9c27b0", marginBottom: "20px" }}>
                                                                Activity Statistics
                                                            </h4>
                                                            <div className="row">
                                                                <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                                    <div style={{ textAlign: "center" }}>
                                                                        <i className="fas fa-comments" style={{ fontSize: "32px", color: "#9c27b0", marginBottom: "10px" }} />
                                                                        <p style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a1a", margin: "0" }}>
                                                                            {activityStats.total_reviews || 0}
                                                                        </p>
                                                                        <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>Total Reviews</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                                    <div style={{ textAlign: "center" }}>
                                                                        <i className="fas fa-star" style={{ fontSize: "32px", color: "#ffc107", marginBottom: "10px" }} />
                                                                        <p style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a1a", margin: "0" }}>
                                                                            {activityStats.average_rating ? activityStats.average_rating.toFixed(1) : '0.0'}
                                                                        </p>
                                                                        <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>Average Rating</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4" style={{ marginBottom: "15px" }}>
                                                                    <div style={{ textAlign: "center" }}>
                                                                        <i className="fas fa-chart-bar" style={{ fontSize: "32px", color: "#10b981", marginBottom: "10px" }} />
                                                                        <p style={{ fontSize: "14px", color: "#666", margin: "10px 0 5px 0", fontWeight: "600" }}>Rating Distribution</p>
                                                                        {activityStats.rating_distribution && (
                                                                            <div style={{ fontSize: "12px", color: "#666" }}>
                                                                                {Object.entries(activityStats.rating_distribution).reverse().map(([rating, count]) => (
                                                                                    <div key={rating} style={{ marginBottom: "3px" }}>
                                                                                        {rating}★: {count}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Feedbacks List */}
                                                    {feedbacks.length > 0 && (
                                                        <div className="row">
                                                            {feedbacks.map((feedback, index) => (
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
                                                                             e.currentTarget.style.boxShadow = "0 8px 25px rgba(156,39,176,0.15)";
                                                                             e.currentTarget.style.borderColor = "#9c27b0";
                                                                         }}
                                                                         onMouseLeave={(e) => {
                                                                             e.currentTarget.style.boxShadow = "none";
                                                                             e.currentTarget.style.borderColor = "#e0e0e0";
                                                                         }}>
                                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                                                            <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#9c27b0", margin: 0 }}>
                                                                                {String(feedback.user_name || 'Anonymous')}
                                                                            </h5>
                                                                            <div>
                                                                                {renderStars(feedback.rating)}
                                                                            </div>
                                                                        </div>
                                                                        <p style={{ fontSize: "14px", color: "#333", fontStyle: "italic", marginBottom: "10px" }}>
                                                                            "{String(feedback.comment || 'No comment')}"
                                                                        </p>
                                                                        <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>
                                                                            {feedback.created_at ? new Date(feedback.created_at).toLocaleDateString() : 'N/A'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Feedback Tab */}
                                    {activeTab === "create" && (
                                        <div>
                                            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "25px" }}>
                                                Submit New Feedback
                                            </h3>
                                            <form onSubmit={handleSubmitFeedback}>
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
                                                                Activity URI <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.activity_uri}
                                                                onChange={(e) => setFormData({ ...formData, activity_uri: e.target.value })}
                                                                placeholder="e.g., http://www.ecotourism.org/ontology#Cultural_RomanRuins"
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#9c27b0"}
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
                                                                User Name <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={formData.user_name}
                                                                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                                                placeholder="Enter your name"
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#9c27b0"}
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
                                                                Rating <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <select
                                                                value={formData.rating}
                                                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
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
                                                                onFocus={(e) => e.target.style.borderColor = "#9c27b0"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            >
                                                                <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                                                                <option value="4">⭐⭐⭐⭐ Good (4 Stars)</option>
                                                                <option value="3">⭐⭐⭐ Average (3 Stars)</option>
                                                                <option value="2">⭐⭐ Poor (2 Stars)</option>
                                                                <option value="1">⭐ Terrible (1 Star)</option>
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
                                                                Comment <span style={{ color: "#dc3545" }}>*</span>
                                                            </label>
                                                            <textarea
                                                                value={formData.comment}
                                                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                                placeholder="Share your experience..."
                                                                required
                                                                rows={6}
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "14px 18px",
                                                                    fontSize: "15px",
                                                                    borderRadius: "10px",
                                                                    border: "2px solid #e0e0e0",
                                                                    transition: "all 0.3s ease",
                                                                    resize: "vertical"
                                                                }}
                                                                onFocus={(e) => e.target.style.borderColor = "#9c27b0"}
                                                                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            activity_uri: "",
                                                            user_name: "",
                                                            rating: 5,
                                                            comment: ""
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
                                                            backgroundColor: loading ? "#ccc" : "#9c27b0",
                                                            color: "#fff",
                                                            cursor: loading ? "not-allowed" : "pointer",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#7b1fa2";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!loading) e.target.style.backgroundColor = "#9c27b0";
                                                        }}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-paper-plane" style={{ marginRight: "8px" }} />
                                                                Submit Feedback
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

export default FeedbackPage;