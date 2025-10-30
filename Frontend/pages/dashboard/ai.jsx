import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './ai.module.css';
import { aiQuery, testGemini, parseSparqlResults } from '../api/ai';

export default function AIAssistant() {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [geminiStatus, setGeminiStatus] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [showSparql, setShowSparql] = useState(false);

    const exampleQuestions = [
        "Quels hébergements écologiques avec piscine moins de 200€?",
        "Find easy activities for summer",
        "Activités culturelles en Tunisie",
        "What are the best eco-friendly accommodations?",
        "Randonnées faciles avec guide",
        "Activities with low carbon footprint"
    ];

    useEffect(() => {
        checkGeminiStatus();
    }, []);

    const checkGeminiStatus = async () => {
        try {
            const status = await testGemini();
            setGeminiStatus(status);
        } catch (error) {
            console.error('Failed to check Gemini status:', error);
        }
    };

    // Helper to get display name from result
    const getDisplayName = (result) => {
        // Priority order: activityName, accommodationName, name
        return result.activityName ||
            result.accommodationName ||
            result.name ||
            result.transportName ||
            'Result';
    };

    // Helper to check if field should be displayed
    const shouldDisplayField = (key) => {
        // Hide URI fields and internal fields
        const hiddenFields = ['activity', 'accommodation', 'transport', 'uri'];
        return !hiddenFields.includes(key);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        // Add user question to chat history
        const userMessage = {
            type: 'user',
            content: question,
            timestamp: new Date().toLocaleTimeString()
        };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            const data = await aiQuery(question);

            // Parse results if they're in SPARQL format
            let parsedResults = data.results;
            if (Array.isArray(data.results)) {
                parsedResults = parseSparqlResults(data.results);
            }

            const resultData = {
                ...data,
                results: parsedResults
            };

            setResults(resultData);

            // Add AI response to chat history
            const aiMessage = {
                type: 'ai',
                content: resultData,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, aiMessage]);

            setQuestion('');
        } catch (error) {
            console.error('Error querying AI:', error);
            const errorDetail = error.response?.data?.detail || 'Error processing your question. Please try again.';
            setError(errorDetail);

            const errorMessage = {
                type: 'error',
                content: errorDetail,
                timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleExampleClick = (exampleQ) => {
        setQuestion(exampleQ);
    };

    const clearHistory = () => {
        setChatHistory([]);
        setResults(null);
        setError('');
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>🤖 AI Assistant</h1>

                        {/*{geminiStatus && (*/}
                        {/*    <p className={styles.status}>*/}
                        {/*        {geminiStatus.status === 'success' ? (*/}
                        {/*            <span className={styles.statusSuccess}>✅ {geminiStatus.message}</span>*/}
                        {/*        ) : (*/}
                        {/*            <span className={styles.statusError}>❌ {geminiStatus.message}</span>*/}
                        {/*        )}*/}
                        {/*    </p>*/}
                        {/*)}*/}
                    </div>
                    {chatHistory.length > 0 && (
                        <button
                            className={styles.clearBtn}
                            onClick={clearHistory}
                        >
                            🗑️ Clear History
                        </button>
                    )}
                </div>

                <div className={styles.mainContent}>
                    {/* Chat History */}
                    {chatHistory.length > 0 && (
                        <div className={styles.chatHistory}>
                            <h2>💬 Conversation History</h2>
                            <div className={styles.chatMessages}>
                                {chatHistory.map((message, index) => (
                                    <div key={index} className={`${styles.message} ${styles[message.type]}`}>
                                        <div className={styles.messageHeader}>
                      <span className={styles.messageIcon}>
                        {message.type === 'user' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
                      </span>
                                            <span className={styles.messageTime}>{message.timestamp}</span>
                                        </div>
                                        <div className={styles.messageContent}>
                                            {message.type === 'user' ? (
                                                <p>{message.content}</p>
                                            ) : message.type === 'error' ? (
                                                <p className={styles.errorText}>{message.content}</p>
                                            ) : (
                                                <div>
                                                    <p className={styles.aiResponse}>
                                                        Found <strong>{message.content.count}</strong> results using <strong>{message.content.method}</strong> method
                                                    </p>
                                                    {message.content.results && message.content.results.length > 0 && (
                                                        <div className={styles.resultsPreview}>
                                                            {message.content.results.slice(0, 3).map((result, idx) => (
                                                                <div key={idx} className={styles.resultItem}>
                                                                    <span>• {getDisplayName(result)}</span>
                                                                </div>
                                                            ))}
                                                            {message.content.results.length > 3 && (
                                                                <span className={styles.moreResults}>
                                  +{message.content.results.length - 3} more...
                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Query Input */}
                    <div className={styles.querySection}>
                        <form onSubmit={handleSubmit} className={styles.queryForm}>
                            <div className={styles.inputWrapper}>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything about eco-tourism... (e.g., 'Find eco-friendly accommodations under 200€')"
                    className={styles.queryInput}
                    rows="3"
                    disabled={loading}
                />
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={loading || !question.trim()}
                                >
                                    {loading ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            🚀 Ask AI
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Example Questions */}
                        <div className={styles.examples}>
                            <h3>💡 Try these examples:</h3>
                            <div className={styles.exampleGrid}>
                                {exampleQuestions.map((ex, index) => (
                                    <button
                                        key={index}
                                        className={styles.exampleBtn}
                                        onClick={() => handleExampleClick(ex)}
                                        disabled={loading}
                                    >
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Latest Results */}
                    {results && (
                        <div className={styles.resultsSection}>
                            <div className={styles.resultsHeader}>
                                <h2>📊 Latest Results</h2>
                                <div className={styles.resultsMeta}>
                  <span className={styles.resultCount}>
                    {results.count} result{results.count !== 1 ? 's' : ''}
                  </span>
                  {/*                  <span className={styles.methodBadge}>*/}
                  {/*  Method: {results.method}*/}
                  {/*</span>*/}
                                </div>
                            </div>

                            {results.results && results.results.length > 0 ? (
                                <div className={styles.resultsGrid}>
                                    {results.results.map((result, index) => (
                                        <div key={index} className={styles.resultCard}>
                                            <div className={styles.resultHeader}>
                                                <span className={styles.resultNumber}>#{index + 1}</span>
                                                <h3 className={styles.resultTitle}>{getDisplayName(result)}</h3>
                                            </div>
                                            <div className={styles.resultBody}>
                                                {Object.entries(result)
                                                    .filter(([key]) => shouldDisplayField(key))
                                                    .map(([key, value]) => (
                                                        <div key={key} className={styles.resultField}>
                                                            <span className={styles.fieldLabel}>{key}:</span>
                                                            <span className={styles.fieldValue}>
                                {value || 'N/A'}
                              </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <p>No results found. Try rephrasing your question.</p>
                                </div>
                            )}

                            {/* SPARQL Query Display */}
                            {/*{results.sparql_query && (*/}
                            {/*    <div className={styles.sparqlSection}>*/}
                            {/*        <button*/}
                            {/*            className={styles.toggleSparqlBtn}*/}
                            {/*            onClick={() => setShowSparql(!showSparql)}*/}
                            {/*        >*/}
                            {/*            {showSparql ? '🔽 Hide SPARQL Query' : '🔼 Show SPARQL Query'}*/}
                            {/*        </button>*/}
                            {/*        {showSparql && (*/}
                            {/*            <div className={styles.sparqlDisplay}>*/}
                            {/*                <pre>{results.sparql_query}</pre>*/}
                            {/*            </div>*/}
                            {/*        )}*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
