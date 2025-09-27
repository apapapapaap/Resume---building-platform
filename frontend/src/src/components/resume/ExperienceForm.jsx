import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

const ExperienceForm = ({ data, updateData }) => {
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    updateData('experience', [...data.experience, newExperience]);
  };

  const removeExperience = (id) => {
    updateData('experience', data.experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id, field, value) => {
    updateData('experience', data.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.experience.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <Button onClick={addExperience} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      )}

      {data.experience.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Experience #{index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Google"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Software Engineer"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="space-y-2">
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      updateExperience(exp.id, 'current', e.target.checked);
                      if (e.target.checked) {
                        updateExperience(exp.id, 'endDate', '');
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">I currently work here</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="• Led a team of 5 developers to build a new feature&#10;• Improved system performance by 30%&#10;• Collaborated with product managers and designers"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Use bullet points to describe your key achievements and responsibilities
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
