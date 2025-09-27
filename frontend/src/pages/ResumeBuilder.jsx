import { ChevronLeft, ChevronRight, Download, Eye, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CertificationsForm from '../components/resume/CertificationsForm';
import EducationForm from '../components/resume/EducationForm';
import ExperienceForm from '../components/resume/ExperienceForm';
import PersonalDetailsForm from '../components/resume/PersonalDetailsForm';
import ProjectsForm from '../components/resume/ProjectsForm';
import ResumePreview from '../components/resume/ResumePreview';
import SkillsForm from '../components/resume/SkillsForm';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const STEPS = [
  { id: 'personal', title: 'Personal Details', component: PersonalDetailsForm },
  { id: 'education', title: 'Education', component: EducationForm },
  { id: 'experience', title: 'Experience', component: ExperienceForm },
  { id: 'skills', title: 'Skills', component: SkillsForm },
  { id: 'projects', title: 'Projects', component: ProjectsForm },
  { id: 'certifications', title: 'Certifications', component: CertificationsForm }
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState({
    id: null,
    title: '',
    personalDetails: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: {
      technical: [],
      languages: [],
      soft: []
    },
    projects: [],
    certifications: [],
    templateId: 'modern'
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadResume(id);
    } else {
      // New resume - set default title
      setResumeData(prev => ({
        ...prev,
        title: `Resume ${new Date().toLocaleDateString()}`
      }));
    }
  }, [id]);

  const loadResume = async (resumeId) => {
    try {
      const response = await API.get(`/resumes/${resumeId}`);
      const resume = response.data;
      
      setResumeData({
        id: resume.id,
        title: resume.title,
        personalDetails: resume.personal_details || resumeData.personalDetails,
        education: resume.education || [],
        experience: resume.experience || [],
        skills: resume.skills || resumeData.skills,
        projects: resume.projects || [],
        certifications: resume.certifications || [],
        templateId: resume.template_id || 'modern'
      });
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const payload = {
        title: resumeData.title,
        personalDetails: resumeData.personalDetails,
        education: resumeData.education,
        experience: resumeData.experience,
        skills: resumeData.skills,
        projects: resumeData.projects,
        certifications: resumeData.certifications,
        templateId: resumeData.templateId
      };

      let response;
      if (resumeData.id) {
        response = await API.put(`/resumes/${resumeData.id}`, payload);
      } else {
        response = await API.post('/resumes', payload);
      }

      setResumeData(prev => ({ ...prev, id: response.data.id }));
      
      // Update URL if it's a new resume
      if (id === 'new') {
        navigate(`/resume/${response.data.id}`, { replace: true });
      }
      
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await API.post(`/resumes/${resumeData.id}/download`, {}, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <input
                type="text"
                value={resumeData.title}
                onChange={(e) => updateResumeData('title', e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                placeholder="Resume Title"
              />
              <p className="text-gray-600 mt-1">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              
              <Button onClick={saveResume} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              
              {resumeData.id && (
                <Button onClick={downloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Progress Bar */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex-1 text-center ${
                      index === currentStep
                        ? 'text-blue-600'
                        : index < currentStep
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                      index === currentStep
                        ? 'bg-blue-600 text-white'
                        : index < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs font-medium">{step.title}</div>
                  </div>
                ))}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Form */}
            <div className="p-6">
              <CurrentStepComponent
                data={resumeData}
                updateData={updateResumeData}
              />
            </div>

            {/* Navigation */}
            <div className="p-6 border-t flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                disabled={currentStep === STEPS.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Live Preview</h3>
              </div>
              <div className="p-6">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
