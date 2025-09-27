import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
    const { resumeId: urlResumeId } = useParams();
    const navigate = useNavigate();
    
    const [resumeId, setResumeId] = useState(urlResumeId);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    
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

    const [skills, setSkills] = useState([{
        category: 'Technical',
        skill_name: '',
        proficiency_level: 'Intermediate'
    }]);

    useEffect(() => {
        initializeResume();
    }, []);

    const initializeResume = async () => {
        try {
            setStatus('Initializing...');
            
            // Test backend connection
            console.log('🧪 Testing backend...');
            await axios.get('http://localhost:5001/api/health');
            console.log('✅ Backend connected');
            
            // Ensure user exists
            console.log('👤 Ensuring user exists...');
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: 1,
                email: 'test@example.com',
                full_name: 'Test User'
            });
            console.log('✅ User ready');
            
            if (urlResumeId) {
                console.log('📄 Loading existing resume:', urlResumeId);
                setResumeId(urlResumeId);
                await fetchResumeData(urlResumeId);
            } else {
                console.log('📄 Creating new resume...');
                await createNewResume();
            }
            
            setStatus('✅ Resume ready!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            setStatus('❌ Error: ' + (error.response?.data?.error || error.message));
        }
        setLoading(false);
    };

    const createNewResume = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: 1,
                title: 'My Resume'
            });
            
            const newResumeId = response.data.id;
            setResumeId(newResumeId);
            console.log('✅ Created resume ID:', newResumeId);
            
            navigate(`/resume-builder/${newResumeId}`, { replace: true });
        } catch (error) {
            console.error('❌ Create resume error:', error);
            throw error;
        }
    };

    const fetchResumeData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/resumes/${id}/complete`);
            const data = response.data;
            
            if (data.personalDetails) setPersonalDetails(data.personalDetails);
            if (data.education?.length) setEducation(data.education);
            if (data.experience?.length) setExperience(data.experience);
            if (data.skills?.length) setSkills(data.skills);
            
            console.log('✅ Loaded resume data');
        } catch (error) {
            console.error('❌ Fetch error:', error);
            throw error;
        }
    };

    const savePersonalDetails = async () => {
        if (!resumeId) {
            alert('❌ No resume ID found!');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving personal details...');
        
        try {
            console.log('💾 Saving:', personalDetails);
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/personal-details`, personalDetails);
            setStatus('✅ Personal details saved!');
            alert('✅ Personal details saved successfully!');
        } catch (error) {
            console.error('❌ Save error:', error);
            const errorMsg = error.response?.data?.error || error.message;
            setStatus('❌ Save failed: ' + errorMsg);
            alert('❌ Save failed: ' + errorMsg);
        }
        setSaving(false);
    };

    const saveEducation = async () => {
        if (!resumeId) return;
        
        const validEducation = education.filter(edu => edu.institution?.trim() && edu.degree?.trim());
        
        setSaving(true);
        setStatus('💾 Saving education...');
        
        try {
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/education`, validEducation);
            setStatus(`✅ Education saved! (${validEducation.length} entries)`);
            alert(`✅ Education saved! (${validEducation.length} entries)`);
        } catch (error) {
            console.error('❌ Save error:', error);
            const errorMsg = error.response?.data?.error || error.message;
            setStatus('❌ Save failed: ' + errorMsg);
            alert('❌ Save failed: ' + errorMsg);
        }
        setSaving(false);
    };

    const saveExperience = async () => {
        if (!resumeId) return;
        
        const validExperience = experience.filter(exp => exp.company?.trim() && exp.position?.trim());
        
        setSaving(true);
        setStatus('💾 Saving experience...');
        
        try {
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/experience`, validExperience);
            setStatus(`✅ Experience saved! (${validExperience.length} entries)`);
            alert(`✅ Experience saved! (${validExperience.length} entries)`);
        } catch (error) {
            console.error('❌ Save error:', error);
            const errorMsg = error.response?.data?.error || error.message;
            setStatus('❌ Save failed: ' + errorMsg);
            alert('❌ Save failed: ' + errorMsg);
        }
        setSaving(false);
    };

    const saveSkills = async () => {
        if (!resumeId) return;
        
        const validSkills = skills.filter(skill => skill.skill_name?.trim());
        
        setSaving(true);
        setStatus('💾 Saving skills...');
        
        try {
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/skills`, validSkills);
            setStatus(`✅ Skills saved! (${validSkills.length} skills)`);
            alert(`✅ Skills saved! (${validSkills.length} skills)`);
        } catch (error) {
            console.error('❌ Save error:', error);
            const errorMsg = error.response?.data?.error || error.message;
            setStatus('❌ Save failed: ' + errorMsg);
            alert('❌ Save failed: ' + errorMsg);
        }
        setSaving(false);
    };

    const downloadPDF = async () => {
        if (!resumeId) {
            alert('❌ No resume found!');
            return;
        }

        try {
            setStatus('📥 Generating PDF...');
            window.open(`http://localhost:5001/api/resumes/${resumeId}/download-pdf`, '_blank');
            setStatus('✅ PDF generated!');
        } catch (error) {
            console.error('❌ PDF error:', error);
            setStatus('❌ PDF generation failed');
            alert('❌ PDF generation failed');
        }
    };

    // Helper functions
    const updateEducation = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    const updateExperience = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

    const updateSkill = (index, field, value) => {
        const updated = [...skills];
        updated[index][field] = value;
        setSkills(updated);
    };

    const addEducation = () => setEducation([...education, { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', current: false, grade_gpa: '', description: '' }]);
    const addExperience = () => setExperience([...experience, { company: '', position: '', location: '', start_date: '', end_date: '', current: false, description: '' }]);
    const addSkill = () => setSkills([...skills, { category: 'Technical', skill_name: '', proficiency_level: 'Intermediate' }]);

    const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
    const removeExperience = (index) => setExperience(experience.filter((_, i) => i !== index));
    const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

    if (loading) return <div className="loading">🔄 Loading resume... Please wait.</div>;

    return (
        <div className="resume-builder">
            <div className="builder-header">
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    ← Back
                </button>
                <h1>🎯 Resume Builder</h1>
                <div className="header-actions">
                    <button onClick={downloadPDF} disabled={!resumeId} className="download-btn">
                        📥 Download PDF
                    </button>
                </div>
            </div>

            {/* Status bar */}
            {status && (
                <div className={`status-bar ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}`}>
                    {status} | Resume ID: {resumeId || 'Not Set'}
                </div>
            )}

            <div className="builder-tabs">
                <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => setActiveTab('personal')}>👤 Personal</button>
                <button className={activeTab === 'education' ? 'active' : ''} onClick={() => setActiveTab('education')}>🎓 Education</button>
                <button className={activeTab === 'experience' ? 'active' : ''} onClick={() => setActiveTab('experience')}>💼 Experience</button>
                <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>🛠️ Skills</button>
            </div>

            <div className="builder-content">
                {activeTab === 'personal' && (
                    <div className="section">
                        <h2>👤 Personal Details</h2>
                        <div className="form-grid">
                            <input type="text" placeholder="Full Name" value={personalDetails.full_name || ''} onChange={(e) => setPersonalDetails({...personalDetails, full_name: e.target.value})} />
                            <input type="email" placeholder="Email" value={personalDetails.email || ''} onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})} />
                            <input type="tel" placeholder="Phone" value={personalDetails.phone || ''} onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})} />
                            <input type="text" placeholder="Address" value={personalDetails.address || ''} onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})} />
                            <input type="url" placeholder="LinkedIn URL" value={personalDetails.linkedin_url || ''} onChange={(e) => setPersonalDetails({...personalDetails, linkedin_url: e.target.value})} />
                            <input type="url" placeholder="GitHub URL" value={personalDetails.github_url || ''} onChange={(e) => setPersonalDetails({...personalDetails, github_url: e.target.value})} />
                        </div>
                        <textarea placeholder="Professional Summary" rows={4} value={personalDetails.professional_summary || ''} onChange={(e) => setPersonalDetails({...personalDetails, professional_summary: e.target.value})} />
                        <button onClick={savePersonalDetails} disabled={saving} className="save-btn">
                            {saving ? '💾 Saving...' : '💾 Save Personal Details'}
                        </button>
                    </div>
                )}

                {activeTab === 'education' && (
                    <div className="section">
                        <div className="section-header">
                            <h2>🎓 Education</h2>
                            <button onClick={addEducation} className="add-btn">➕ Add Education</button>
                        </div>
                        {education.map((edu, index) => (
                            <div key={index} className="form-item">
                                <div className="item-header">
                                    <h4>Education {index + 1}</h4>
                                    {education.length > 1 && <button onClick={() => removeEducation(index)} className="remove-btn">❌</button>}
                                </div>
                                <div className="form-grid">
                                    <input type="text" placeholder="Institution" value={edu.institution || ''} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
                                    <input type="text" placeholder="Degree" value={edu.degree || ''} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                                    <input type="text" placeholder="Field of Study" value={edu.field_of_study || ''} onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)} />
                                    <input type="date" value={edu.start_date || ''} onChange={(e) => updateEducation(index, 'start_date', e.target.value)} />
                                    {!edu.current && <input type="date" value={edu.end_date || ''} onChange={(e) => updateEducation(index, 'end_date', e.target.value)} />}
                                </div>
                                <label><input type="checkbox" checked={edu.current || false} onChange={(e) => updateEducation(index, 'current', e.target.checked)} /> Currently studying</label>
                            </div>
                        ))}
                        <button onClick={saveEducation} disabled={saving} className="save-btn">{saving ? '💾 Saving...' : '💾 Save Education'}</button>
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="section">
                        <div className="section-header">
                            <h2>💼 Work Experience</h2>
                            <button onClick={addExperience} className="add-btn">➕ Add Experience</button>
                        </div>
                        {experience.map((exp, index) => (
                            <div key={index} className="form-item">
                                <div className="item-header">
                                    <h4>Experience {index + 1}</h4>
                                    {experience.length > 1 && <button onClick={() => removeExperience(index)} className="remove-btn">❌</button>}
                                </div>
                                <div className="form-grid">
                                    <input type="text" placeholder="Company" value={exp.company || ''} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                                    <input type="text" placeholder="Position" value={exp.position || ''} onChange={(e) => updateExperience(index, 'position', e.target.value)} />
                                    <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => updateExperience(index, 'location', e.target.value)} />
                                    <input type="date" value={exp.start_date || ''} onChange={(e) => updateExperience(index, 'start_date', e.target.value)} />
                                    {!exp.current && <input type="date" value={exp.end_date || ''} onChange={(e) => updateExperience(index, 'end_date', e.target.value)} />}
                                </div>
                                <label><input type="checkbox" checked={exp.current || false} onChange={(e) => updateExperience(index, 'current', e.target.checked)} /> Currently working here</label>
                                <textarea placeholder="Job Description" rows={3} value={exp.description || ''} onChange={(e) => updateExperience(index, 'description', e.target.value)} />
                            </div>
                        ))}
                        <button onClick={saveExperience} disabled={saving} className="save-btn">{saving ? '💾 Saving...' : '💾 Save Experience'}</button>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="section">
                        <div className="section-header">
                            <h2>🛠️ Skills</h2>
                            <button onClick={addSkill} className="add-btn">➕ Add Skill</button>
                        </div>
                        {skills.map((skill, index) => (
                            <div key={index} className="form-item">
                                <div className="item-header">
                                    <h4>Skill {index + 1}</h4>
                                    {skills.length > 1 && <button onClick={() => removeSkill(index)} className="remove-btn">❌</button>}
                                </div>
                                <div className="form-grid">
                                    <select value={skill.category || 'Technical'} onChange={(e) => updateSkill(index, 'category', e.target.value)}>
                                        <option value="Technical">Technical</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Soft Skills">Soft Skills</option>
                                        <option value="Languages">Languages</option>
                                    </select>
                                    <input type="text" placeholder="Skill Name" value={skill.skill_name || ''} onChange={(e) => updateSkill(index, 'skill_name', e.target.value)} />
                                    <select value={skill.proficiency_level || 'Intermediate'} onChange={(e) => updateSkill(index, 'proficiency_level', e.target.value)}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        <button onClick={saveSkills} disabled={saving} className="save-btn">{saving ? '💾 Saving...' : '💾 Save Skills'}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeBuilder;
