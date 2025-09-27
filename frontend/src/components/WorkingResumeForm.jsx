import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkingResumeForm = () => {
    const [resumeId, setResumeId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('Initializing...');

    // Form data states
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
            setStatus('🔄 Setting up resume...');
            
            // Test backend
            await axios.get('http://localhost:5001/api/health');
            setStatus('✅ Backend connected');

            // Ensure user exists
            await axios.post('http://localhost:5001/api/resumes/ensure-user', {
                id: 1,
                email: 'test@example.com',
                full_name: 'Test User'
            });

            // Create resume
            const response = await axios.post('http://localhost:5001/api/resumes/create', {
                user_id: 1,
                title: 'My Complete Resume'
            });

            setResumeId(response.data.id);
            setStatus(`✅ Resume created! ID: ${response.data.id}`);

        } catch (error) {
            console.error('Error:', error);
            setStatus('❌ Error: ' + (error.response?.data?.error || error.message));
        }
    };

    // Personal Details Handlers
    const handlePersonalChange = (field, value) => {
        setPersonalDetails(prev => ({ ...prev, [field]: value }));
    };

    // Education Handlers
    const handleEducationChange = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

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
        setEducation(education.filter((_, i) => i !== index));
    };

    // Experience Handlers
    const handleExperienceChange = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

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
        setExperience(experience.filter((_, i) => i !== index));
    };

    // Skills Handlers
    const handleSkillChange = (index, field, value) => {
        const updated = [...skills];
        updated[index][field] = value;
        setSkills(updated);
    };

    const addSkill = () => {
        setSkills([...skills, {
            category: 'Technical',
            skill_name: '',
            proficiency_level: 'Intermediate'
        }]);
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    // Save Functions
    const saveAllSections = async () => {
        if (!resumeId) {
            alert('No resume ID found!');
            return;
        }

        setSaving(true);
        setStatus('💾 Saving all sections...');

        try {
            // Save Personal Details
            console.log('Saving personal details...');
            await axios.post(`http://localhost:5001/api/resumes/${resumeId}/personal-details`, personalDetails);

            // Save Education
            const validEducation = education.filter(edu => edu.institution?.trim() && edu.degree?.trim());
            if (validEducation.length > 0) {
                console.log('Saving education...');
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/education`, validEducation);
            }

            // Save Experience
            const validExperience = experience.filter(exp => exp.company?.trim() && exp.position?.trim());
            if (validExperience.length > 0) {
                console.log('Saving experience...');
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/experience`, validExperience);
            }

            // Save Skills
            const validSkills = skills.filter(skill => skill.skill_name?.trim());
            if (validSkills.length > 0) {
                console.log('Saving skills...');
                await axios.post(`http://localhost:5001/api/resumes/${resumeId}/skills`, validSkills);
            }

            setStatus('✅ All sections saved successfully!');
            alert('✅ Resume saved successfully!');

        } catch (error) {
            console.error('Save error:', error);
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

    // Fill Sample Data
    const fillSampleData = () => {
        setPersonalDetails({
            full_name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+91-9999999999',
            address: 'Mumbai, Maharashtra, India',
            linkedin_url: 'https://linkedin.com/in/johndoe',
            github_url: 'https://github.com/johndoe',
            portfolio_url: 'https://johndoe.dev',
            professional_summary: 'Experienced Full Stack Developer with 3+ years building scalable web applications using React, Node.js, and PostgreSQL. Passionate about creating efficient, user-friendly solutions.'
        });

        setEducation([{
            institution: 'Mumbai University',
            degree: 'Bachelor of Engineering',
            field_of_study: 'Computer Science',
            start_date: '2017-06-01',
            end_date: '2021-05-01',
            current: false,
            grade_gpa: '8.5 CGPA',
            description: 'Focused on software engineering, data structures, and algorithms.'
        }]);

        setExperience([{
            company: 'Tech Solutions Inc',
            position: 'Senior Full Stack Developer',
            location: 'Mumbai, India',
            start_date: '2021-06-01',
            end_date: '',
            current: true,
            description: `• Developed and maintained 5+ web applications using React and Node.js
• Improved application performance by 40% through code optimization
• Led a team of 3 junior developers on critical projects
• Implemented CI/CD pipelines reducing deployment time by 60%`
        }]);

        setSkills([
            { category: 'Technical', skill_name: 'React', proficiency_level: 'Advanced' },
            { category: 'Technical', skill_name: 'Node.js', proficiency_level: 'Advanced' },
            { category: 'Programming', skill_name: 'JavaScript', proficiency_level: 'Expert' },
            { category: 'Programming', skill_name: 'TypeScript', proficiency_level: 'Intermediate' },
            { category: 'Database', skill_name: 'PostgreSQL', proficiency_level: 'Advanced' },
            { category: 'Tools', skill_name: 'Docker', proficiency_level: 'Intermediate' }
        ]);
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        border: '2px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box'
    };

    const sectionStyle = {
        backgroundColor: 'white',
        padding: '25px',
        marginBottom: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
    };

    const buttonStyle = {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '5px'
    };

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            backgroundColor: '#f5f5f5',
            minHeight: '100vh' 
        }}>
            {/* Header */}
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '30px',
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#007bff', margin: '0' }}>📝 Complete Resume Form</h1>
                <p style={{ color: '#666', margin: '10px 0' }}>Fill out all sections to create your professional resume</p>
                
                {/* Status */}
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#d1ecf1',
                    color: status.includes('✅') ? '#155724' : status.includes('❌') ? '#721c24' : '#0c5460',
                    borderRadius: '6px',
                    marginTop: '15px',
                    fontWeight: 'bold'
                }}>
                    Status: {status} | Resume ID: {resumeId || 'Not set'}
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: '20px' }}>
                    <button 
                        onClick={fillSampleData}
                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000' }}
                    >
                        🎯 Fill Sample Data
                    </button>
                    <button 
                        onClick={saveAllSections}
                        disabled={saving || !resumeId}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: saving ? '#6c757d' : '#28a745', 
                            color: 'white' 
                        }}
                    >
                        {saving ? '💾 Saving...' : '💾 Save Complete Resume'}
                    </button>
                    <button 
                        onClick={downloadPDF}
                        disabled={!resumeId}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: !resumeId ? '#6c757d' : '#dc3545', 
                            color: 'white' 
                        }}
                    >
                        📥 Download PDF
                    </button>
                </div>
            </div>

            {/* Personal Details Section */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#333', marginTop: '0' }}>👤 Personal Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name *</label>
                        <input 
                            type="text" 
                            value={personalDetails.full_name} 
                            onChange={(e) => handlePersonalChange('full_name', e.target.value)}
                            style={inputStyle}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email *</label>
                        <input 
                            type="email" 
                            value={personalDetails.email} 
                            onChange={(e) => handlePersonalChange('email', e.target.value)}
                            style={inputStyle}
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                        <input 
                            type="tel" 
                            value={personalDetails.phone} 
                            onChange={(e) => handlePersonalChange('phone', e.target.value)}
                            style={inputStyle}
                            placeholder="+91-9999999999"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Address</label>
                        <input 
                            type="text" 
                            value={personalDetails.address} 
                            onChange={(e) => handlePersonalChange('address', e.target.value)}
                            style={inputStyle}
                            placeholder="City, State, Country"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>LinkedIn URL</label>
                        <input 
                            type="url" 
                            value={personalDetails.linkedin_url} 
                            onChange={(e) => handlePersonalChange('linkedin_url', e.target.value)}
                            style={inputStyle}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>GitHub URL</label>
                        <input 
                            type="url" 
                            value={personalDetails.github_url} 
                            onChange={(e) => handlePersonalChange('github_url', e.target.value)}
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
                        onChange={(e) => handlePersonalChange('portfolio_url', e.target.value)}
                        style={inputStyle}
                        placeholder="https://yourportfolio.com"
                    />
                </div>
                <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Professional Summary</label>
                    <textarea 
                        value={personalDetails.professional_summary} 
                        onChange={(e) => handlePersonalChange('professional_summary', e.target.value)}
                        style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                        placeholder="Brief summary of your professional background and key skills..."
                    />
                </div>
            </div>

            {/* Education Section */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#333', margin: '0' }}>🎓 Education</h2>
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
                        borderRadius: '6px', 
                        marginBottom: '20px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4 style={{ margin: '0', color: '#333' }}>Education {index + 1}</h4>
                            {education.length > 1 && (
                                <button 
                                    onClick={() => removeEducation(index)}
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Institution</label>
                                <input 
                                    type="text" 
                                    value={edu.institution} 
                                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                    style={inputStyle}
                                    placeholder="University/College name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Degree</label>
                                <input 
                                    type="text" 
                                    value={edu.degree} 
                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Bachelor of Engineering"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Field of Study</label>
                                <input 
                                    type="text" 
                                    value={edu.field_of_study} 
                                    onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Computer Science"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={edu.start_date} 
                                    onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={edu.end_date} 
                                    onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                                    style={inputStyle}
                                    disabled={edu.current}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>GPA/Grade</label>
                                <input 
                                    type="text" 
                                    value={edu.grade_gpa} 
                                    onChange={(e) => handleEducationChange(index, 'grade_gpa', e.target.value)}
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
                                    onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Currently studying here
                            </label>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description (Optional)</label>
                            <textarea 
                                value={edu.description} 
                                onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                style={{ ...inputStyle, height: '80px' }}
                                placeholder="Additional details about your education..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Experience Section */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#333', margin: '0' }}>💼 Work Experience</h2>
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
                        borderRadius: '6px', 
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
                                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Company name"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Position</label>
                                <input 
                                    type="text" 
                                    value={exp.position} 
                                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Job title"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Location</label>
                                <input 
                                    type="text" 
                                    value={exp.location} 
                                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                                    style={inputStyle}
                                    placeholder="City, Country"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={exp.start_date} 
                                    onChange={(e) => handleExperienceChange(index, 'start_date', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={exp.end_date} 
                                    onChange={(e) => handleExperienceChange(index, 'end_date', e.target.value)}
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
                                    onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                Currently working here
                            </label>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Job Description</label>
                            <textarea 
                                value={exp.description} 
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                style={{ ...inputStyle, height: '120px' }}
                                placeholder="• Developed and maintained web applications&#10;• Improved performance by 40%&#10;• Led team of 3 developers"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills Section */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#333', margin: '0' }}>🛠️ Skills</h2>
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
                                    onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
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
                                    onChange={(e) => handleSkillChange(index, 'skill_name', e.target.value)}
                                    style={inputStyle}
                                    placeholder="e.g., React, JavaScript, etc."
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Proficiency</label>
                                <select 
                                    value={skill.proficiency_level} 
                                    onChange={(e) => handleSkillChange(index, 'proficiency_level', e.target.value)}
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

            {/* Final Action Buttons */}
            <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ color: '#333', marginTop: '0' }}>🎉 Ready to Generate Your Resume?</h3>
                <div>
                    <button 
                        onClick={saveAllSections}
                        disabled={saving || !resumeId}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: saving ? '#6c757d' : '#28a745', 
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                    >
                        {saving ? '💾 Saving All Sections...' : '💾 Save Complete Resume'}
                    </button>
                    <button 
                        onClick={downloadPDF}
                        disabled={!resumeId}
                        style={{ 
                            ...buttonStyle, 
                            backgroundColor: !resumeId ? '#6c757d' : '#dc3545', 
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                    >
                        📥 Download Professional PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkingResumeForm;
