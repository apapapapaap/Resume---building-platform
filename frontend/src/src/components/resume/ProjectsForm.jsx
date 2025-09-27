import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const ProjectsForm = ({ data, updateData }) => {
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      url: '',
      github: '',
      startDate: '',
      endDate: ''
    };
    
    updateData('projects', [...data.projects, newProject]);
  };

  const removeProject = (id) => {
    updateData('projects', data.projects.filter(project => project.id !== id));
  };

  const updateProject = (id, field, value) => {
    updateData('projects', data.projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={addProject} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {data.projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet.</p>
          <Button onClick={addProject} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}

      {data.projects.map((project, index) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Project #{index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProject(project.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                placeholder="E-commerce Platform"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <Input
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live URL
                </label>
                <Input
                  value={project.url}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="https://project-demo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository
                </label>
                <Input
                  value={project.github}
                  onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <Input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="• Built a full-stack e-commerce platform with React and Node.js&#10;• Implemented user authentication and payment processing&#10;• Deployed on AWS with CI/CD pipeline"
                required
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsForm;
