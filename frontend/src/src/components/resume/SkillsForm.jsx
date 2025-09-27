import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';

const SkillsForm = ({ data, updateData }) => {
  const [newSkill, setNewSkill] = useState({ technical: '', languages: '', soft: '' });

  const addSkill = (category) => {
    if (newSkill[category].trim()) {
      const currentSkills = data.skills[category] || [];
      updateData('skills', {
        ...data.skills,
        [category]: [...currentSkills, newSkill[category].trim()]
      });
      setNewSkill({ ...newSkill, [category]: '' });
    }
  };

  const removeSkill = (category, index) => {
    const updatedSkills = data.skills[category].filter((_, i) => i !== index);
    updateData('skills', {
      ...data.skills,
      [category]: updatedSkills
    });
  };

  const handleKeyPress = (e, category) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category);
    }
  };

  const SkillCategory = ({ title, category, placeholder, description }) => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex space-x-2">
        <Input
          value={newSkill[category]}
          onChange={(e) => setNewSkill({ ...newSkill, [category]: e.target.value })}
          onKeyPress={(e) => handleKeyPress(e, category)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button 
          onClick={() => addSkill(category)} 
          size="sm"
          disabled={!newSkill[category].trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(data.skills[category] || []).map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {skill}
            <button
              onClick={() => removeSkill(category, index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <p className="text-gray-600">Add your skills in different categories. Press Enter or click + to add each skill.</p>
      </div>

      <SkillCategory
        title="Technical Skills"
        category="technical"
        placeholder="e.g., JavaScript, React, Python, AWS"
        description="Programming languages, frameworks, tools, and technologies"
      />

      <SkillCategory
        title="Languages"
        category="languages"
        placeholder="e.g., English (Native), Spanish (Fluent)"
        description="Languages you speak and your proficiency level"
      />

      <SkillCategory
        title="Soft Skills"
        category="soft"
        placeholder="e.g., Leadership, Communication, Problem Solving"
        description="Personal and interpersonal skills"
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Tips for adding skills:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific (e.g., "React.js" instead of just "JavaScript")</li>
          <li>• Include proficiency levels for languages</li>
          <li>• Focus on skills relevant to your target jobs</li>
          <li>• Use industry-standard terminology</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;
