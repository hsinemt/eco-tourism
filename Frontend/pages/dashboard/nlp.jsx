import { useState, useEffect } from 'react';
import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import styles from './nlp.module.css';
import { queryNLP, analyzeQuestion, getExamples } from '../api/nlp';

export default function NLPSearch() {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [examples, setExamples] = useState(null);
    const [error, setError] = useState('');
    const [showExamples, setShowExamples] = useState(false);
    const [useAdvancedNLP, setUseAdvancedNLP] = useState(false);
    const [activeTab, setActiveTab] = useState('search'); // 'search' or 'results'

    // Fetch examples on mount
    useEffect(() => {
        fetchExamples();
    }, []);

    const fetchExamples = async () => {
        try {
            const data = await getExamples();
            setExamples(data);
        } catch (error) {
            console.error('Error fetching examples:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);
        setAnalysis(null);

        try {
            const data = await queryNLP(question, useAdvancedNLP);
            setResults(data);
            setActiveTab('results');
        } catch (error) {
            console.error('Error searching:', error);
            const errorDetail = error.response?.data?.detail || 'Error processing your question. Please try again.';
            setError(errorDetail);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!question.trim()) {
            setError('Please enter a question to analyze');
            return;
        }

        setAnalyzing(true);
        setError('');

        try {
            const data = await analyzeQuestion(question);
            setAnalysis(data);
        } catch (error) {
            console.error('Error analyzing:', error);
            setError('Error analyzing question. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleExampleClick = (exampleQuestion) => {
        setQuestion(exampleQuestion);
        setShowExamples(false);
    };

    const renderResults = () => {
        if (!results || !results.results) return null;

        const resultsList = results.results;

        if (resultsList.length === 0) {
            return (
                <div className={styles.noResults}>
                    <p>No results found for your query.</p>
                    <p>Try rephrasing your question or use different keywords.</p>
                </div>
            );
        }

        // Helper to extract value from SPARQL format
        const getValue = (field) => {
            if (!field) return null;
            if (typeof field === 'object' && 'value' in field) {
                return field.value;
            }
            return field;
        };

        return (
            <div className={styles.resultsGrid}>
                {resultsList.map((result, index) => {
                    // Extract values from SPARQL format
                    const activityName = getValue(result.activityName);
                    const accommodationName = getValue(result.accommodationName);
                    const name = activityName || accommodationName || getValue(result.name) || 'Result';

                    const description = getValue(result.activityDescription) ||
                        getValue(result.accommodationDescription) ||
                        getValue(result.description);

                    const pricePerPerson = getValue(result.pricePerPerson);
                    const pricePerNight = getValue(result.pricePerNight);
                    const difficultyLevel = getValue(result.difficultyLevel);
                    const durationHours = getValue(result.durationHours);
                    const activityRating = getValue(result.activityRating);
                    const accommodationRating = getValue(result.accommodationRating);
                    const bestTimeToVisit = getValue(result.bestTimeToVisit);
                    const maxParticipants = getValue(result.maxParticipants);
                    const numberOfRooms = getValue(result.numberOfRooms);
                    const ecoCertified = getValue(result.ecoCertified);
                    const minAge = getValue(result.minAge);

                    return (
                        <div key={index} className={styles.resultCard}>
                            <h3>{name}</h3>

                            {description && (
                                <p className={styles.description}>{description}</p>
                            )}

                            <div className={styles.resultDetails}>
                                {pricePerPerson && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Price:</span>
                                        <span className={styles.detailValue}>€{pricePerPerson}/person</span>
                                    </div>
                                )}
                                {pricePerNight && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Price:</span>
                                        <span className={styles.detailValue}>€{pricePerNight}/night</span>
                                    </div>
                                )}
                                {difficultyLevel && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Difficulty:</span>
                                        <span className={styles.detailValue}>{difficultyLevel}</span>
                                    </div>
                                )}
                                {durationHours && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Duration:</span>
                                        <span className={styles.detailValue}>{durationHours} hours</span>
                                    </div>
                                )}
                                {activityRating && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Rating:</span>
                                        <span className={styles.detailValue}>⭐ {activityRating}</span>
                                    </div>
                                )}
                                {accommodationRating && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Rating:</span>
                                        <span className={styles.detailValue}>⭐ {accommodationRating}</span>
                                    </div>
                                )}
                                {bestTimeToVisit && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Best Time:</span>
                                        <span className={styles.detailValue}>{bestTimeToVisit}</span>
                                    </div>
                                )}
                                {ecoCertified && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.ecoLabel}>🌿 Eco-Certified</span>
                                    </div>
                                )}
                                {maxParticipants && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Max Participants:</span>
                                        <span className={styles.detailValue}>{maxParticipants} people</span>
                                    </div>
                                )}
                                {minAge && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Min Age:</span>
                                        <span className={styles.detailValue}>{minAge} years</span>
                                    </div>
                                )}
                                {numberOfRooms && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Rooms:</span>
                                        <span className={styles.detailValue}>{numberOfRooms}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };


    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>🔍 Natural Language Search</h1>
                        <p>Ask questions in plain language - French or English</p>
                    </div>
                </div>

                {/* Search Section */}
                <div className={styles.searchSection}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputWrapper}>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ask a question... (e.g., 'Find easy activities for summer' or 'Hébergements écologiques')"
                                className={styles.searchInput}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.examplesBtn}
                                onClick={() => setShowExamples(!showExamples)}
                            >
                                💡 Examples
                            </button>
                        </div>

                        {/*<div className={styles.searchOptions}>*/}
                        {/*    <label className={styles.checkbox}>*/}
                        {/*        <input*/}
                        {/*            type="checkbox"*/}
                        {/*            checked={useAdvancedNLP}*/}
                        {/*            onChange={(e) => setUseAdvancedNLP(e.target.checked)}*/}
                        {/*        />*/}
                        {/*        <span>Use Advanced NLP</span>*/}
                        {/*    </label>*/}
                        {/*</div>*/}

                        <div className={styles.searchButtons}>
                            <button
                                type="submit"
                                className={styles.primaryBtn}
                                disabled={loading || !question.trim()}
                            >
                                {loading ? 'Searching...' : '🔍 Search'}
                            </button>
                            <button
                                type="button"
                                className={styles.secondaryBtn}
                                onClick={handleAnalyze}
                                disabled={analyzing || !question.trim()}
                            >
                                {analyzing ? 'Analyzing...' : '🔬 Analyze Query'}
                            </button>
                        </div>
                    </form>

                    {/* Examples Dropdown */}
                    {showExamples && examples && (
                        <div className={styles.examplesDropdown}>
                            <h3>Example Questions:</h3>

                            <div className={styles.exampleCategory}>
                                <h4>🏃 Activities</h4>
                                <ul>
                                    {examples.activities?.map((ex, i) => (
                                        <li key={i} onClick={() => handleExampleClick(ex)}>
                                            {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.exampleCategory}>
                                <h4>🏠 Accommodations</h4>
                                <ul>
                                    {examples.accommodations?.map((ex, i) => (
                                        <li key={i} onClick={() => handleExampleClick(ex)}>
                                            {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.exampleCategory}>
                                <h4>🌤️ Seasons</h4>
                                <ul>
                                    {examples.seasons?.map((ex, i) => (
                                        <li key={i} onClick={() => handleExampleClick(ex)}>
                                            {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.exampleCategory}>
                                <h4>💡 Mixed Queries</h4>
                                <ul>
                                    {examples.mixed?.map((ex, i) => (
                                        <li key={i} onClick={() => handleExampleClick(ex)}>
                                            {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && <div className={styles.error}>{error}</div>}

                    {/* Analysis Results */}
                    {analysis && (
                        <div className={styles.analysisSection}>
                            <h3>Query Analysis</h3>
                            <div className={styles.analysisGrid}>
                                <div className={styles.analysisItem}>
                                    <strong>Query Type:</strong>
                                    <span className={styles.badge}>{analysis.query_type}</span>
                                </div>
                                <div className={styles.analysisItem}>
                                    <strong>Confidence:</strong>
                                    <span className={styles.confidence}>
                    {(analysis.confidence * 100).toFixed(0)}%
                  </span>
                                </div>
                                {analysis.entities && analysis.entities.length > 0 && (
                                    <div className={styles.analysisItem}>
                                        <strong>Detected Entities:</strong>
                                        <div className={styles.entityList}>
                                            {analysis.entities.map((entity, i) => (
                                                <span key={i} className={styles.entityBadge}>
                          {entity.type}: {entity.value}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {analysis.filters && Object.keys(analysis.filters).length > 0 && (
                                    <div className={styles.analysisItem}>
                                        <strong>Filters:</strong>
                                        <div className={styles.filterList}>
                                            {Object.entries(analysis.filters).map(([key, value], i) => (
                                                <span key={i} className={styles.filterBadge}>
                          {key}: {value.toString()}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {analysis.sparql_query && (
                                <div className={styles.sparqlPreview}>
                                    <strong>Generated SPARQL Query:</strong>
                                    <pre>{analysis.sparql_query}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {results && (
                    <div className={styles.resultsSection}>
                        <div className={styles.resultsHeader}>
                            <h2>Search Results</h2>
                            <div className={styles.resultsInfo}>
                <span className={styles.resultCount}>
                  {results.count} result{results.count !== 1 ? 's' : ''} found
                </span>
                                <span className={styles.queryType}>
                  Type: {results.query_type}
                </span>
                            </div>
                        </div>

                        {renderResults()}

                        {/* Query Details */}
                        {/*{results.sparql_query && (*/}
                        {/*    <div className={styles.queryDetails}>*/}
                        {/*        <button*/}
                        {/*            className={styles.toggleBtn}*/}
                        {/*            onClick={() => setActiveTab(activeTab === 'results' ? 'query' : 'results')}*/}
                        {/*        >*/}
                        {/*            {activeTab === 'results' ? '📋 View SPARQL Query' : '🔙 Back to Results'}*/}
                        {/*        </button>*/}

                        {/*        {activeTab === 'query' && (*/}
                        {/*            <div className={styles.sparqlSection}>*/}
                        {/*                <h3>Generated SPARQL Query</h3>*/}
                        {/*                <pre className={styles.sparqlCode}>{results.sparql_query}</pre>*/}
                        {/*            </div>*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
