import axios from 'axios';
import { useEffect, useState } from 'react';

const TestPage = () => {
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('🔄 Starting...');
    
    const [personalDetails, setPersonalDetails] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        professional_summary: ''
    });

    useEffect(() => {
        initializeResume();
    }, []);

    const initializeResume = async () => {
        try {
            setStatus('🧪 Testing backend connection...');
            
            // Test backend connection
            const healthCheck = await axios.get('http://localhost:5001/api/health');
            console.log('Backend health:', healthCheck.data);
            setStatus('✅ Backend connected successfully!');
            
            // Ensure user exists
            setStatus('👤 Setting up user...');
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: 1,
                email: 'test@example.com',
                full_name: 'Test User'
            });
            
            // Create new resume
            setStatus('📄 Creating resume...');
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: 1,
                title: 'My Professional Resume'
            });
            
            setResumeId(response.data.id);
            setStatus(`🎉 Success! Resume created with ID: ${response.data.id}`);
            
        } catch (error) {
            console.error('❌ Error:', error);
            setStatus(`❌ Error: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        }
    };

    const savePersonalDetails = async () => {
        if (!resumeId) {
            alert('❌ No resume ID found!');
            return;
        }

        if (!personalDetails.full_name || !personalDetails.email) {
            alert('Please fill in at least Name and Email');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving personal details...');
        
        try {
            const response = await axios.post(
                `http://localhost:5001/api/resumes/${resumeId}/personal-details`, 
                personalDetails
            );
            console.log('Save response:', response.data);
            setStatus('✅ Personal details saved successfully!');
            alert('✅ Personal details saved successfully!');
        } catch (error) {
            console.error('❌ Save error:', error);
            const errorMsg = error.response?.data?.error || error.message;
            setStatus(`❌ Save failed: ${errorMsg}`);
            alert(`❌ Save failed: ${errorMsg}`);
        }
        setSaving(false);
    };

    const downloadPDF = () => {
        if (!resumeId) {
            alert('❌ No resume found to download!');
            return;
        }
        
        setStatus('📥 Generating PDF...');
        const pdfUrl = `http://localhost:5001/api/resumes/${resumeId}/download-pdf`;
        console.log('Opening PDF URL:', pdfUrl);
        
        // Open in new tab
        window.open(pdfUrl, '_blank');
        setStatus('✅ PDF download initiated!');
    };

    const fillSampleData = () => {
        setPersonalDetails({
            full_name: 'Abhishek Pattanashetti',
            email: 'abhishekap0726@gmail.com',
            phone: '+91-9999999999',
            address: 'Mumbai, Maharashtra, India',
            professional_summary: 'Experienced Full Stack Developer with 3+ years building scalable web applications using React, Node.js, and PostgreSQL. Passionate about creating efficient, user-friendly solutions and staying current with emerging technologies.'
        });
    };

    return (
        <div style={{ 
            padding: '30px', 
            maxWidth: '900px', 
            margin: '0 auto', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#007bff', margin: '0' }}>🎯 Resume Builder Test Page</h1>
                <p style={{ color: '#666', margin: '10px 0 0 0' }}>Direct access - no login required!</p>
            </div>
            
            {/* Status Card */}
            <div style={{ 
                padding: '20px', 
                backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#cce7ff',
                color: status.includes('✅') ? '#155724' : status.includes('❌') ? '#721c24' : '#004085',
                borderRadius: '8px',
                marginBottom: '30px',
                border: '2px solid',
                borderColor: status.includes('✅') ? '#c3e6cb' : status.includes('❌') ? '#f5c6cb' : '#b3d7ff',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                <div>📊 Status: {status}</div>
                <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'normal' }}>
                    Resume ID: {resumeId || 'Not created yet'} | 
                    Backend: http://localhost:5001 | 
                    Time: {new Date().toLocaleTimeString()}
                </div>
            </div>
            
            {/* Personal Details Form */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h2 style={{ color: '#333', marginTop: '0' }}>👤 Personal Details</h2>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                            Full Name *
                        </label>
                        <input 
                            type="text" 
                            value={personalDetails.full_name} 
                            onChange={(e) => setPersonalDetails({...personalDetails, full_name: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                border: '2px solid #ddd', 
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your full name"
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                            Email *
                        </label>
                        <input 
                            type="email" 
                            value={personalDetails.email} 
                            onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                border: '2px solid #ddd', 
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                            Phone
                        </label>
                        <input 
                            type="tel" 
                            value={personalDetails.phone} 
                            onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                border: '2px solid #ddd', 
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="+91-9999999999"
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                            Address
                        </label>
                        <input 
                            type="text" 
                            value={personalDetails.address} 
                            onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                border: '2px solid #ddd', 
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Mumbai, Maharashtra, India"
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                            Professional Summary
                        </label>
                        <textarea 
                            value={personalDetails.professional_summary} 
                            onChange={(e) => setPersonalDetails({...personalDetails, professional_summary: e.target.value})}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '6px', 
                                border: '2px solid #ddd', 
                                fontSize: '16px',
                                height: '120px',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Brief professional summary highlighting your key skills and experience..."
                        />
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginTop: '30px', 
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <button 
                        onClick={fillSampleData}
                        style={{ 
                            backgroundColor: '#ffc107', 
                            color: '#000', 
                            padding: '12px 25px', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        🎯 Fill Sample Data
                    </button>
                    
                    <button 
                        onClick={savePersonalDetails} 
                        disabled={saving || !resumeId}
                        style={{ 
                            backgroundColor: saving ? '#6c757d' : '#007bff', 
                            color: 'white', 
                            padding: '15px 30px', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: (saving || !resumeId) ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        {saving ? '💾 Saving...' : '💾 Save Personal Details'}
                    </button>
                    
                    <button 
                        onClick={downloadPDF}
                        disabled={!resumeId}
                        style={{ 
                            backgroundColor: !resumeId ? '#6c757d' : '#28a745', 
                            color: 'white', 
                            padding: '15px 30px', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: !resumeId ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        📥 Download Professional PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
