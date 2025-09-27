import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResumeDashboard.css';

const ResumeDashboard = ({ userId = 1 }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newResumeTitle, setNewResumeTitle] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/resumes/user/${userId}`);
            setResumes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setLoading(false);
        }
    };

    const createResume = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/resumes/create', {
                user_id: userId,
                title: newResumeTitle || 'My Resume'
            });
            setResumes([response.data, ...resumes]);
            setShowCreateDialog(false);
            setNewResumeTitle('');
        } catch (error) {
            console.error('Error creating resume:', error);
        }
    };

    const deleteResume = async (resumeId) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            try {
                await axios.delete(`http://localhost:5000/api/resumes/${resumeId}`);
                setResumes(resumes.filter(resume => resume.id !== resumeId));
            } catch (error) {
                console.error('Error deleting resume:', error);
            }
        }
    };

    const downloadPDF = async (resumeId, title) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/resumes/${resumeId}/download-pdf`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}-resume.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    if (loading) return <div className="loading">Loading resumes...</div>;

    return (
        <div className="resume-dashboard">
            <div className="dashboard-header">
                <h1>My Resumes</h1>
                <button 
                    className="create-btn"
                    onClick={() => setShowCreateDialog(true)}
                >
                    Create New Resume
                </button>
            </div>

            {showCreateDialog && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Create New Resume</h3>
                        <input
                            type="text"
                            placeholder="Resume title (optional)"
                            value={newResumeTitle}
                            onChange={(e) => setNewResumeTitle(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={createResume}>Create</button>
                            <button onClick={() => setShowCreateDialog(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="resumes-grid">
                {resumes.map(resume => (
                    <div key={resume.id} className="resume-card">
                        <h3>{resume.title}</h3>
                        <p>Created: {new Date(resume.created_at).toLocaleDateString()}</p>
                        <p>Updated: {new Date(resume.updated_at).toLocaleDateString()}</p>
                        
                        <div className="resume-actions">
                            <button 
                                onClick={() => window.location.href = `/resume-builder/${resume.id}`}
                                className="edit-btn"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => downloadPDF(resume.id, resume.title)}
                                className="download-btn"
                            >
                                Download PDF
                            </button>
                            <button 
                                onClick={() => deleteResume(resume.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {resumes.length === 0 && (
                <div className="empty-state">
                    <h3>No resumes yet</h3>
                    <p>Create your first resume to get started!</p>
                </div>
            )}
        </div>
    );
};

export default ResumeDashboard;
