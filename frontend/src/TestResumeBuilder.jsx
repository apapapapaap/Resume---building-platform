import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestResumeBuilder = () => {
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('Initializing...');
    
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
            setStatus('🔄 Setting up resume...');
            
            // Test backend connection
            await axios.get('http://localhost:5001/api/health');
            setStatus('✅ Backend connected');
            
            // Ensure user exists
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: 1,
                email: 'test@example.com',
                full_name: 'Test User'
            });
            
            // Create new resume
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: 1,
                title: 'My Test Resume'
            });
            
            setResumeId(response.data.id);
            setStatus(`✅ Resume created! ID: ${response.data.id}`);
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            setStatus('❌ Error: ' + (error.message || 'Failed to initialize'));
        }
    };

    const savePersonalDetails = async () => {
        if (!resumeId) {
            alert('No resume ID found!');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving personal details...');
        
        try {
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
        setStatus('📥 Generating PDF...');
        window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf`, '_blank');
        setStatus('✅ PDF generated!');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🎯 Test Resume Builder</h1>
            
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
            <p><strong>Resume ID:</strong> {resumeId || 'Not set'}</p>
            
            {/* Personal Details Form */}
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2>👤 Personal Details</h2>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Full Name:</label><br/>
                    <input 
                        type="text" 
                        value={personalDetails.full_name} 
                        onChange={(e) => setPersonalDetails({...personalDetails, full_name: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="Enter your full name"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br/>
                    <input 
                        type="email" 
                        value={personalDetails.email} 
                        onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="Enter your email"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone:</label><br/>
                    <input 
                        type="tel" 
                        value={personalDetails.phone} 
                        onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="Enter your phone"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Address:</label><br/>
                    <input 
                        type="text" 
                        value={personalDetails.address} 
                        onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="Enter your address"
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Professional Summary:</label><br/>
                    <textarea 
                        value={personalDetails.professional_summary} 
                        onChange={(e) => setPersonalDetails({...personalDetails, professional_summary: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', height: '80px' }}
                        placeholder="Brief professional summary"
                    />
                </div>
                
                <button 
                    onClick={savePersonalDetails} 
                    disabled={saving || !resumeId}
                    style={{ 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        padding: '12px 20px', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        marginRight: '10px',
                        fontSize: '16px'
                    }}
                >
                    {saving ? '💾 Saving...' : '💾 Save Personal Details'}
                </button>
                
                <button 
                    onClick={downloadPDF}
                    disabled={!resumeId}
                    style={{ 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        padding: '12px 20px', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: !resumeId ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    📥 Download PDF
                </button>
            </div>
        </div>
    );
};

export default TestResumeBuilder;
