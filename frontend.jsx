// frontend.jsx - ILN Super-Moteur Frontend Complet
// Fusion compile!() + vdom!() + event!() + cache!() + hydrate!()

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// ===============================================
// ILN FRONTEND ESSENCES IMPLEMENTATIONS
// ===============================================

class ILNFrontendEssences {
    /**
     * Essence compile!() - Compilation optimisée des composants
     */
    static compile_optimize(component) {
        // Optimisation par memoization automatique
        return React.memo(component);
    }
    
    /**
     * Essence event!() - Gestion d'événements réactive native
     */
    static event_reactive(eventType, handler, dependencies = []) {
        return useCallback(handler, dependencies);
    }
    
    /**
     * Essence cache!() - Cache immutable du state
     */
    static cache_immutable(key, data) {
        const [cached, setCached] = useState(data);
        
        useEffect(() => {
            const cacheKey = `iln_cache_${key}`;
            const stored = localStorage.getItem(cacheKey);
            
            if (stored) {
                try {
                    setCached(JSON.parse(stored));
                } catch (e) {
                    console.warn('Cache parsing error:', e);
                }
            }
        }, [key]);
        
        const updateCache = useCallback((newData) => {
            setCached(newData);
            const cacheKey = `iln_cache_${key}`;
            localStorage.setItem(cacheKey, JSON.stringify(newData));
        }, [key]);
        
        return [cached, updateCache];
    }
    
    /**
     * Essence hydrate!() - Hydratation sélective des composants
     */
    static hydrate_selective(condition, component, fallback = null) {
        return condition ? component : fallback;
    }
    
    /**
     * Essence vdom!() - Optimisation VDOM avec reconciliation minimale
     */
    static vdom_minimal_diff(renderFunc, dependencies) {
        return React.useMemo(renderFunc, dependencies);
    }
}

// ===============================================
// COMPOSANTS CORE
// ===============================================

/**
 * Composant Générateur Principal avec essences ILN
 */
