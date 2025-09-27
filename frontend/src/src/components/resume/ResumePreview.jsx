import React from 'react';

const ResumePreview = ({ data }) => {
  const { personalDetails, education, experience, skills, projects, certifications } = data;

  return (
    <div className="bg-white p-8 shadow-lg" style={{ minHeight: '800px' }}>
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalDetails.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600 mt-2 space-y-1">
          {personalDetails.email && <div>📧 {personalDetails.email}</div>}
          {personalDetails.phone && <div>📞 {personalDetails.phone}</div>}
          {personalDetails.location && <div>📍 {personalDetails.location}</div>}
          {personalDetails.linkedin && <div>🔗 {personalDetails.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {personalDetails.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700">{personalDetails.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
              <div className="mt-2 text-gray-700 whitespace-pre-line">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-blue-600">{edu.institution}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.languages?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
          {skills.technical?.length > 0 && (
            <div className="mb-2">
              <strong>Technical:</strong> {skills.technical.join(', ')}
            </div>
          )}
          {skills.languages?.length > 0 && (
            <div className="mb-2">
              <strong>Languages:</strong> {skills.languages.join(', ')}
            </div>
          )}
          {skills.soft?.length > 0 && (
            <div className="mb-2">
              <strong>Soft Skills:</strong> {skills.soft.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-gray-900">{project.name}</h3>
              {project.technologies && (
                <p className="text-sm text-blue-600">Technologies: {project.technologies}</p>
              )}
              <p className="text-gray-700 mt-1">{project.description}</p>
              <div className="mt-1 space-x-4">
                {project.url && (
                  <a href={project.url} className="text-blue-600 text-sm hover:underline">
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} className="text-blue-600 text-sm hover:underline">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-blue-600">{cert.issuer}</p>
                </div>
                <div className="text-sm text-gray-600">{cert.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
