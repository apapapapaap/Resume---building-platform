import React from 'react';
import { Input } from '../ui/input';

const PersonalDetailsForm = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData('personalDetails', {
      ...data.personalDetails,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <Input
            value={data.personalDetails.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={data.personalDetails.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            value={data.personalDetails.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            value={data.personalDetails.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="New York, NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <Input
            value={data.personalDetails.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://johndoe.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <Input
            value={data.personalDetails.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          value={data.personalDetails.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="A brief summary of your professional background, key skills, and career objectives..."
        />
        <p className="text-sm text-gray-500 mt-1">
          2-3 sentences highlighting your experience and goals
        </p>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
