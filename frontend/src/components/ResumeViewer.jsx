import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResumeViewer = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResumeData();
    }, [resumeId]);

    const fetchResumeData = async () => {
        try {
            setLoading(true);
            console.log('Fetching resume data for ID:', resumeId);
            
            const response = await axios.get(`http://localhost:5001/api/resumes/${resumeId}/view`);
            setResumeData(response.data);
            console.log('Resume data loaded:', response.data);
        } catch (error) {
            console.error('Error fetching resume:', error);
            setError(error.response?.data?.error || 'Failed to load resume');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        try {
            console.log('Downloading PDF for resume:', resumeId);
            window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf`, '_blank');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF');
        }
    };

    const editResume = () => {
        navigate(`/working-form?resumeId=${resumeId}`);
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

    if (error) {
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
                <p>{error}</p>
                <button 
                    onClick={() => navigate('/working-form')}
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

    if (!resumeData) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>No resume data found.</p>
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
                        📥 Download PDF
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
            </div>
        </div>
    );
};

export default ResumeViewer;
