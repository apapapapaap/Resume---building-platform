import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Plus, FileText, Download, Edit, Trash2, Share, Eye } from 'lucide-react';

// Mock resumes data (will be replaced with real API calls later)
const mockResumes = [
  {
    id: 1,
    title: 'Software Developer Resume',
    updatedAt: '2025-09-15',
    createdAt: '2025-09-10',
    template: 'Modern',
    isPublic: false
  },
  {
    id: 2,
    title: 'Frontend Developer Resume',
    updatedAt: '2025-09-18',
    createdAt: '2025-09-18',
    template: 'Classic',
    isPublic: true
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResumes(mockResumes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
    }
  };

  const handleDownload = (resume) => {
    // Mock download functionality
    alert(`Downloading ${resume.title} as PDF...`);
  };

  const handleShare = (resume) => {
    // Mock share functionality
    const shareUrl = `https://resumebuilder.com/public/${resume.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-lg">Loading your resumes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.full_name}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your resumes and create new ones
              </p>
            </div>
            <Button asChild>
              <Link to="/resume/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Resume
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Resumes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {resumes.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Share className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Public Resumes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {resumes.filter(r => r.isPublic).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Download className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Downloads
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        12
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Resumes</h2>
          </div>
          
          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first resume.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/resume/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Resume
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {resumes.map((resume) => (
                <div key={resume.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {resume.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                          {' • '}
                          Template: {resume.template}
                          {resume.isPublic && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Public
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(resume)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {resume.isPublic && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleShare(resume)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
