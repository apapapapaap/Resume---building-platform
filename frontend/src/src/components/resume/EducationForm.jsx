import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = ({ data, updateData }) => {
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    };
    
    updateData('education', [...data.education, newEducation]);
  };

  const removeEducation = (id) => {
    updateData('education', data.education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id, field, value) => {
    updateData('education', data.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No education entries added yet.</p>
          <Button onClick={addEducation} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Education
          </Button>
        </div>
      )}

      {data.education.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Education #{index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="University of California, Berkeley"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study
              </label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPA (Optional)
              </label>
              <Input
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                placeholder="Leave empty if ongoing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={edu.description}
              onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Relevant coursework, achievements, activities..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm;
