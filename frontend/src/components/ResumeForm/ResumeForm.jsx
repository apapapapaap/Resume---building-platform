import axios from 'axios';
import { useEffect, useState } from 'react';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import SkillsForm from './SkillsForm';

const API_BASE_URL = 'http://localhost:5001/api';

export default function ResumeForm({ existingResume, onSaveSuccess, onCancel, isEditing }) {
  const [personalDetails, setPersonalDetails] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    professional_summary: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState(existingResume?.id || null);

  const [educationList, setEducationList] = useState([
    { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', current: false, grade_gpa: '', description: '' },
  ]);

  const [experienceList, setExperienceList] = useState([
    { company: '', position: '', location: '', start_date: '', end_date: '', current: false, description: '' },
  ]);

  const [skills, setSkills] = useState([
    { category: 'Technical', skill_name: '', proficiency_level: 'Intermediate' }
  ]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  useEffect(() => {
    initializeForm();
  }, [existingResume]);

  const initializeForm = async () => {
    try {
      // Ensure user exists
      await axios.post(`${API_BASE_URL}/resumes/ensure-user`, {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User'
      });

      if (existingResume?.id) {
        // Load existing resume data
        setResumeId(existingResume.id);
        const response = await axios.get(`${API_BASE_URL}/resumes/${existingResume.id}/complete`);
        const data = response.data;

        if (data.personalDetails) {
          setPersonalDetails(data.personalDetails);
        }
        if (data.education?.length) {
          setEducationList(data.education);
        }
        if (data.experience?.length) {
          setExperienceList(data.experience);
        }
        if (data.skills?.length) {
          setSkills(data.skills);
        }
      } else {
        // Create new resume
        const response = await axios.post(`${API_BASE_URL}/resumes/create`, {
          user_id: 1,
          title: 'My Resume'
        });
        setResumeId(response.data.id);
        console.log('✅ Created new resume:', response.data.id);
      }
    } catch (error) {
      console.error('❌ Error initializing form:', error);
      alert('Failed to initialize resume form: ' + (error.response?.data?.error || error.message));
    }
  };

  // Validation function
  const validate = () => {
    const errs = {};
    if (!personalDetails.full_name?.trim()) errs.fullName = 'Full name is required';
    if (!personalDetails.email?.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(personalDetails.email)) errs.email = 'Invalid email address';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const addEducationEntry = () => {
    setEducationList([...educationList, { 
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

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  const addExperienceEntry = () => {
    setExperienceList([...experienceList, { 
      company: '', 
      position: '', 
      location: '', 
      start_date: '', 
      end_date: '', 
      current: false, 
      description: '' 
    }]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setProfilePhotoUrl(URL.createObjectURL(file));
    }
  };

  const uploadPhoto = async (resumeId) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      await axios.post(`${API_BASE_URL}/resumes/${resumeId}/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFile(null);
      console.log('✅ Profile photo uploaded successfully!');
    } catch (error) {
      console.error('❌ Failed to upload profile photo:', error);
    }
  };

  const saveResume = async () => {
    if (!validate()) {
      alert('Please fix validation errors before saving.');
      return;
    }

    if (!resumeId) {
      alert('No resume ID found. Please refresh and try again.');
      return;
    }

    setSaving(true);

    try {
      console.log('💾 Saving resume with ID:', resumeId);

      // Save Personal Details
      console.log('💾 Saving personal details...');
      await axios.post(`${API_BASE_URL}/resumes/${resumeId}/personal-details`, personalDetails);
      console.log('✅ Personal details saved');

      // Save Education (only non-empty entries)
      const validEducation = educationList.filter(edu => 
        edu.institution?.trim() && edu.degree?.trim()
      );
      if (validEducation.length > 0) {
        console.log('💾 Saving education...');
        await axios.post(`${API_BASE_URL}/resumes/${resumeId}/education`, validEducation);
        console.log('✅ Education saved');
      }

      // Save Experience (only non-empty entries)
      const validExperience = experienceList.filter(exp => 
        exp.company?.trim() && exp.position?.trim()
      );
      if (validExperience.length > 0) {
        console.log('💾 Saving experience...');
        await axios.post(`${API_BASE_URL}/resumes/${resumeId}/experience`, validExperience);
        console.log('✅ Experience saved');
      }

      // Save Skills (only non-empty entries)
      const validSkills = skills.filter(skill => skill.skill_name?.trim());
      if (validSkills.length > 0) {
        console.log('💾 Saving skills...');
        await axios.post(`${API_BASE_URL}/resumes/${resumeId}/skills`, validSkills);
        console.log('✅ Skills saved');
      }

      // Upload photo if selected
      if (selectedFile) {
        await uploadPhoto(resumeId);
      }

      alert(`✅ Resume ${isEditing ? 'updated' : 'saved'} successfully!`);
      if (onSaveSuccess) {
        onSaveSuccess();
      }

    } catch (error) {
      console.error('❌ Failed to save resume:', error);
      console.error('❌ Error details:', error.response?.data);
      alert('❌ Failed to save resume: ' + (error.response?.data?.error || error.message));
    }

    setSaving(false);
  };

  // Download PDF function
  const downloadPDF = () => {
    if (!resumeId) {
      alert('No resume to download!');
      return;
    }
    window.open(`${API_BASE_URL}/resumes/${resumeId}/download-pdf`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Status Display */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p><strong>Resume ID:</strong> {resumeId || 'Not Set'}</p>
        <p><strong>Status:</strong> {saving ? '💾 Saving...' : '✅ Ready'}</p>
      </div>

      <PersonalDetailsForm 
        data={personalDetails} 
        setData={setPersonalDetails} 
        errors={errors} 
      />

      {/* Profile Photo Upload Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Profile Photo</h3>
        <div className="flex items-center space-x-4">
          {profilePhotoUrl && (
            <div className="flex-shrink-0">
              <img
                src={profilePhotoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}
          <div className="flex-1">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a professional headshot (JPG, PNG, up to 5MB)</p>
          </div>
        </div>
      </div>

      <EducationForm
        educationList={educationList}
        onEducationChange={handleEducationChange}
        onAddEducation={addEducationEntry}
      />
      
      <ExperienceForm
        experienceList={experienceList}
        onExperienceChange={handleExperienceChange}
        onAddExperience={addExperienceEntry}
      />
      
      <SkillsForm skills={skills} setSkills={setSkills} />

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
            disabled={saving}
          >
            Cancel
          </button>
        )}
        
        <button 
          type="button" 
          onClick={downloadPDF}
          disabled={!resumeId}
          className="px-6 py-3 border border-transparent rounded-md shadow-sm bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          📥 Download PDF
        </button>
        
        <button 
          type="button" 
          onClick={saveResume} 
          disabled={saving || !resumeId}
          className="px-6 py-3 border border-transparent rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? '💾 Saving...' : (isEditing ? '✅ Update Resume' : '✅ Save Resume')}
        </button>
      </div>
    </div>
  );
}
