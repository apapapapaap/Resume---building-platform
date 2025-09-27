import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeDashboard from './components/ResumeDashboard';
import ResumeForm from './components/ResumeForm/ResumeForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResumeFormPage from './pages/ResumeFormPage';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to check if current route is a test route
const isTestRoute = (path = window.location.pathname) => {
  const testRoutes = ['/test', '/working-form', '/resume-test.html', '/simple-test.html', '/resume/view', '/dashboard'];
  return testRoutes.some(route => path.startsWith(route)) || 
         path.startsWith('/test-') ||
         path.match(/^\/resume\/view\/\d+$/);
};

// 🔧 FIXED: Dynamic User ID Hook
const useCurrentUser = () => {
  const { user } = useAuth();
  
  // For test routes, return default test user
  const currentPath = window.location.pathname;
  if (isTestRoute(currentPath) && !user) {
    return {
      id: 1,
      email: 'test@example.com',
      full_name: 'Test User'
    };
  }
  
  // For authenticated routes, return actual user
  return user || null;
};

// 🎯 FIXED: TEST RESUME BUILDER with Dynamic User
const TestResumeBuilder = () => {
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('Initializing...');
    const currentUser = useCurrentUser(); // 🔧 Dynamic user
    
    const [personalDetails, setPersonalDetails] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        professional_summary: ''
    });

    useEffect(() => {
        if (currentUser) {
            initializeResume();
        }
    }, [currentUser]);

    const initializeResume = async () => {
        try {
            setStatus('🔄 Setting up resume...');
            
            // Test backend connection
            console.log('Testing backend connection...');
            await axios.get('http://localhost:5001/api/health');
            setStatus('✅ Backend connected');
            
            // Ensure user exists - 🔧 FIXED: Use actual user data
            console.log('Ensuring user exists:', currentUser);
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.full_name || currentUser.name
            });
            
            // Create new resume - 🔧 FIXED: Use actual user ID
            console.log('Creating resume for user:', currentUser.id);
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: currentUser.id,
                title: 'My Test Resume'
            });
            
            setResumeId(response.data.id);
            setStatus(`✅ Resume created! ID: ${response.data.id} for user: ${currentUser.id}`);
            console.log('Resume created with ID:', response.data.id, 'for user:', currentUser.id);
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            setStatus('❌ Error: ' + (error.response?.data?.error || error.message || 'Failed to initialize'));
        }
    };

    const savePersonalDetails = async () => {
        if (!resumeId) {
            alert('No resume ID found!');
            return;
        }

        if (!personalDetails.full_name || !personalDetails.email) {
            alert('Please fill in Name and Email');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving personal details...');
        
        try {
            console.log('Saving personal details:', personalDetails);
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/personal-details`, personalDetails);
            setStatus('✅ Personal details saved successfully!');
            alert('✅ Personal details saved!');
        } catch (error) {
            console.error('❌ Save error:', error);
            setStatus('❌ Save failed: ' + (error.response?.data?.error || error.message));
            alert('❌ Save failed: ' + (error.response?.data?.error || error.message));
        }
        setSaving(false);
    };

    const downloadPDF = () => {
        if (!resumeId) {
            alert('No resume to download!');
            return;
        }
        setStatus('📥 Generating PDF with BLACK text...');
        window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf?textColor=black`, '_blank');
        setStatus('✅ PDF generated with BLACK text!');
    };

    if (!currentUser) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Please log in to use the resume builder</h2>
                <button onClick={() => window.location.href = '/login'}>Go to Login</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🎯 Test Resume Builder</h1>
            <p>Logged in as: <strong>{currentUser.full_name || currentUser.name} ({currentUser.email})</strong></p>
            
            {/* Status Bar */}
            <div style={{ 
                padding: '15px', 
                backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#d1ecf1',
                color: status.includes('✅') ? '#155724' : status.includes('❌') ? '#721c24' : '#0c5460',
                borderRadius: '6px',
                marginBottom: '20px',
                fontWeight: 'bold'
            }}>
                Status: {status}
            </div>
            
            {/* Resume ID Display */}
            <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginBottom: '20px' }}>
                <strong>Resume ID:</strong> {resumeId || 'Not set yet'} | 
                <strong> User ID:</strong> {currentUser.id} | 
                <strong> Time:</strong> {new Date().toLocaleTimeString()}
            </div>
            
            {/* Personal Details Form */}
            <div style={{ border: '2px solid #007bff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>👤 Personal Details</h2>
                
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Full Name *:</strong></label><br/>
                    <input 
                        type="text" 
                        value={personalDetails.full_name} 
                        onChange={(e) => setPersonalDetails({...personalDetails, full_name: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '2px solid #ccc', fontSize: '16px' }}
                        placeholder="Enter your full name"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Email *:</strong></label><br/>
                    <input 
                        type="email" 
                        value={personalDetails.email} 
                        onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '2px solid #ccc', fontSize: '16px' }}
                        placeholder="Enter your email"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Phone:</strong></label><br/>
                    <input 
                        type="tel" 
                        value={personalDetails.phone} 
                        onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '2px solid #ccc', fontSize: '16px' }}
                        placeholder="+91-9999999999"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Address:</strong></label><br/>
                    <input 
                        type="text" 
                        value={personalDetails.address} 
                        onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '2px solid #ccc', fontSize: '16px' }}
                        placeholder="Mumbai, Maharashtra, India"
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label><strong>Professional Summary:</strong></label><br/>
                    <textarea 
                        value={personalDetails.professional_summary} 
                        onChange={(e) => setPersonalDetails({...personalDetails, professional_summary: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '2px solid #ccc', height: '100px', fontSize: '16px' }}
                        placeholder="Experienced Full Stack Developer with 3+ years building scalable web applications..."
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={savePersonalDetails} 
                        disabled={saving || !resumeId}
                        style={{ 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            padding: '15px 25px', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        {saving ? '💾 Saving...' : '💾 Save Personal Details'}
                    </button>
                    
                    <button 
                        onClick={() => window.open(`/resume/view/${resumeId}`, '_blank')}
                        disabled={!resumeId}
                        style={{ 
                            backgroundColor: '#17a2b8', 
                            color: 'white', 
                            padding: '15px 25px', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: !resumeId ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        👁️ View Resume
                    </button>
                    
                    <button 
                        onClick={downloadPDF}
                        disabled={!resumeId}
                        style={{ 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            padding: '15px 25px', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: !resumeId ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        📥 Download PDF (BLACK TEXT)
                    </button>
                </div>
            </div>
            
            {/* Sample Data Button */}
            <button 
                onClick={() => setPersonalDetails({
                    full_name: currentUser.full_name || currentUser.name || 'John Doe',
                    email: currentUser.email || 'john.doe@email.com',
                    phone: '+91-9999999999',
                    address: 'Mumbai, Maharashtra, India',
                    professional_summary: 'Experienced Full Stack Developer with 3+ years building scalable web applications using React, Node.js, and PostgreSQL. Passionate about creating efficient, user-friendly solutions.'
                })}
                style={{ 
                    backgroundColor: '#ffc107', 
                    color: 'black', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                🎯 Fill Sample Data
            </button>
        </div>
    );
};

// 🔧 FIXED: ENHANCED DASHBOARD with User-Specific Resumes and Multiple Delete
const EnhancedDashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [selectedResumes, setSelectedResumes] = useState([]); // 🔧 NEW: Selected resumes array
    const currentUser = useCurrentUser(); // 🔧 Dynamic user

    useEffect(() => {
        if (currentUser) {
            fetchUserResumes();
        }
    }, [currentUser]);

    const fetchUserResumes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 🔧 FIXED: Ensure current user exists
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.full_name || currentUser.name
            });
            
            // 🔧 FIXED: Fetch resumes for current user only
            console.log('🔍 Fetching resumes for user:', currentUser.id);
            const response = await axios.get(`http://localhost:5001/api/resumes/user/${currentUser.id}`);
            setResumes(response.data || []);
            console.log('✅ Dashboard loaded resumes for user', currentUser.id, ':', response.data);
            
            // Reset selection
            setSelectedResumes([]);
            
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setError('Failed to load resumes: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const createNewResume = async () => {
        try {
            setCreating(true);
            
            // 🔧 FIXED: Create resume for current user
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: currentUser.id,
                title: `Resume ${new Date().toLocaleDateString()}`
            });
            
            console.log('✅ Created new resume for user', currentUser.id, ':', response.data);
            
            // Redirect to the working form with the new resume ID
            window.location.href = `/working-form?resumeId=${response.data.id}`;
            
        } catch (error) {
            console.error('Error creating resume:', error);
            alert('Failed to create resume: ' + (error.response?.data?.error || error.message));
            setCreating(false);
        }
    };

    const deleteResume = async (resumeId, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }
        
        try {
            await axios.delete(`http://localhost:5001/api/resumes/${resumeId}`);
            alert('Resume deleted successfully!');
            fetchUserResumes(); // Refresh the list
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume: ' + (error.response?.data?.error || error.message));
        }
    };

    // 🔧 NEW: Toggle resume selection
    const toggleResumeSelection = (resumeId) => {
        setSelectedResumes(prev => {
            if (prev.includes(resumeId)) {
                return prev.filter(id => id !== resumeId);
            } else {
                return [...prev, resumeId];
            }
        });
    };

    // 🔧 NEW: Delete selected resumes
    const deleteSelectedResumes = async () => {
        if (selectedResumes.length === 0) {
            return alert('No resumes selected!');
        }
        
        if (!window.confirm(`Are you sure you want to delete ${selectedResumes.length} selected resumes? This action cannot be undone.`)) {
            return;
        }
        
        try {
            // Delete each selected resume
            for (const resumeId of selectedResumes) {
                await axios.delete(`http://localhost:5001/api/resumes/${resumeId}`);
            }
            
            alert(`${selectedResumes.length} resumes deleted successfully!`);
            setSelectedResumes([]); // Clear selection
            fetchUserResumes(); // Refresh list
        } catch (error) {
            console.error('Error deleting selected resumes:', error);
            alert('Failed to delete some resumes: ' + (error.response?.data?.error || error.message));
        }
    };

    // 🔧 NEW: Select/Deselect all resumes
    const toggleSelectAll = () => {
        if (selectedResumes.length === resumes.length) {
            setSelectedResumes([]); // Deselect all
        } else {
            setSelectedResumes(resumes.map(resume => resume.id)); // Select all
        }
    };

    const viewResume = (resumeId) => {
        window.open(`/resume/view/${resumeId}`, '_blank');
    };

    const downloadResume = (resumeId) => {
        window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf?textColor=black`, '_blank');
    };

    const editResume = (resumeId) => {
        window.location.href = `/working-form?resumeId=${resumeId}`;
    };

    if (!currentUser) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Please log in to view your dashboard</h2>
                <button onClick={() => window.location.href = '/login'}>Go to Login</button>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <p style={{ color: '#666', fontSize: '18px' }}>Loading resumes for {currentUser.full_name || currentUser.name}...</p>
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
            {/* Header with User Info */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h1 style={{ 
                    margin: '0 0 10px 0', 
                    color: '#2c3e50',
                    fontSize: '32px',
                    fontWeight: 'bold'
                }}>
                    📋 {currentUser.full_name || currentUser.name}'s Resume Dashboard
                </h1>
                <p style={{ 
                    color: '#666', 
                    margin: '0 0 10px 0',
                    fontSize: '16px'
                }}>
                    Welcome back! Manage your professional resumes
                </p>
                <p style={{ 
                    color: '#888', 
                    margin: '0 0 25px 0',
                    fontSize: '14px'
                }}>
                    User ID: {currentUser.id} | Email: {currentUser.email}
                </p>
                
                {/* Create New Resume Button */}
                <button 
                    onClick={createNewResume}
                    disabled={creating}
                    style={{
                        backgroundColor: creating ? '#6c757d' : '#28a745',
                        color: 'white',
                        padding: '15px 30px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: creating ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(40,167,69,0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    {creating ? '⏳ Creating...' : '➕ Create New Resume'}
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }}>
                    <strong>⚠️ Error:</strong> {error}
                    <button 
                        onClick={fetchUserResumes}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            marginLeft: '15px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Retry
                    </button>
                </div>
            )}

            {/* Resume List - User-Specific with Multiple Delete */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ 
                        margin: '0', 
                        color: '#2c3e50',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        📄 Your Resumes ({resumes.length})
                    </h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={toggleSelectAll}
                            style={{
                                backgroundColor: '#ffc107',
                                color: '#000',
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {selectedResumes.length === resumes.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button 
                            onClick={deleteSelectedResumes}
                            disabled={selectedResumes.length === 0}
                            style={{
                                backgroundColor: selectedResumes.length === 0 ? '#6c757d' : '#dc3545',
                                color: 'white',
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: selectedResumes.length === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Delete Selected ({selectedResumes.length})
                        </button>
                    </div>
                </div>
                
                {resumes.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '50px 20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        border: '2px dashed #dee2e6'
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
                        <h3 style={{ color: '#6c757d', margin: '0 0 15px 0' }}>No Resumes Yet</h3>
                        <p style={{ color: '#6c757d', margin: '0 0 25px 0' }}>
                            Create your first professional resume to get started!
                        </p>
                        <button 
                            onClick={createNewResume}
                            disabled={creating}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '12px 25px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {creating ? '⏳ Creating...' : '🚀 Create Your First Resume'}
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {resumes.map((resume) => (
                            <div key={resume.id} style={{
                                border: '1px solid #e9ecef',
                                borderRadius: '10px',
                                padding: '25px',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <input
                                    type="checkbox"
                                    checked={selectedResumes.includes(resume.id)}
                                    onChange={() => toggleResumeSelection(resume.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ marginRight: '15px', transform: 'scale(1.2)' }}
                                />
                                
                                <div style={{ flex: '1', marginRight: '20px' }} onClick={() => viewResume(resume.id)}>
                                    <h3 style={{ 
                                        margin: '0 0 8px 0', 
                                        color: '#2c3e50',
                                        fontSize: '22px',
                                        fontWeight: 'bold'
                                    }}>
                                        {resume.title}
                                    </h3>
                                    
                                    <div style={{ 
                                        fontSize: '14px', 
                                        color: '#6c757d',
                                        marginBottom: '15px'
                                    }}>
                                        Updated on {new Date(resume.updated_at).toLocaleDateString('en-GB')} • Template: Modern
                                    </div>

                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '8px 12px',
                                        borderRadius: '20px',
                                        display: 'inline-block',
                                        fontSize: '12px',
                                        color: '#495057',
                                        fontFamily: 'monospace'
                                    }}>
                                        ID: {resume.id} | Owner: {currentUser.full_name || currentUser.name}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewResume(resume.id);
                                        }}
                                        style={{
                                            backgroundColor: '#17a2b8',
                                            color: 'white',
                                            padding: '8px 15px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        👁️ View
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            editResume(resume.id);
                                        }}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            padding: '8px 15px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadResume(resume.id);
                                        }}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            padding: '8px 15px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        📥 PDF (BLACK)
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteResume(resume.id, resume.title);
                                        }}
                                        style={{
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            padding: '8px 15px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ 
                marginTop: '30px',
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>🚀 Quick Actions</h3>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => window.location.href = '/working-form'}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        📝 Complete Form Builder
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/test-resume'}
                        style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🎯 Simple Builder
                    </button>
                    
                    <button 
                        onClick={fetchUserResumes}
                        style={{
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Refresh List
                    </button>
                </div>
            </div>
        </div>
    );
};

// 🔧 FIXED: WORKING RESUME FORM with Dynamic User
const WorkingResumeForm = () => {
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('Initializing...');
    const [redirecting, setRedirecting] = useState(false);
    const currentUser = useCurrentUser(); // 🔧 Dynamic user

    // Form data states (keep all your existing state)
    const [personalDetails, setPersonalDetails] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        professional_summary: ''
    });

    const [education, setEducation] = useState([{
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        current: false,
        grade_gpa: '',
        description: ''
    }]);

    const [experience, setExperience] = useState([{
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        current: false,
        description: ''
    }]);

    const [projects, setProjects] = useState([{
        name: '',
        description: '',
        technologies: '',
        url: '',
        start_date: '',
        end_date: ''
    }]);

    const [skills, setSkills] = useState([{
        category: 'Technical',
        skill_name: '',
        proficiency_level: 'Intermediate'
    }]);

    useEffect(() => {
        if (currentUser) {
            initializeResume();
        }
    }, [currentUser]);

    const initializeResume = async () => {
        try {
            setStatus('🔄 Setting up complete resume form...');
            
            await axios.get('http://localhost:5001/api/health');
            setStatus('✅ Backend connected');

            // 🔧 FIXED: Use current user data
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.full_name || currentUser.name
            });

            // 🔧 FIXED: Create resume for current user
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: currentUser.id,
                title: 'My Complete Resume'
            });

            setResumeId(response.data.id);
            setStatus(`✅ Resume form ready! ID: ${response.data.id} for user: ${currentUser.id}`);

        } catch (error) {
            console.error('Error:', error);
            setStatus('❌ Error: ' + (error.response?.data?.error || error.message));
        }
    };

    // Education handlers
    const addEducation = () => {
        setEducation([...education, {
            institution: '',
            degree: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            current: false,
            grade_gpa: '',
            description: ''
        }]);
    };

    const removeEducation = (index) => {
        if (education.length > 1) {
            setEducation(education.filter((_, i) => i !== index));
        }
    };

    const updateEducation = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    // Experience handlers
    const addExperience = () => {
        setExperience([...experience, {
            company: '',
            position: '',
            location: '',
            start_date: '',
            end_date: '',
            current: false,
            description: ''
        }]);
    };

    const removeExperience = (index) => {
        if (experience.length > 1) {
            setExperience(experience.filter((_, i) => i !== index));
        }
    };

    const updateExperience = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

    // Projects handlers
    const addProject = () => {
        setProjects([...projects, {
            name: '',
            description: '',
            technologies: '',
            url: '',
            start_date: '',
            end_date: ''
        }]);
    };

    const removeProject = (index) => {
        if (projects.length > 1) {
            setProjects(projects.filter((_, i) => i !== index));
        }
    };

    const updateProject = (index, field, value) => {
        const updated = [...projects];
        updated[index][field] = value;
        setProjects(updated);
    };

    // Skills handlers
    const addSkill = () => {
        setSkills([...skills, {
            category: 'Technical',
            skill_name: '',
            proficiency_level: 'Intermediate'
        }]);
    };

    const removeSkill = (index) => {
        if (skills.length > 1) {
            setSkills(skills.filter((_, i) => i !== index));
        }
    };

    const updateSkill = (index, field, value) => {
        const updated = [...skills];
        updated[index][field] = value;
        setSkills(updated);
    };

    // Save all sections at once
    const saveCompleteResume = async () => {
        if (!resumeId) {
            alert('No resume ID found!');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving complete resume...');

        try {
            // Save Personal Details
            console.log('Saving personal details...', personalDetails);
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/personal-details`, personalDetails);

            // Save Education
            const validEducation = education.filter(edu => edu.institution?.trim() && edu.degree?.trim());
            if (validEducation.length > 0) {
                console.log('Saving education...', validEducation);
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/education`, validEducation);
            }

            // Save Experience
            const validExperience = experience.filter(exp => exp.company?.trim() && exp.position?.trim());
            if (validExperience.length > 0) {
                console.log('Saving experience...', validExperience);
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/experience`, validExperience);
            }

            // Save Projects (if backend supports it)
            const validProjects = projects.filter(proj => proj.name?.trim());
            if (validProjects.length > 0) {
                console.log('Saving projects...', validProjects);
                try {
                    await axios.post(`http://localhost:5001/api/resumes/${resumeId}/projects`, validProjects);
                } catch (error) {
                    console.log('Projects API not available, skipping...');
                }
            }

            // Save Skills
            const validSkills = skills.filter(skill => skill.skill_name?.trim());
            if (validSkills.length > 0) {
                console.log('Saving skills...', validSkills);
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/skills`, validSkills);
            }

            setStatus('✅ Complete resume saved successfully!');
            alert('✅ Resume saved successfully!');

        } catch (error) {
            console.error('Save error:', error);
            setStatus('❌ Save failed: ' + (error.response?.data?.error || error.message));
            alert('❌ Save failed: ' + (error.response?.data?.error || error.message));
        }
        setSaving(false);
    };

    // ENHANCED: Save with Dashboard Redirect
    const saveCompleteResumeAndRedirect = async () => {
        if (!resumeId) {
            alert('No resume ID found!');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving complete resume...');

        try {
            // Save Personal Details
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/personal-details`, personalDetails);

            // Save Education
            const validEducation = education.filter(edu => edu.institution?.trim() && edu.degree?.trim());
            if (validEducation.length > 0) {
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/education`, validEducation);
            }

            // Save Experience
            const validExperience = experience.filter(exp => exp.company?.trim() && exp.position?.trim());
            if (validExperience.length > 0) {
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/experience`, validExperience);
            }

            // Save Projects
            const validProjects = projects.filter(proj => proj.name?.trim());
            if (validProjects.length > 0) {
                try {
                    await axios.post(`http://localhost:5001/api/resumes/${resumeId}/projects`, validProjects);
                } catch (error) {
                    console.log('Projects API not available, skipping...');
                }
            }

            // Save Skills
            const validSkills = skills.filter(skill => skill.skill_name?.trim());
            if (validSkills.length > 0) {
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/skills`, validSkills);
            }

            setStatus('✅ Resume saved! Redirecting to dashboard...');
            setRedirecting(true);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);

        } catch (error) {
            console.error('Save error:', error);
            setStatus('❌ Save failed: ' + (error.response?.data?.error || error.message));
            alert('❌ Save failed: ' + (error.response?.data?.error || error.message));
            setSaving(false);
        }
    };

    // 🔧 FIXED: Enhanced PDF download with black text
    const downloadPDF = async () => {
        if (!resumeId) {
            alert('No resume to download!');
            return;
        }
        
        setStatus('📥 Preparing PDF - saving data first...');
        
        try {
            // First save the current data
            await saveCompleteResume();
            
            // Wait a moment for data to be committed
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Then download PDF with BLACK TEXT
            setStatus('📥 Generating professional PDF with BLACK text...');
            window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf?textColor=black`, '_blank');
            setStatus('✅ Professional PDF generated with BLACK text!');
            
        } catch (error) {
            console.error('PDF generation error:', error);
            // If save fails, still try to download with BLACK TEXT
            window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf?textColor=black`, '_blank');
            setStatus('⚠️ PDF generated (save may have failed)');
        }
    };

    // Fill sample data with current user info
    const fillAllSampleData = () => {
        setPersonalDetails({
            full_name: currentUser.full_name || currentUser.name || 'Abhishek Pattanashetti',
            email: currentUser.email || 'abhishekap0726@gmail.com',
            phone: '+91-9999999999',
            address: 'Mumbai, Maharashtra, India',
            linkedin_url: 'https://linkedin.com/in/yourprofile',
            github_url: 'https://github.com/yourusername',
            portfolio_url: 'https://yourportfolio.dev',
            professional_summary: 'Experienced Full Stack Developer with 3+ years building scalable web applications using React, Node.js, and PostgreSQL. Passionate about creating efficient, user-friendly solutions and staying current with emerging technologies.'
        });

        setEducation([
            {
                institution: 'Mumbai University',
                degree: 'Bachelor of Engineering',
                field_of_study: 'Computer Science',
                start_date: '2017-06-01',
                end_date: '2021-05-01',
                current: false,
                grade_gpa: '8.5 CGPA',
                description: 'Focused on software engineering, data structures, and algorithms. Completed projects in web development and machine learning.'
            },
            {
                institution: 'ABC College',
                degree: 'Higher Secondary Certificate',
                field_of_study: 'Science',
                start_date: '2015-06-01',
                end_date: '2017-05-01',
                current: false,
                grade_gpa: '85%',
                description: 'Mathematics, Physics, Chemistry with Computer Science.'
            }
        ]);

        setExperience([
            {
                company: 'Tech Solutions Inc',
                position: 'Senior Full Stack Developer',
                location: 'Mumbai, India',
                start_date: '2022-01-01',
                end_date: '',
                current: true,
                description: `• Developed and maintained 5+ web applications using React and Node.js\n• Improved application performance by 40% through code optimization\n• Led a team of 3 junior developers on critical projects\n• Implemented CI/CD pipelines reducing deployment time by 60%`
            },
            {
                company: 'StartupXYZ',
                position: 'Frontend Developer',
                location: 'Mumbai, India',
                start_date: '2021-06-01',
                end_date: '2021-12-01',
                current: false,
                description: `• Built responsive web interfaces using React and CSS frameworks\n• Collaborated with design team to implement pixel-perfect UIs\n• Optimized web performance resulting in 25% faster load times\n• Mentored 2 junior developers in modern frontend practices`
            }
        ]);

        setProjects([
            {
                name: 'E-commerce Platform',
                description: 'Full-stack e-commerce solution with payment integration, user authentication, and admin panel. Built with React, Node.js, and PostgreSQL.',
                technologies: 'React, Node.js, PostgreSQL, Stripe API, JWT',
                url: 'https://github.com/abhishek/ecommerce-platform',
                start_date: '2023-01-01',
                end_date: '2023-06-01'
            },
            {
                name: 'Resume Builder Platform',
                description: 'Web application for creating professional resumes with multiple templates and PDF export functionality.',
                technologies: 'React, Express.js, PDFKit, PostgreSQL',
                url: 'https://github.com/abhishek/resume-builder',
                start_date: '2023-07-01',
                end_date: '2023-09-01'
            }
        ]);

        setSkills([
            { category: 'Programming', skill_name: 'JavaScript', proficiency_level: 'Expert' },
            { category: 'Programming', skill_name: 'TypeScript', proficiency_level: 'Advanced' },
            { category: 'Technical', skill_name: 'React', proficiency_level: 'Expert' },
            { category: 'Technical', skill_name: 'Node.js', proficiency_level: 'Advanced' },
            { category: 'Database', skill_name: 'PostgreSQL', proficiency_level: 'Advanced' },
            { category: 'Database', skill_name: 'MongoDB', proficiency_level: 'Intermediate' },
            { category: 'Tools', skill_name: 'Docker', proficiency_level: 'Intermediate' },
            { category: 'Tools', skill_name: 'Git', proficiency_level: 'Advanced' }
        ]);

        setStatus('✅ All sample data filled with your user info!');
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        padding: '8px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    };

    // Back to Dashboard function
    const backToDashboard = () => {
        if (window.confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
            window.location.href = '/dashboard';
        }
    };

    if (!currentUser) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Please log in to use the resume builder</h2>
                <button onClick={() => window.location.href = '/login'}>Go to Login</button>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            backgroundColor: '#f5f5f5',
            minHeight: '100vh' 
        }}>
            {/* ENHANCED Header with Back Button and User Info */}
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '30px',
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                {/* Back to Dashboard Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                    <button 
                        onClick={backToDashboard}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: '#6c757d', 
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <h1 style={{ color: '#28a745', margin: '0' }}>📝 Complete Resume Form</h1>
                <p style={{ color: '#666', margin: '10px 0' }}>
                    Creating resume for: <strong>{currentUser.full_name || currentUser.name} ({currentUser.email})</strong>
                </p>
                
                {/* Status */}
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#d1ecf1',
                    color: status.includes('✅') ? '#155724' : status.includes('❌') ? '#721c24' : '#0c5460',
                    borderRadius: '6px',
                    marginTop: '15px',
                    fontWeight: 'bold'
                }}>
                    {status} | Resume ID: {resumeId || 'Not set'} | User ID: {currentUser.id}
                </div>

                {/* Quick Actions */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={fillAllSampleData}
                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000' }}
                        disabled={redirecting}
                    >
                        🎯 Fill All Sample Data
                    </button>
                    <button 
                        onClick={saveCompleteResume}
                        disabled={saving || !resumeId || redirecting}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: (saving || redirecting) ? '#6c757d' : '#28a745', 
                            color: 'white' 
                        }}
                    >
                        {saving ? '💾 Saving...' : '💾 Save Resume'}
                    </button>
                    <button 
                        onClick={() => window.open(`/resume/view/${resumeId}`, '_blank')}
                        disabled={!resumeId || redirecting}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: (!resumeId || redirecting) ? '#6c757d' : '#17a2b8', 
                            color: 'white' 
                        }}
                    >
                        👁️ View Resume
                    </button>
                    <button 
                        onClick={downloadPDF}
                        disabled={!resumeId || redirecting}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: (!resumeId || redirecting) ? '#6c757d' : '#dc3545', 
                            color: 'white' 
                        }}
                    >
                        📥 Download PDF (BLACK)
                    </button>
                </div>
            </div>

            {/* Personal Details */}
            <div style={{ backgroundColor: 'white', padding: '25px', marginBottom: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#333', marginTop: '0', marginBottom: '20px' }}>👤 Personal Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name *</label>
                        <input 
                            type="text" 
                            value={personalDetails.full_name} 
                            onChange={(e) => setPersonalDetails({...personalDetails, full_name: e.target.value})}
                            style={inputStyle}
                            placeholder={currentUser.full_name || currentUser.name || "Enter your full name"}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email *</label>
                        <input 
                            type="email" 
                            value={personalDetails.email} 
                            onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                            style={inputStyle}
                            placeholder={currentUser.email || "your.email@example.com"}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                        <input 
                            type="tel" 
                            value={personalDetails.phone} 
                            onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                            style={inputStyle}
                            placeholder="+91-9999999999"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Address</label>
                        <input 
                            type="text" 
                            value={personalDetails.address} 
                            onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                            style={inputStyle}
                            placeholder="City, State, Country"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>LinkedIn URL</label>
                        <input 
                            type="url" 
                            value={personalDetails.linkedin_url} 
                            onChange={(e) => setPersonalDetails({...personalDetails, linkedin_url: e.target.value})}
                            style={inputStyle}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>GitHub URL</label>
                        <input 
                            type="url" 
                            value={personalDetails.github_url} 
                            onChange={(e) => setPersonalDetails({...personalDetails, github_url: e.target.value})}
                            style={inputStyle}
                            placeholder="https://github.com/yourusername"
                        />
                    </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Portfolio URL</label>
                    <input 
                        type="url" 
                        value={personalDetails.portfolio_url} 
                        onChange={(e) => setPersonalDetails({...personalDetails, portfolio_url: e.target.value})}
                        style={inputStyle}
                        placeholder="https://yourportfolio.com"
                    />
                </div>
                <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Professional Summary</label>
                    <textarea 
                        value={personalDetails.professional_summary} 
                        onChange={(e) => setPersonalDetails({...personalDetails, professional_summary: e.target.value})}
                        style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                        placeholder="Brief summary of your professional background and key skills..."
                    />
                </div>
            </div>

            {/* Education */}
            <div style={{ backgroundColor: 'white', padding: '25px', marginBottom: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#333', margin: '0' }}>🎓 Education ({education.length})</h3>
                    <button 
                        onClick={addEducation}
                        style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                    >
                        + Add Education
                    </button>
                </div>
                
                {education.map((edu, index) => (
                    <div key={index} style={{ 
                        border: '2px solid #e0e0e0', 
                        padding: '20px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4 style={{ margin: '0', color: '#333' }}>Education {index + 1}</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {education.length > 1 && (
                                    <button 
                                        onClick={() => removeEducation(index)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Institution</label>
                                <input 
                                    type="text" 
                                    value={edu.institution} 
                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                    style={inputStyle}
                                    placeholder="University/College name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Degree</label>
                                <input 
                                    type="text" 
                                    value={edu.degree} 
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Bachelor of Engineering"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Field of Study</label>
                                <input 
                                    type="text" 
                                    value={edu.field_of_study} 
                                    onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Computer Science"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={edu.start_date} 
                                    onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={edu.end_date} 
                                    onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                                    style={inputStyle}
                                    disabled={edu.current}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>GPA/Grade</label>
                                <input 
                                    type="text" 
                                    value={edu.grade_gpa} 
                                    onChange={(e) => updateEducation(index, 'grade_gpa', e.target.value)}
                                    style={inputStyle}
                                    placeholder="8.5 CGPA or 85%"
                                />
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                <input 
                                    type="checkbox" 
                                    checked={edu.current} 
                                    onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Currently studying here
                            </label>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
                            <textarea 
                                value={edu.description} 
                                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                style={{ ...inputStyle, height: '80px' }}
                                placeholder="Additional details about your education..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Experience */}
            <div style={{ backgroundColor: 'white', padding: '25px', marginBottom: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#333', margin: '0' }}>💼 Work Experience ({experience.length})</h3>
                    <button 
                        onClick={addExperience}
                        style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                    >
                        + Add Experience
                    </button>
                </div>
                
                {experience.map((exp, index) => (
                    <div key={index} style={{ 
                        border: '2px solid #e0e0e0', 
                        padding: '20px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4 style={{ margin: '0', color: '#333' }}>Experience {index + 1}</h4>
                            {experience.length > 1 && (
                                <button 
                                    onClick={() => removeExperience(index)}
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Company</label>
                                <input 
                                    type="text" 
                                    value={exp.company} 
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Company name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Position</label>
                                <input 
                                    type="text" 
                                    value={exp.position} 
                                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Job title"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Location</label>
                                <input 
                                    type="text" 
                                    value={exp.location} 
                                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                    style={inputStyle}
                                    placeholder="City, Country"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={exp.start_date} 
                                    onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={exp.end_date} 
                                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                    style={inputStyle}
                                    disabled={exp.current}
                                />
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                <input 
                                    type="checkbox" 
                                    checked={exp.current} 
                                    onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Currently working here
                            </label>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Job Description</label>
                            <textarea 
                                value={exp.description} 
                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                style={{ ...inputStyle, height: '120px' }}
                                placeholder="• Developed and maintained web applications&#10;• Improved performance by 40%&#10;• Led team of 3 developers"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects */}
            <div style={{ backgroundColor: 'white', padding: '25px', marginBottom: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#333', margin: '0' }}>🚀 Projects ({projects.length})</h3>
                    <button 
                        onClick={addProject}
                        style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                    >
                        + Add Project
                    </button>
                </div>
                
                {projects.map((proj, index) => (
                    <div key={index} style={{ 
                        border: '2px solid #e0e0e0', 
                        padding: '20px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4 style={{ margin: '0', color: '#333' }}>Project {index + 1}</h4>
                            {projects.length > 1 && (
                                <button 
                                    onClick={() => removeProject(index)}
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Project Name</label>
                                <input 
                                    type="text" 
                                    value={proj.name} 
                                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                                    style={inputStyle}
                                    placeholder="E-commerce Platform"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Technologies</label>
                                <input 
                                    type="text" 
                                    value={proj.technologies} 
                                    onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                                    style={inputStyle}
                                    placeholder="React, Node.js, PostgreSQL"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Project URL</label>
                                <input 
                                    type="url" 
                                    value={proj.url} 
                                    onChange={(e) => updateProject(index, 'url', e.target.value)}
                                    style={inputStyle}
                                    placeholder="https://github.com/username/project"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={proj.start_date} 
                                    onChange={(e) => updateProject(index, 'start_date', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={proj.end_date} 
                                    onChange={(e) => updateProject(index, 'end_date', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Project Description</label>
                            <textarea 
                                value={proj.description} 
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                style={{ ...inputStyle, height: '100px' }}
                                placeholder="Describe the project, its features, and your role in building it..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div style={{ backgroundColor: 'white', padding: '25px', marginBottom: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#333', margin: '0' }}>🛠️ Skills ({skills.length})</h3>
                    <button 
                        onClick={addSkill}
                        style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                    >
                        + Add Skill
                    </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                    {skills.map((skill, index) => (
                        <div key={index} style={{ 
                            border: '2px solid #e0e0e0', 
                            padding: '15px', 
                            borderRadius: '6px',
                            backgroundColor: '#fafafa'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h5 style={{ margin: '0', color: '#333' }}>Skill {index + 1}</h5>
                                {skills.length > 1 && (
                                    <button 
                                        onClick={() => removeSkill(index)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', fontSize: '12px' }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Category</label>
                                <select 
                                    value={skill.category} 
                                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="Technical">Technical</option>
                                    <option value="Programming">Programming</option>
                                    <option value="Database">Database</option>
                                    <option value="Tools">Tools</option>
                                    <option value="Soft Skills">Soft Skills</option>
                                    <option value="Languages">Languages</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Skill Name</label>
                                <input 
                                    type="text" 
                                    value={skill.skill_name} 
                                    onChange={(e) => updateSkill(index, 'skill_name', e.target.value)}
                                    style={inputStyle}
                                    placeholder="e.g., React, JavaScript, etc."
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Proficiency</label>
                                <select 
                                    value={skill.proficiency_level} 
                                    onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ENHANCED Final Action Buttons */}
            <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ color: '#333', marginTop: '0' }}>🎉 Ready to Generate Your Professional Resume?</h3>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                    Education: {education.length} entries | 
                    Experience: {experience.length} entries | 
                    Projects: {projects.length} entries | 
                    Skills: {skills.length} entries
                </p>
                
                {redirecting && (
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontWeight: 'bold'
                    }}>
                        🎉 Resume saved successfully! Redirecting to dashboard...
                    </div>
                )}
                
                <div>
                    {/* Save & Go to Dashboard Button */}
                    <button 
                        onClick={saveCompleteResumeAndRedirect}
                        disabled={saving || !resumeId || redirecting}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: (saving || redirecting) ? '#6c757d' : '#007bff', 
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                    >
                        {saving ? '💾 Saving...' : redirecting ? '🔄 Redirecting...' : '💾 Save & Go to Dashboard'}
                    </button>
                    
                    <button 
                        onClick={() => window.open(`/resume/view/${resumeId}`, '_blank')}
                        disabled={!resumeId || redirecting}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: (!resumeId || redirecting) ? '#6c757d' : '#17a2b8', 
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                    >
                        👁️ View Professional Resume
                    </button>
                    
                    <button 
                        onClick={downloadPDF}
                        disabled={!resumeId || redirecting}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: (!resumeId || redirecting) ? '#6c757d' : '#dc3545', 
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                    >
                        📥 Download Complete PDF (BLACK TEXT)
                    </button>
                </div>
            </div>
        </div>
    );
};

// 📖 RESUME VIEWER COMPONENT (Keep existing - no changes needed)
const ResumeViewer = () => {
    const [resumeId, setResumeId] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get resumeId from URL
        const path = window.location.pathname;
        const id = path.split('/').pop();
        if (id && !isNaN(id)) {
            setResumeId(id);
            fetchResumeData(id);
        } else {
            setError('Invalid resume ID');
            setLoading(false);
        }
    }, []);

    const fetchResumeData = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5001/api/resumes/${id}/view`);
            setResumeData(response.data);
            console.log('Resume data loaded:', response.data);
        } catch (error) {
            console.error('Error fetching resume:', error);
            setError(error.response?.data?.error || 'Failed to load resume');
        } finally {
            setLoading(false);
        }
    };

    // 🔧 FIXED: PDF download with black text
    const downloadPDF = () => {
        window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf?textColor=black`, '_blank');
    };

    const editResume = () => {
        window.open(`/working-form`, '_blank');
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
                    borderTop: '5px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                <p style={{ color: '#666' }}>Loading resume...</p>
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

    if (error || !resumeData) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '50px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '8px',
                margin: '20px'
            }}>
                <h2>❌ Error Loading Resume</h2>
                <p>{error || 'Resume not found'}</p>
                <button 
                    onClick={() => window.location.href = '/working-form'}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '15px'
                    }}
                >
                    Create New Resume
                </button>
            </div>
        );
    }

    const { resume, personalDetails, education, experience, projects, skills } = resumeData;

    return (
        <div style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '20px',
            backgroundColor: '#f9f9f9',
            minHeight: '100vh'
        }}>
            {/* Header with Actions */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div>
                    <h1 style={{ margin: '0', color: '#2c3e50' }}>📄 {resume.title}</h1>
                    <p style={{ color: '#666', margin: '5px 0 0 0' }}>
                        Created: {new Date(resume.created_at).toLocaleDateString()} | 
                        Updated: {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                        onClick={editResume}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        ✏️ Edit Resume
                    </button>
                    <button 
                        onClick={downloadPDF}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        📥 Download PDF (BLACK TEXT)
                    </button>
                </div>
            </div>

            {/* Resume Preview */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif'
            }}>
                
                {/* Personal Details Header */}
                <div style={{ 
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    padding: '30px',
                    margin: '-40px -40px 30px -40px',
                    borderRadius: '10px 10px 0 0'
                }}>
                    <h1 style={{ margin: '0', fontSize: '28px' }}>
                        {personalDetails.full_name || 'Name not provided'}
                    </h1>
                    <div style={{ marginTop: '15px', fontSize: '14px' }}>
                        {personalDetails.email && <span>📧 {personalDetails.email}</span>}
                        {personalDetails.phone && <span style={{ marginLeft: '20px' }}>📱 {personalDetails.phone}</span>}
                        {personalDetails.address && <span style={{ marginLeft: '20px' }}>📍 {personalDetails.address}</span>}
                    </div>
                    {(personalDetails.linkedin_url || personalDetails.github_url || personalDetails.portfolio_url) && (
                        <div style={{ marginTop: '10px', fontSize: '12px' }}>
                            {personalDetails.linkedin_url && (
                                <a href={personalDetails.linkedin_url} target="_blank" rel="noopener noreferrer" 
                                   style={{ color: '#87ceeb', marginRight: '15px', textDecoration: 'none' }}>
                                    💼 LinkedIn
                                </a>
                            )}
                            {personalDetails.github_url && (
                                <a href={personalDetails.github_url} target="_blank" rel="noopener noreferrer"
                                   style={{ color: '#87ceeb', marginRight: '15px', textDecoration: 'none' }}>
                                    🔗 GitHub
                                </a>
                            )}
                            {personalDetails.portfolio_url && (
                                <a href={personalDetails.portfolio_url} target="_blank" rel="noopener noreferrer"
                                   style={{ color: '#87ceeb', textDecoration: 'none' }}>
                                    🌐 Portfolio
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Professional Summary */}
                {personalDetails.professional_summary && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            color: '#2c3e50', 
                            borderBottom: '3px solid #3498db', 
                            paddingBottom: '5px',
                            display: 'inline-block'
                        }}>
                            PROFESSIONAL SUMMARY
                        </h2>
                        <p style={{ 
                            lineHeight: '1.6', 
                            color: '#444',
                            textAlign: 'justify'
                        }}>
                            {personalDetails.professional_summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            color: '#2c3e50', 
                            borderBottom: '3px solid #3498db', 
                            paddingBottom: '5px',
                            display: 'inline-block'
                        }}>
                            PROFESSIONAL EXPERIENCE
                        </h2>
                        {experience.map((exp, index) => (
                            <div key={index} style={{ marginBottom: '25px', paddingLeft: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '18px' }}>
                                            {exp.position}
                                        </h3>
                                        <h4 style={{ margin: '5px 0', color: '#3498db', fontSize: '16px' }}>
                                            {exp.company}
                                        </h4>
                                    </div>
                                    <div style={{ textAlign: 'right', color: '#666', fontSize: '14px' }}>
                                        {exp.location && <div>{exp.location}</div>}
                                        <div>
                                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                                        </div>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div style={{ marginTop: '10px', color: '#555', lineHeight: '1.5' }}>
                                        {exp.description.split('\n').map((line, i) => (
                                            <div key={i} style={{ marginBottom: '5px' }}>
                                                {line.trim().startsWith('•') ? line : `• ${line}`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            color: '#2c3e50', 
                            borderBottom: '3px solid #3498db', 
                            paddingBottom: '5px',
                            display: 'inline-block'
                        }}>
                            KEY PROJECTS
                        </h2>
                        {projects.map((project, index) => (
                            <div key={index} style={{ marginBottom: '20px', paddingLeft: '10px' }}>
                                <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '16px' }}>
                                    {project.name}
                                    {project.url && (
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" 
                                           style={{ marginLeft: '10px', fontSize: '12px', color: '#3498db' }}>
                                            🔗 View
                                        </a>
                                    )}
                                </h3>
                                {project.technologies && (
                                    <div style={{ color: '#3498db', fontSize: '14px', marginTop: '5px' }}>
                                        <strong>Technologies:</strong> {project.technologies}
                                    </div>
                                )}
                                {project.description && (
                                    <p style={{ color: '#555', lineHeight: '1.5', marginTop: '8px' }}>
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            color: '#2c3e50', 
                            borderBottom: '3px solid #3498db', 
                            paddingBottom: '5px',
                            display: 'inline-block'
                        }}>
                            EDUCATION
                        </h2>
                        {education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '20px', paddingLeft: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '16px' }}>
                                            {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                                        </h3>
                                        <h4 style={{ margin: '5px 0', color: '#3498db', fontSize: '14px' }}>
                                            {edu.institution}
                                        </h4>
                                    </div>
                                    <div style={{ textAlign: 'right', color: '#666', fontSize: '12px' }}>
                                        <div>
                                            {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                                        </div>
                                        {edu.grade_gpa && (
                                            <div style={{ color: '#27ae60', fontWeight: 'bold' }}>
                                                {edu.grade_gpa}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {edu.description && (
                                    <p style={{ color: '#555', fontSize: '14px', marginTop: '5px' }}>
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                            color: '#2c3e50', 
                            borderBottom: '3px solid #3498db', 
                            paddingBottom: '5px',
                            display: 'inline-block'
                        }}>
                            TECHNICAL SKILLS
                        </h2>
                        <div style={{ paddingLeft: '10px' }}>
                            {Object.entries(skills.reduce((acc, skill) => {
                                const category = skill.category || 'Other';
                                if (!acc[category]) acc[category] = [];
                                acc[category].push(skill.skill_name);
                                return acc;
                            }, {})).map(([category, skillNames], index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <strong style={{ color: '#2c3e50' }}>{category}:</strong>
                                    <span style={{ marginLeft: '10px', color: '#555' }}>
                                        {skillNames.join(', ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ 
                    marginTop: '50px',
                    paddingTop: '20px',
                    borderTop: '2px solid #eee',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '12px'
                }}>
                    Generated on {new Date().toLocaleDateString()} | Resume ID: {resumeId} | Created with Resume Builder Platform
                </div>
            </div>
        </div>
    );
};

// Keep your existing QuickResumeCreator component
const QuickResumeCreator = () => {
  const goToPage = (url) => {
    window.location.href = url;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>🎯 Create Your Resume</h1>
      <p>Choose how you want to create your resume:</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
        <button
          onClick={() => goToPage('/test-resume')}
          style={{
            display: 'block',
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '20px 30px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(220,53,69,0.1)',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <h3 style={{margin: '0 0 10px 0'}}>🎯 Simple Builder</h3>
          <p style={{margin: '0'}}>Basic personal details form</p>
        </button>
        
        <button
          onClick={() => goToPage('/working-form')}
          style={{
            display: 'block',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '20px 30px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(40,167,69,0.1)',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <h3 style={{margin: '0 0 10px 0'}}>📝 Complete Form</h3>
          <p style={{margin: '0'}}>All sections with multiple entries!</p>
        </button>
        
        <button
          onClick={() => goToPage('/test-resume-form')}
          style={{
            display: 'block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '20px 30px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,123,255,0.1)',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <h3 style={{margin: '0 0 10px 0'}}>🚀 Alternative Form</h3>
          <p style={{margin: '0'}}>Basic sections</p>
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #c3e6cb' }}>
        <h3 style={{ color: '#155724', marginTop: '0' }}>🚀 DIRECT LINKS (Copy & Paste):</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', width: '100%', maxWidth: '500px', fontFamily: 'monospace' }}>
            http://localhost:3000/working-form
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', width: '100%', maxWidth: '500px', fontFamily: 'monospace' }}>
            http://localhost:3000/test-resume
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', width: '100%', maxWidth: '500px', fontFamily: 'monospace' }}>
            http://localhost:3000/test-resume-form
          </div>
        </div>
      </div>
    </div>
  );
};

// ENHANCED Protected Route Component - FIXED WITH TEST ROUTE BYPASS
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const currentPath = window.location.pathname;

  // COMPLETE BYPASS FOR TEST ROUTES
  if (isTestRoute(currentPath)) {
    console.log('🎯 BYPASSING PROTECTION for test route:', currentPath);
    return children;
  }

  // Loading state for non-test routes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Checking authentication...</div>
          <div className="text-sm text-gray-500">Path: {currentPath}</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (non-test routes only)
  if (!user) {
    console.log('🚫 Access denied - redirecting to login. Path:', currentPath);
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Simple Route Component - No Auth at all
const SimpleRoute = ({ children }) => {
  return <>{children}</>;
};

function App() {
  const currentPath = window.location.pathname;

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Always show Navbar */}
          <Navbar />
          
          <Routes>
            {/* 🚀 GUARANTEED WORKING TEST ROUTES - USER-AWARE */}
            <Route path="/test" element={<SimpleRoute><TestResumeBuilder /></SimpleRoute>} />
            <Route path="/test-resume" element={<SimpleRoute><TestResumeBuilder /></SimpleRoute>} />
            <Route path="/test-resume-form" element={<SimpleRoute><WorkingResumeForm /></SimpleRoute>} />
            <Route path="/working-form" element={<SimpleRoute><WorkingResumeForm /></SimpleRoute>} />
            <Route path="/test-resume-builder" element={<SimpleRoute><TestResumeBuilder /></SimpleRoute>} />

            {/* Resume View Route - No Auth Required */}
            <Route path="/resume/view/:resumeId" element={<SimpleRoute><ResumeViewer /></SimpleRoute>} />

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* 🔧 FIXED: Dashboard Route - Now User-Specific */}
            <Route
              path="/dashboard"
              element={
                <SimpleRoute>
                  <EnhancedDashboard />
                </SimpleRoute>
              }
            />

            {/* Resume Management Routes */}
            <Route
              path="/resumes"
              element={
                <ProtectedRoute>
                  <ResumeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Resume Builder Routes */}
            <Route
              path="/resume-builder/:resumeId"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resume-builder"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            {/* Resume Form Routes */}
            <Route
              path="/resume-form"
              element={
                <ProtectedRoute>
                  <ResumeForm />
                </ProtectedRoute>
              }
            />

            {/* Resume Creation Routes */}
            <Route
              path="/resume/new"
              element={
                <ProtectedRoute>
                  <QuickResumeCreator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resume/create"
              element={
                <ProtectedRoute>
                  <ResumeForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resume/edit/:id"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resume/builder/:id"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-resumes"
              element={
                <ProtectedRoute>
                  <ResumeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect old routes to new ones */}
            <Route path="/resumes/edit" element={<Navigate to="/resume/new" replace />} />
            <Route 
              path="/resumes/edit/:id" 
              element={<Navigate to="/resume-builder/:id" replace />} 
            />
            <Route path="/resumes/new" element={<Navigate to="/resume/new" replace />} />
            
            {/* Dashboard shortcuts */}
            <Route path="/resume-dashboard" element={<Navigate to="/resumes" replace />} />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
