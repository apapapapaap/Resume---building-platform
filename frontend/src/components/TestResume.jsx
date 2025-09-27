import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestResume = () => {
    const navigate = useNavigate();
    
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>🎯 Resume Platform Test</h1>
            <p>Choose your resume builder:</p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <button
                    onClick={() => navigate('/resume-builder')}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '15px 25px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    🚀 Resume Builder
                </button>
                
                <button
                    onClick={() => navigate('/resume-form')}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '15px 25px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    📝 Resume Form
                </button>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <h3>🔧 Debug Info</h3>
                <p>Frontend running on: {window.location.origin}</p>
                <p>Backend should be on: http://localhost:5001</p>
            </div>
        </div>
    );
};

export default TestResume;
