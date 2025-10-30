import { useState } from "react";
import Layout from "@/src/layout/Layout";
import { aiQuery } from "@/pages/api/ai";

const AIPage = () => {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const exampleQuestions = [
        "Quels hébergements écologiques avec piscine moins de 200€?",
        "Find easy activities for summer",
        "Activités culturelles en Tunisie",
        "What are the best eco-friendly accommodations?",
        "Randonnées faciles avec guide",
        "Activities with low carbon footprint"
    ];

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
            const data = await aiQuery(question);
            let list = [];
            if (data && Array.isArray(data.results)) list = data.results;
            else if (Array.isArray(data)) list = data;
            else if (data && typeof data === 'object') list = [data];

            // Parse SPARQL format to extract clean values
            const cleanResults = list.map(result => {
                const cleaned = {};
                for (const [key, value] of Object.entries(result)) {
                    if (value && typeof value === 'object' && 'value' in value) {
                        // Extract value from SPARQL format
                        cleaned[key] = value.value;
                    } else if (typeof value === 'string') {
                        // Try to parse if it's a JSON string
                        try {
                            const parsed = JSON.parse(value);
                            if (parsed && typeof parsed === 'object' && 'value' in parsed) {
                                cleaned[key] = parsed.value;
                            } else {
                                cleaned[key] = value;
                            }
                        } catch {
                            cleaned[key] = value;
                        }
                    } else {
                        cleaned[key] = value;
                    }
                }
                return cleaned;
            });

            const normalized = { query: question, results: cleanResults, count: cleanResults.length };
            setResults(normalized);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "An error occurred while processing your query");
            console.error("AI Query error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleExampleClick = (example) => {
        setQuestion(example);
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
                                        <span className="ribbon">AI-Powered Query Interface</span>
                                        <h1 data-animation="fadeInDown" data-delay=".4s">
                                            AI-Powered Query Interface
                                        </h1>
                                        <p className="text-white" style={{ fontSize: "18px", marginTop: "20px" }}>
                                            Ask questions and get intelligent AI-driven responses
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
                            <div className="booking-form-wrapper" style={{ padding: "60px 50px", borderRadius: "15px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                                <div className="section-title text-center mb-50">
                                    <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600" }}>AI Query Interface</span>
                                    <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a" }}>Ask Your Question</h2>
                                    <p style={{ color: "#666", marginTop: "10px", fontSize: "16px" }}>Enter your question in natural language and get AI-powered results</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form_group mb-40">
                                                <label className="mb-3" style={{ display: "block", fontWeight: "600", fontSize: "15px", color: "#333" }}>
                                                    Ask me anything about eco-tourism
                                                </label>
                                                <textarea
                                                    className="form_control"
                                                    placeholder="e.g., Find eco-friendly accommodations under 200€"
                                                    value={question}
                                                    onChange={(e) => setQuestion(e.target.value)}
                                                    rows={5}
                                                    style={{
                                                        width: "100%",
                                                        padding: "20px",
                                                        fontSize: "16px",
                                                        borderRadius: "8px",
                                                        border: "2px solid #e8e8e8",
                                                        transition: "all 0.3s ease",
                                                        resize: "vertical"
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = "#00B4D8"}
                                                    onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-12 text-center">
                                            <button
                                                type="submit"
                                                className="main-btn primary-btn"
                                                disabled={loading}
                                                style={{
                                                    minWidth: "250px",
                                                    padding: "18px 40px",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    borderRadius: "8px",
                                                    transition: "all 0.3s ease",
                                                    opacity: loading ? 0.7 : 1,
                                                    cursor: loading ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span style={{ marginRight: "10px" }}>Processing...</span>
                                                        <i className="fas fa-spinner fa-spin" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Ask AI
                                                        <i className="fas fa-paper-plane" style={{ marginLeft: "10px" }} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Try These Examples Section */}
                                <div className="mt-50">
                                    <div className="mb-30" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="fas fa-lightbulb" style={{ fontSize: "20px", color: "#00B4D8", marginRight: "10px" }} />
                                        <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#333" }}>Try these examples</h4>
                                    </div>
                                    <div className="row">
                                        {exampleQuestions.map((example, index) => (
                                            <div key={index} className="col-lg-4 col-md-6 mb-20">
                                                <div
                                                    onClick={() => handleExampleClick(example)}
                                                    style={{
                                                        padding: "20px",
                                                        backgroundColor: "#f8f9fa",
                                                        borderRadius: "12px",
                                                        border: "1px solid #e8e8e8",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        height: "100%"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#fff";
                                                        e.currentTarget.style.borderColor = "#00B4D8";
                                                        e.currentTarget.style.transform = "translateY(-2px)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                                                        e.currentTarget.style.borderColor = "#e8e8e8";
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                    }}
                                                >
                                                    <p style={{ margin: 0, fontSize: "15px", color: "#333", lineHeight: "1.5" }}>
                                                        {example}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Error Display */}
                                {error && (
                                    <div
                                        className="mt-50"
                                        style={{
                                            padding: "25px 30px",
                                            borderRadius: "10px",
                                            backgroundColor: "#fee",
                                            color: "#c33",
                                            border: "2px solid #fcc",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        <i className="fas fa-exclamation-circle" style={{ fontSize: "24px", marginRight: "15px" }} />
                                        <div>
                                            <strong style={{ display: "block", marginBottom: "5px", fontSize: "16px" }}>Error</strong>
                                            <span style={{ fontSize: "15px" }}>{error}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Results Display */}
                                {results && (
                                    <div className="mt-60">
                                        <div className="section-title text-center mb-50">
                                            <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600" }}>Results</span>
                                            <h3 style={{ fontSize: "32px", marginTop: "15px", color: "#1a1a1a" }}>Query Results</h3>
                                        </div>

                                        {/* Results Cards */}
                                        {results.results && results.results.length > 0 ? (
                                            <div className="mb-40">
                                                {results.results.map((result, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-40"
                                                        style={{
                                                            backgroundColor: "#fff",
                                                            borderRadius: "15px",
                                                            padding: "35px",
                                                            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
                                                            border: "2px solid #f0f0f0"
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginBottom: "30px",
                                                                paddingBottom: "20px",
                                                                borderBottom: "3px solid #00B4D8"
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    backgroundColor: "#00B4D8",
                                                                    borderRadius: "12px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    marginRight: "15px",
                                                                    flexShrink: 0
                                                                }}
                                                            >
                                                                <span style={{ fontSize: "20px", color: "#fff", fontWeight: "700" }}>
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 style={{ margin: 0, fontSize: "24px", color: "#1a1a1a", fontWeight: "700" }}>
                                                                    Result {index + 1}
                                                                </h3>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            {Object.entries(result).map(([key, value], i) => (
                                                                <div key={i} className="col-xl-6 col-lg-6 col-md-12 mb-25">
                                                                    <div
                                                                        style={{
                                                                            backgroundColor: "#f8f9fa",
                                                                            borderRadius: "12px",
                                                                            padding: "25px",
                                                                            height: "100%",
                                                                            border: "2px solid #e8e8e8",
                                                                            transition: "all 0.3s ease"
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.backgroundColor = "#fff";
                                                                            e.currentTarget.style.borderColor = "#00B4D8";
                                                                            e.currentTarget.style.transform = "translateY(-3px)";
                                                                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,180,216,0.15)";
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                                                                            e.currentTarget.style.borderColor = "#e8e8e8";
                                                                            e.currentTarget.style.transform = "translateY(0)";
                                                                            e.currentTarget.style.boxShadow = "none";
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display: "inline-flex",
                                                                                alignItems: "center",
                                                                                backgroundColor: "#00B4D8",
                                                                                color: "#fff",
                                                                                padding: "6px 15px",
                                                                                borderRadius: "20px",
                                                                                fontSize: "12px",
                                                                                fontWeight: "700",
                                                                                textTransform: "uppercase",
                                                                                letterSpacing: "0.5px",
                                                                                marginBottom: "15px"
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-tag" style={{ fontSize: "10px", marginRight: "8px" }} />
                                                                            {key.replace(/_/g, " ")}
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                fontSize: "16px",
                                                                                color: "#333",
                                                                                lineHeight: "1.7",
                                                                                wordBreak: "break-word",
                                                                                fontWeight: "500"
                                                                            }}
                                                                        >
                                                                            {value ? (
                                                                                typeof value === 'string' && value.startsWith('http') ? (
                                                                                    <a
                                                                                        href={value}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        style={{
                                                                                            color: "#00B4D8",
                                                                                            textDecoration: "none",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            gap: "8px",
                                                                                            wordBreak: "break-all"
                                                                                        }}
                                                                                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                                                                                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                                                                                    >
                                                                                        <i className="fas fa-link" style={{ fontSize: "14px", flexShrink: 0 }} />
                                                                                        <span>{value}</span>
                                                                                    </a>
                                                                                ) : (
                                                                                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                                                                                        <i className="fas fa-quote-left" style={{ fontSize: "14px", color: "#00B4D8", marginRight: "10px", marginTop: "3px", flexShrink: 0 }} />
                                                                                        <span>{String(value)}</span>
                                                                                    </div>
                                                                                )
                                                                            ) : (
                                                                                <span style={{ color: "#999", fontStyle: "italic", display: "flex", alignItems: "center" }}>
                                                                                    <i className="fas fa-minus-circle" style={{ marginRight: "8px", fontSize: "14px" }} />
                                                                                    No data available
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
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
                                                <i className="fas fa-inbox" style={{ fontSize: "48px", color: "#ccc", marginBottom: "20px", display: "block" }} />
                                                <p style={{ fontSize: "18px", color: "#666", marginBottom: "0", fontWeight: "500" }}>
                                                    No results found for your query.
                                                </p>
                                                <p style={{ fontSize: "14px", color: "#999", marginTop: "8px", marginBottom: "0" }}>
                                                    Try rephrasing your question or use different keywords.
                                                </p>
                                            </div>
                                        )}

                                        {typeof results.count === 'number' && (
                                            <div
                                                className="text-center"
                                                style={{
                                                    padding: "20px 30px",
                                                    backgroundColor: "#e7f5ff",
                                                    borderRadius: "10px",
                                                    border: "2px solid #b3d9ff"
                                                }}
                                            >
                                                <i className="fas fa-check-circle" style={{ color: "#00B4D8", marginRight: "10px", fontSize: "18px" }} />
                                                <strong style={{ color: "#00B4D8", fontSize: "16px" }}>Total Results: {results.count}</strong>
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
                                <span className="sub-title" style={{ fontSize: "16px", color: "#00B4D8", fontWeight: "600" }}>Features</span>
                                <h2 style={{ fontSize: "36px", marginTop: "15px", color: "#1a1a1a" }}>Why Use Our AI Interface?</h2>
                                <p style={{ color: "#666", marginTop: "15px", fontSize: "16px" }}>
                                    Experience intelligent processing and insights with our AI tools
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
                                    <i className="fas fa-brain" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Intelligent Processing</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Leverage AI to understand and process complex queries effectively</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInDown" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-robot" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Machine Learning</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Benefit from ML models that enhance understanding and relevance</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6 col-sm-12">
                            <div className="single-features-item mb-40 text-center wow fadeInUp" style={{ padding: "50px 35px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 5px 25px rgba(0,0,0,0.08)", transition: "all 0.4s ease", height: "100%", border: "2px solid transparent" }}
                                 onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,180,216,0.15)"; e.currentTarget.style.borderColor = "#00B4D8"; }}
                                 onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}>
                                <div className="icon mb-35" style={{ width: "80px", height: "80px", margin: "0 auto", backgroundColor: "#e7f5ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}
                                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00B4D8"; e.currentTarget.querySelector('i').style.color = "#fff"; }}
                                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e7f5ff"; e.currentTarget.querySelector('i').style.color = "#00B4D8"; }}>
                                    <i className="fas fa-lightbulb" style={{ fontSize: "36px", color: "#00B4D8", transition: "color 0.3s ease" }} />
                                </div>
                                <h3 className="title mb-20" style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>Smart Insights</h3>
                                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#666", margin: 0 }}>Gain actionable insights from your questions and data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*====== End Features Section ======*/}
        </Layout>
    );
};

export default AIPage;