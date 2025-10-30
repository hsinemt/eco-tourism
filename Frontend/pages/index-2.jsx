import { useState } from "react";
import Layout from "@/src/layout/Layout";
import { queryNLP, analyzeQuestion } from "@/pages/api/nlp";

const Index2 = () => {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [useAdvancedNLP, setUseAdvancedNLP] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim()) {
            setError("Please enter a question");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const data = await queryNLP(question, useAdvancedNLP);
            console.log('Query results:', data);
            setResults(data);
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred while processing your query");
            console.error("Query error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuestion("");
        setResults(null);
        setError(null);
    };

    // Function to get appropriate icon for field type
    const getFieldIcon = (key) => {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('activity') || keyLower.includes('name')) return { icon: "fas fa-hiking", color: "#00B4D8" };
        if (keyLower.includes('description')) return { icon: "fas fa-align-left", color: "#607d8b" };
        if (keyLower.includes('price') || keyLower.includes('cost')) return { icon: "fas fa-euro-sign", color: "#ffc107" };
        if (keyLower.includes('duration') || keyLower.includes('hours')) return { icon: "fas fa-clock", color: "#ff9800" };
        if (keyLower.includes('difficulty')) return { icon: "fas fa-signal", color: "#f44336" };
        if (keyLower.includes('rating')) return { icon: "fas fa-star", color: "#ffc107" };
        if (keyLower.includes('participant') || keyLower.includes('capacity') || keyLower.includes('guest')) return { icon: "fas fa-users", color: "#9c27b0" };
        if (keyLower.includes('age')) return { icon: "fas fa-child", color: "#ff9800" };
        if (keyLower.includes('date')) return { icon: "fas fa-calendar", color: "#00B4D8" };
        if (keyLower.includes('location') || keyLower.includes('address')) return { icon: "fas fa-map-marker-alt", color: "#e91e63" };
        if (keyLower.includes('eco') || keyLower.includes('environment')) return { icon: "fas fa-leaf", color: "#4caf50" };
        if (keyLower.includes('accommodation') || keyLower.includes('hotel')) return { icon: "fas fa-hotel", color: "#9c27b0" };
        return { icon: "fas fa-info-circle", color: "#00B4D8" };
    };

    return (
        <Layout header={2} extraClass={"pt-160"}>
            {/*====== Start Hero Section ======*/}
            <section className="hero-section">
                <div className="hero-wrapper-two">
                    <div className="single-slider">
                        <div
                            className="image-layer bg_cover"
                            style={{
                                backgroundImage: "url(assets/images/hero/hero-two_img-1.jpg)",
                            }}
                        />
                        <div className="container-fluid">
                            <div className="row justify-content-center">
                                <div className="col-xl-9">
                                    <div className="hero-content text-white text-center">
                                        <span className="ribbon">Smart Query System</span>
                                        <h1 data-animation="fadeInDown" data-delay=".4s">
                                            Natural Language Query Interface
                                        </h1>
                                        <p className="text-white" style={{ fontSize: "18px", marginTop: "20px" }}>
                                            Ask questions in natural language and get instant, intelligent results
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Hero Section ======*/}

            {/*====== Start Query Section ======*/}
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
                                    <span className="sub-title" style={{
                                        fontSize: "16px",
                                        color: "#00B4D8",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "2px"
                                    }}>
                                        Query Interface
                                    </span>
                                    <h2 style={{ fontSize: "42px", marginTop: "15px", color: "#1a1a1a", fontWeight: "700" }}>
                                        Ask Your Question
                                    </h2>
                                    <p style={{ color: "#666", marginTop: "15px", fontSize: "17px", maxWidth: "600px", margin: "15px auto 0" }}>
                                        Enter your question in natural language and get instant results from our knowledge base
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form_group" style={{ marginBottom: "30px" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "12px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#1a1a1a"
                                                }}>
                                                    Enter your question <span style={{ color: "#ff4444" }}>*</span>
                                                </label>
                                                <textarea
                                                    className="form_control"
                                                    placeholder="e.g., What cultural activities are available in Tunisia?"
                                                    value={question}
                                                    onChange={(e) => setQuestion(e.target.value)}
                                                    rows={4}
                                                    style={{
                                                        width: "100%",
                                                        padding: "20px",
                                                        fontSize: "16px",
                                                        borderRadius: "10px",
                                                        border: "2px solid #e0e0e0",
                                                        backgroundColor: "#fff",
                                                        transition: "all 0.3s ease",
                                                        resize: "vertical",
                                                        fontFamily: "inherit",
                                                        lineHeight: "1.6"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                                                />
                                            </div>
                                        </div>

                                        {/*<div className="col-lg-12">*/}
                                        {/*    <div className="form_group" style={{ marginBottom: "30px" }}>*/}
                                        {/*        <label style={{*/}
                                        {/*            display: "flex",*/}
                                        {/*            alignItems: "center",*/}
                                        {/*            cursor: "pointer",*/}
                                        {/*            fontSize: "15px",*/}
                                        {/*            color: "#333"*/}
                                        {/*        }}>*/}
                                        {/*            <input*/}
                                        {/*                type="checkbox"*/}
                                        {/*                checked={useAdvancedNLP}*/}
                                        {/*                onChange={(e) => setUseAdvancedNLP(e.target.checked)}*/}
                                        {/*                style={{*/}
                                        {/*                    marginRight: "10px",*/}
                                        {/*                    width: "18px",*/}
                                        {/*                    height: "18px",*/}
                                        {/*                    cursor: "pointer"*/}
                                        {/*                }}*/}
                                        {/*            />*/}
                                        {/*            Use Advanced NLP Processing*/}
                                        {/*        </label>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger" style={{
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

                                    <div className="form_group text-center">
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            style={{
                                                padding: "16px 35px",
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
                                            <i className="fas fa-eraser" style={{ marginRight: "8px" }} />
                                            Clear
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !question.trim()}
                                            style={{
                                                padding: "16px 45px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                borderRadius: "10px",
                                                border: "2px solid #00B4D8",
                                                backgroundColor: "#00B4D8",
                                                color: "#fff",
                                                cursor: loading || !question.trim() ? "not-allowed" : "pointer",
                                                transition: "all 0.3s ease",
                                                opacity: loading || !question.trim() ? 0.6 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading && question.trim()) {
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
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-search" style={{ marginRight: "10px" }} />
                                                    Search
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Results Display */}
                                {results && (
                                    <div className="results-section" style={{ marginTop: "60px" }}>
                                        <div className="results-header text-center mb-50">
                                            <span className="badge" style={{
                                                backgroundColor: "#e7f5ff",
                                                color: "#00B4D8",
                                                padding: "10px 25px",
                                                borderRadius: "25px",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                display: "inline-block",
                                                marginBottom: "20px",
                                                textTransform: "uppercase",
                                                letterSpacing: "1px"
                                            }}>
                                                <i className="fas fa-check-circle" style={{ marginRight: "8px" }} />
                                                Results Found
                                            </span>
                                            <h3 style={{
                                                fontSize: "32px",
                                                color: "#1a1a1a",
                                                fontWeight: "700",
                                                marginBottom: "15px"
                                            }}>
                                                Query Results
                                            </h3>
                                        </div>

                                        {/* Query Info Box */}
                                        {results.query && (
                                            <div style={{
                                                padding: "25px 30px",
                                                backgroundColor: "#f0f9ff",
                                                borderRadius: "12px",
                                                border: "2px solid #bfe6ff",
                                                borderLeft: "5px solid #00B4D8",
                                                marginBottom: "40px"
                                            }}>
                                                <h5 style={{
                                                    marginBottom: "10px",
                                                    color: "#00B4D8",
                                                    fontSize: "14px",
                                                    fontWeight: "700",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "1px"
                                                }}>
                                                    <i className="fas fa-question-circle" style={{ marginRight: "8px" }} />
                                                    Your Question
                                                </h5>
                                                <p style={{
                                                    marginBottom: "0",
                                                    fontSize: "16px",
                                                    color: "#1a1a1a",
                                                    lineHeight: "1.6",
                                                    fontWeight: "500"
                                                }}>
                                                    {results.query}
                                                </p>
                                            </div>
                                        )}

                                        {/* Results Cards */}
                                        {results.results && results.results.length > 0 ? (
                                            <div>
                                                {results.results.map((result, resultIndex) => (
                                                    <div
                                                        key={resultIndex}
                                                        style={{
                                                            backgroundColor: "#fff",
                                                            borderRadius: "15px",
                                                            padding: "40px",
                                                            marginBottom: "30px",
                                                            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                                            border: "2px solid #f0f0f0",
                                                            transition: "all 0.3s ease"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,180,216,0.15)";
                                                            e.currentTarget.style.borderColor = "#00B4D8";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)";
                                                            e.currentTarget.style.borderColor = "#f0f0f0";
                                                        }}
                                                    >
                                                        {/* Result Header */}
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginBottom: "30px",
                                                            paddingBottom: "20px",
                                                            borderBottom: "3px solid #00B4D8"
                                                        }}>
                                                            <div style={{
                                                                width: "60px",
                                                                height: "60px",
                                                                background: "linear-gradient(135deg, #00B4D8 0%, #0098b8 100%)",
                                                                borderRadius: "15px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                marginRight: "20px",
                                                                flexShrink: 0,
                                                                boxShadow: "0 4px 15px rgba(0,180,216,0.3)"
                                                            }}>
                                                                <span style={{
                                                                    fontSize: "24px",
                                                                    color: "#fff",
                                                                    fontWeight: "700"
                                                                }}>
                                                                    {resultIndex + 1}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 style={{
                                                                    margin: 0,
                                                                    fontSize: "26px",
                                                                    color: "#1a1a1a",
                                                                    fontWeight: "700"
                                                                }}>
                                                                    Result {resultIndex + 1}
                                                                </h3>
                                                                {Object.keys(result).length > 0 && (
                                                                    <span style={{
                                                                        fontSize: "13px",
                                                                        color: "#666",
                                                                        marginTop: "5px",
                                                                        display: "block"
                                                                    }}>
                                                                        {Object.keys(result).length} field{Object.keys(result).length !== 1 ? 's' : ''} found
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Fields Grid */}
                                                        <div className="row">
                                                            {Object.entries(result).map(([key, value], fieldIndex) => {
                                                                const { icon, color } = getFieldIcon(key);
                                                                const isUrl = value && value.toString().startsWith('http');

                                                                return (
                                                                    <div key={fieldIndex} className="col-lg-6 col-md-6" style={{ marginBottom: "20px" }}>
                                                                        <div style={{
                                                                            padding: "25px",
                                                                            backgroundColor: "#f8f9fa",
                                                                            borderRadius: "12px",
                                                                            border: "2px solid #e8e8e8",
                                                                            height: "100%",
                                                                            transition: "all 0.3s ease",
                                                                            display: "flex",
                                                                            flexDirection: "column"
                                                                        }}
                                                                             onMouseEnter={(e) => {
                                                                                 e.currentTarget.style.backgroundColor = "#fff";
                                                                                 e.currentTarget.style.borderColor = color;
                                                                                 e.currentTarget.style.transform = "translateY(-3px)";
                                                                                 e.currentTarget.style.boxShadow = `0 8px 20px ${color}20`;
                                                                             }}
                                                                             onMouseLeave={(e) => {
                                                                                 e.currentTarget.style.backgroundColor = "#f8f9fa";
                                                                                 e.currentTarget.style.borderColor = "#e8e8e8";
                                                                                 e.currentTarget.style.transform = "translateY(0)";
                                                                                 e.currentTarget.style.boxShadow = "none";
                                                                             }}>
                                                                            {/* Field Label with Icon */}
                                                                            <div style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                marginBottom: "15px"
                                                                            }}>
                                                                                <div style={{
                                                                                    width: "40px",
                                                                                    height: "40px",
                                                                                    backgroundColor: `${color}15`,
                                                                                    borderRadius: "10px",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center",
                                                                                    marginRight: "12px",
                                                                                    flexShrink: 0
                                                                                }}>
                                                                                    <i className={icon} style={{ color: color, fontSize: "18px" }} />
                                                                                </div>
                                                                                <div style={{ flex: 1 }}>
                                                                                    <span style={{
                                                                                        fontSize: "13px",
                                                                                        fontWeight: "700",
                                                                                        color: color,
                                                                                        textTransform: "uppercase",
                                                                                        letterSpacing: "0.5px",
                                                                                        display: "block",
                                                                                        lineHeight: "1.2"
                                                                                    }}>
                                                                                        {key.replace(/_/g, " ")}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Field Value */}
                                                                            <div style={{
                                                                                fontSize: "15px",
                                                                                color: "#333",
                                                                                lineHeight: "1.6",
                                                                                wordBreak: "break-word",
                                                                                flex: 1
                                                                            }}>
                                                                                {value ? (
                                                                                    isUrl ? (
                                                                                        <a
                                                                                            href={value}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            style={{
                                                                                                color: "#00B4D8",
                                                                                                textDecoration: "none",
                                                                                                display: "inline-flex",
                                                                                                alignItems: "center",
                                                                                                gap: "8px",
                                                                                                wordBreak: "break-all",
                                                                                                padding: "10px 15px",
                                                                                                backgroundColor: "#f0f9ff",
                                                                                                borderRadius: "8px",
                                                                                                transition: "all 0.3s ease"
                                                                                            }}
                                                                                            onMouseEnter={(e) => {
                                                                                                e.currentTarget.style.backgroundColor = "#e7f5ff";
                                                                                                e.currentTarget.style.textDecoration = "underline";
                                                                                            }}
                                                                                            onMouseLeave={(e) => {
                                                                                                e.currentTarget.style.backgroundColor = "#f0f9ff";
                                                                                                e.currentTarget.style.textDecoration = "none";
                                                                                            }}
                                                                                        >
                                                                                            <i className="fas fa-external-link-alt" style={{ fontSize: "13px", flexShrink: 0 }} />
                                                                                            <span>View Link</span>
                                                                                        </a>
                                                                                    ) : (
                                                                                        <div style={{
                                                                                            padding: "12px 15px",
                                                                                            backgroundColor: "#fff",
                                                                                            borderRadius: "8px",
                                                                                            border: "1px solid #e0e0e0"
                                                                                        }}>
                                                                                            {String(value)}
                                                                                        </div>
                                                                                    )
                                                                                ) : (
                                                                                    <span style={{
                                                                                        color: "#999",
                                                                                        fontStyle: "italic",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        padding: "12px 15px",
                                                                                        backgroundColor: "#fff",
                                                                                        borderRadius: "8px",
                                                                                        border: "1px dashed #e0e0e0"
                                                                                    }}>
                                                                                        <i className="fas fa-minus-circle" style={{ marginRight: "8px", fontSize: "14px" }} />
                                                                                        No data available
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
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
                                                <i className="fas fa-inbox" style={{
                                                    fontSize: "64px",
                                                    color: "#ccc",
                                                    marginBottom: "20px",
                                                    display: "block"
                                                }} />
                                                <h4 style={{
                                                    fontSize: "22px",
                                                    color: "#666",
                                                    marginBottom: "10px",
                                                    fontWeight: "600"
                                                }}>
                                                    No Results Found
                                                </h4>
                                                <p style={{ fontSize: "16px", color: "#999", marginBottom: "0" }}>
                                                    Your query didn't return any results. Try rephrasing your question.
                                                </p>
                                            </div>
                                        )}

                                        {/* Results Count */}
                                        {results.results && results.results.length > 0 && (
                                            <div style={{
                                                padding: "20px 30px",
                                                backgroundColor: "#e7f5ff",
                                                borderRadius: "12px",
                                                border: "2px solid #b3d9ff",
                                                textAlign: "center",
                                                marginTop: "30px"
                                            }}>
                                                <i className="fas fa-check-circle" style={{
                                                    color: "#00B4D8",
                                                    marginRight: "10px",
                                                    fontSize: "18px"
                                                }} />
                                                <strong style={{ color: "#00B4D8", fontSize: "16px" }}>
                                                    Found {results.results.length} result{results.results.length !== 1 ? 's' : ''}
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Query Section ======*/}

            {/*====== Start Features Section ======*/}
            <section className="features-section pt-100 pb-80" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="section-title text-center mb-60">
                                <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600" }}>
                                    Features
                                </span>
                                <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a" }}>
                                    Why Use Our Query System?
                                </h2>
                                <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
                                    Powerful natural language processing with intelligent results
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInUp" style={{
                                padding: "50px 35px",
                                backgroundColor: "#fff",
                                borderRadius: "15px",
                                boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                transition: "all 0.4s ease",
                                height: "100%",
                                border: "2px solid transparent"
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
                                 }}>
                                <div className="icon mb-35" style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto",
                                    backgroundColor: "#e7f5ff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease"
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.backgroundColor = "#00B4D8";
                                         e.currentTarget.querySelector('i').style.color = "#fff";
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.backgroundColor = "#e7f5ff";
                                         e.currentTarget.querySelector('i').style.color = "#00B4D8";
                                     }}>
                                    <i className="fas fa-brain" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>
                                    Natural Language
                                </h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>
                                    Ask questions naturally and get intelligent responses
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInDown" style={{
                                padding: "50px 35px",
                                backgroundColor: "#fff",
                                borderRadius: "15px",
                                boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                transition: "all 0.4s ease",
                                height: "100%",
                                border: "2px solid transparent"
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
                                 }}>
                                <div className="icon mb-35" style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto",
                                    backgroundColor: "#e7f5ff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease"
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.backgroundColor = "#00B4D8";
                                         e.currentTarget.querySelector('i').style.color = "#fff";
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.backgroundColor = "#e7f5ff";
                                         e.currentTarget.querySelector('i').style.color = "#00B4D8";
                                     }}>
                                    <i className="fas fa-bolt" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>
                                    Instant Results
                                </h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>
                                    Get fast, accurate results from our knowledge base
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInUp" style={{
                                padding: "50px 35px",
                                backgroundColor: "#fff",
                                borderRadius: "15px",
                                boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                transition: "all 0.4s ease",
                                height: "100%",
                                border: "2px solid transparent"
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
                                 }}>
                                <div className="icon mb-35" style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto",
                                    backgroundColor: "#e7f5ff",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease"
                                }}
                                     onMouseEnter={(e) => {
                                         e.currentTarget.style.backgroundColor = "#00B4D8";
                                         e.currentTarget.querySelector('i').style.color = "#fff";
                                     }}
                                     onMouseLeave={(e) => {
                                         e.currentTarget.style.backgroundColor = "#e7f5ff";
                                         e.currentTarget.querySelector('i').style.color = "#00B4D8";
                                     }}>
                                    <i className="fas fa-th-large" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>
                                    Rich Data Display
                                </h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>
                                    View results in organized, easy-to-read cards
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

export default Index2;