const PasswordGenerator = ILNFrontendEssences.compile_optimize(() => {
    // State management avec essence cache!()
    const [settings, updateSettings] = ILNFrontendEssences.cache_immutable('password_settings', {
        length: 12,
        includeSymbols: true,
        includeNumbers: true,
        includeUppercase: true
    });
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [strength, setStrength] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, updateHistory] = ILNFrontendEssences.cache_immutable('password_history', []);
    
    // WebSocket pour temps réel
    const ws = useRef(null);
    
    // ===============================================
    // ESSENCE EVENT!() - Event Handlers Optimisés
    // ===============================================
    
    const handleGenerate = ILNFrontendEssences.event_reactive(async () => {
        setIsGenerating(true);
        
        try {
            // API Call avec fetch natif
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    length: settings.length,
                    include_symbols: settings.includeSymbols,
                    include_numbers: settings.includeNumbers,
                    include_uppercase: settings.includeUppercase
                })
            });
            
            const result = await response.json();
            
            setCurrentPassword(result.password);
            setStrength(result.strength);
            
            // Mise à jour historique avec cache immutable
            const newHistory = [result, ...history.slice(0, 9)]; // Garde 10 max
            updateHistory(newHistory);
            
        } catch (error) {
            console.error('Generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [settings, history]);
    
    const handleSettingChange = ILNFrontendEssences.event_reactive((field, value) => {
        const newSettings = { ...settings, [field]: value };
        updateSettings(newSettings);
    }, [settings]);
    
    const handleCopyPassword = ILNFrontendEssences.event_reactive(async () => {
        if (currentPassword) {
            try {
                await navigator.clipboard.writeText(currentPassword);
                // Animation de feedback visuel
                const button = document.getElementById('copy-btn');
                button.style.background = '#10b981';
                setTimeout(() => {
                    button.style.background = '';
                }, 500);
            } catch (error) {
                console.error('Copy failed:', error);
            }
        }
    }, [currentPassword]);
    
    // ===============================================
    // EFFECTS & WEBSOCKET
    // ===============================================
    
    useEffect(() => {
        // WebSocket temps réel
        ws.current = new WebSocket(`ws://${window.location.host}/ws`);
        
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'password_generated') {
                setCurrentPassword(data.data.password);
                setStrength(data.data.strength);
            }
        };
        
        // Chargement analytics
        fetch('/analytics')
            .then(res => res.json())
            .then(setAnalytics)
            .catch(console.error);
        
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);
    
    // ===============================================
    // RENDER AVEC ESSENCE VDOM!()
    // ===============================================
    
    const renderPasswordDisplay = ILNFrontendEssences.vdom_minimal_diff(() => {
        if (!currentPassword) return null;
        
        const strengthColors = {
            weak: '#ef4444',
            medium: '#f59e0b', 
            strong: '#10b981',
            ultra: '#8b5cf6'
        };
        
        return (
            <div className="password-result">
                <div className="password-container">
                    <input 
                        type="text" 
                        value={currentPassword}
                        readOnly
                        className="password-display"
                        style={{
                            fontFamily: 'Monaco, monospace',
                            fontSize: '18px',
                            padding: '15px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            width: '100%',
                            marginBottom: '10px'
                        }}
                    />
                    <button 
                        id="copy-btn"
                        onClick={handleCopyPassword}
                        className="copy-button"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        📋 Copier
                    </button>
                </div>
                <div className="strength-indicator">
                    <span style={{ 
                        color: strengthColors[strength] || '#6b7280',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        Force: {strength}
                    </span>
                </div>
            </div>
        );
    }, [currentPassword, strength]);
    
    const renderSettings = ILNFrontendEssences.vdom_minimal_diff(() => (
        <div className="settings-panel">
            <h3>Paramètres</h3>
            
            <div className="setting-item">
                <label>
                    Longueur: {settings.length}
                    <input
                        type="range"
                        min="4"
                        max="50"
                        value={settings.length}
                        onChange={(e) => handleSettingChange('length', parseInt(e.target.value))}
                        style={{ width: '100%', margin: '10px 0' }}
                    />
                </label>
            </div>
            
            <div className="setting-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.includeUppercase}
                        onChange={(e) => handleSettingChange('includeUppercase', e.target.checked)}
                    />
                    Majuscules (A-Z)
                </label>
            </div>
            
            <div className="setting-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.includeNumbers}
                        onChange={(e) => handleSettingChange('includeNumbers', e.target.checked)}
                    />
                    Chiffres (0-9)
                </label>
            </div>
            
            <div className="setting-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.includeSymbols}
                        onChange={(e) => handleSettingChange('includeSymbols', e.target.checked)}
                    />
                    Symboles (!@#$%...)
                </label>
            </div>
        </div>
    ), [settings]);
    
    const renderHistory = ILNFrontendEssences.vdom_minimal_diff(() => {
        if (!history.length) return null;
        
        return (
            <div className="history-panel">
                <h3>Historique</h3>
                <div className="history-list">
                    {history.slice(0, 5).map((item, index) => (
                        <div key={index} className="history-item" style={{
                            padding: '8px',
                            margin: '5px 0',
                            backgroundColor: '#f9fafb',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            <code>{item.password.substring(0, 20)}...</code>
                            <span style={{ float: 'right', color: '#6b7280' }}>
                                {item.strength}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }, [history]);
    
    const renderAnalytics = ILNFrontendEssences.vdom_minimal_diff(() => {
        return ILNFrontendEssences.hydrate_selective(
            analytics !== null,
            (
                <div className="analytics-panel">
                    <h3>Statistiques</h3>
                    <p>Total généré: {analytics?.total_generated || 0}</p>
                    <div className="strength-stats">
                        {analytics?.strength_distribution && Object.entries(analytics.strength_distribution).map(([level, count]) => (
                            <div key={level} style={{ fontSize: '12px', margin: '2px 0' }}>
                                {level}: {count}
                            </div>
                        ))}
                    </div>
                </div>
            )
        );
    }, [analytics]);
    
    // RENDER PRINCIPAL
    return (
        <div className="app-container" style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>🔐 ILN Password Generator</h1>
                <p style={{ color: '#6b7280' }}>
                    Générateur sécurisé avec architecture ILN révolutionnaire
                </p>
            </header>
            
            <main>
                <div className="generation-section" style={{ marginBottom: '30px' }}>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '18px',
                            backgroundColor: isGenerating ? '#9ca3af' : '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        {isGenerating ? '⏳ Génération...' : '🎲 Générer Mot de Passe'}
                    </button>
                    
                    {renderPasswordDisplay}
                </div>
                
                <div className="panels-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                }}>
                    {renderSettings}
                    {renderHistory}
                    {renderAnalytics}
                </div>
            </main>
            
            <footer style={{
                textAlign: 'center',
                marginTop: '40px',
                padding: '20px',
                borderTop: '1px solid #e5e7eb',
                color: '#6b7280',
                fontSize: '14px'
            }}>
                Propulsé par ILN Architecture • chan!() + event!() + cache!() + vdom!()
            </footer>
        </div>
    );
});

// ===============================================
// MOUNTING ET DÉMARRAGE
// ===============================================

// Essence compile!() appliquée au niveau racine
const App = ILNFrontendEssences.compile_optimize(() => {
    return <PasswordGenerator />;
});

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
        console.log('🎨 ILN Frontend Super-Engine démarré!');
        console.log('Essences actives: compile!() + event!() + cache!() + vdom!() + hydrate!()');
    }
});

// Export pour réutilisation
export default App;
