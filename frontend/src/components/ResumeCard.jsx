import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  Edit, 
  Download, 
  Trash2, 
  Eye, 
  Share2, 
  Calendar,
  FileText,
  MoreVertical,
  Copy
} from 'lucide-react';

const ResumeCard = ({ resume, onEdit, onDelete, onShare }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    onEdit(resume);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${resume.title}"?`)) {
      onDelete(resume);
    }
  };

  // New downloadPDF function calls backend and triggers file download
  const downloadPDF = async (resumeId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) {
        alert('Failed to download PDF');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadPDF(resume.id);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/public/${resume.public_url}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Resume link copied to clipboard!');
    if (onShare) onShare(resume);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {resume.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Updated {formatDate(resume.updated_at)}</span>
            </div>
          </div>
          
          <div className="relative ml-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Resume
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>Template: {resume.template_id || 'Modern'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{resume.view_count || 0} views</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              <span>{resume.download_count || 0} downloads</span>
            </div>
          </div>
        </div>

        {resume.is_public && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mb-3">
            <Share2 className="h-3 w-3 mr-1" />
            Public
          </div>
        )}

        {/* Preview or Summary */}
        <div className="text-sm text-gray-600 mb-4">
          <p className="line-clamp-2">
            {resume.personal_details?.summary || 'No summary available'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/resume/${resume.id}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={loading}
            className="flex-shrink-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-shrink-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
