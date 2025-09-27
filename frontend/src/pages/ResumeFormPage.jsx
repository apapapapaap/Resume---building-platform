import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from '../components/ResumeForm/ResumeForm';

export default function ResumeFormPage() {
  const { id } = useParams(); // Will be undefined for /resume/new, resume ID for /resume/edit/:id
  const navigate = useNavigate();
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchResumeData();
    }
  }, [id]);

  const fetchResumeData = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExistingResume(response.data);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      
      if (error.response?.status === 404) {
        setError('Resume not found. It may have been deleted.');
      } else {
        setError('Failed to load resume data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSuccess = () => {
    // Show success message and navigate back to resumes list
    navigate('/resumes', { 
      state: { 
        message: isEditing ? 'Resume updated successfully!' : 'Resume created successfully!' 
      } 
    });
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/resumes');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 13.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Resume</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={fetchResumeData}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/resumes')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium"
              >
                Back to Resumes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Resume' : 'Create New Resume'}
            </h1>
            <p className="mt-1 text-gray-600">
              {isEditing 
                ? 'Update your resume information below.' 
                : 'Fill in your information to create a professional resume.'
              }
            </p>
          </div>
          
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <ResumeForm
          existingResume={existingResume}
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tips for a great resume:</h3>
            <div className="mt-1 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Use action verbs to describe your experience</li>
                <li>Keep your summary concise and impactful</li>
                <li>Include relevant skills for your target job</li>
                <li>Proofread for spelling and grammar errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
