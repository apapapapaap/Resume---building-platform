import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResumeDashboardPage = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            // Get resumes for user ID 1 (test user)
            const response = await axios.get('http://localhost:5001/api/resumes/user/1');
            setResumes(response.data);
            console.log('Resumes loaded:', response.data);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setError('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const deleteResume = async (resumeId, resumeTitle) => {
        if (window.confirm(`Are you sure you want to delete "${resumeTitle}"? This action cannot be undone.`)) {
            try {
                await axios.delete(`http://localhost:5001/api/resumes/${resumeId}`);
                setResumes(resumes.filter(resume => resume.id !== resumeId));
                alert('✅ Resume deleted successfully!');
            } catch (error) {
                console.error('Error deleting resume:', error);
                alert('❌ Failed to delete resume');
            }
        }
    };

    const duplicateResume = async (resumeId, resumeTitle) => {
        try {
            const response = await axios.post(`http://localhost:5001/api/resumes/${resumeId}/duplicate`, {
                new_title: `${resumeTitle} (Copy)`
            });
            await fetchResumes(); // Refresh the list
            alert('✅ Resume duplicated successfully!');
        } catch (error) {
            console.error('Error duplicating resume:', error);
            alert('❌ Failed to duplicate resume');
        }
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <p style={{ color: '#666' }}>Loading your resumes...</p>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `
                }} />
            </div>
        );
    }

    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                marginBottom: '30px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h1 style={{ margin: '0', color: '#2c3e50', fontSize: '32px' }}>📄 My Resume Dashboard</h1>
                <p style={{ color: '#666', margin: '15px 0 25px 0', fontSize: '18px' }}>
                    Manage all your professional resumes in one place
                </p>
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => window.location.href = '/working-form'}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '15px 25px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        + Create New Resume
                    </button>
                    <button 
                        onClick={() => window.location.href = '/test-resume'}
                        style={{
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            padding: '15px 25px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        🎯 Simple Resume Builder
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <h3>❌ {error}</h3>
                    <button 
                        onClick={fetchResumes}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Resumes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                {resumes.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '60px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#666', margin: '0 0 15px 0' }}>📝 No resumes yet</h3>
                        <p style={{ color: '#999', marginBottom: '25px' }}>
                            Create your first professional resume to get started!
                        </p>
                        <button 
                            onClick={() => window.location.href = '/working-form'}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '15px 30px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Create Your First Resume
                        </button>
                    </div>
                ) : (
                    resumes.map((resume) => (
                        <div key={resume.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            padding: '25px',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}>
                            {/* Resume Header */}
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ 
                                    margin: '0 0 10px 0', 
                                    color: '#2c3e50',
                                    fontSize: '20px',
                                    wordBreak: 'break-word'
                                }}>
                                    📄 {resume.title}
                                </h3>
                                <div style={{ color: '#666', fontSize: '14px' }}>
                                    <div><strong>Created:</strong> {new Date(resume.created_at).toLocaleDateString()}</div>
                                    <div><strong>Updated:</strong> {new Date(resume.updated_at).toLocaleDateString()}</div>
                                    <div style={{ 
                                        marginTop: '8px',
                                        padding: '4px 8px',
                                        backgroundColor: '#e3f2fd',
                                        color: '#1976d2',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        ID: {resume.id}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button 
                                    onClick={() => window.open(`/resume/view/${resume.id}`, '_blank')}
                                    style={{
                                        backgroundColor: '#17a2b8',
                                        color: 'white',
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    👁️ View Resume
                                </button>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => window.location.href = '/working-form'}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            padding: '10px 14px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            flex: 1
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    
                                    <button 
                                        onClick={() => window.open(`http://localhost:5001/api/resumes/${resume.id}/download-pdf`, '_blank')}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            padding: '10px 14px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            flex: 1
                                        }}
                                    >
                                        📥 PDF
                                    </button>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => duplicateResume(resume.id, resume.title)}
                                        style={{
                                            backgroundColor: '#ffc107',
                                            color: '#000',
                                            padding: '10px 14px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            flex: 1
                                        }}
                                    >
                                        📋 Duplicate
                                    </button>
                                    
                                    <button 
                                        onClick={() => deleteResume(resume.id, resume.title)}
                                        style={{
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            padding: '10px 14px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            flex: 1
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stats Footer */}
            {resumes.length > 0 && (
                <div style={{
                    marginTop: '40px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    <strong>📊 Total Resumes: {resumes.length}</strong> | 
                    Last Updated: {resumes.length > 0 ? new Date(Math.max(...resumes.map(r => new Date(r.updated_at)))).toLocaleString() : 'N/A'}
                </div>
            )}
        </div>
    );
};

export default ResumeDashboardPage;
