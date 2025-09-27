import puppeteer from 'puppeteer';
import { resumeService } from './resumeService.js';

export const pdfService = {
  async generateResumePDF(resumeId, userId, templateId = 'modern') {
    try {
      // Get resume data
      const resume = await resumeService.findById(resumeId, userId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      // Parse JSON fields
      const resumeData = {
        ...resume,
        personal_details: typeof resume.personal_details === 'string' 
          ? JSON.parse(resume.personal_details) 
          : resume.personal_details,
        education: typeof resume.education === 'string' 
          ? JSON.parse(resume.education) 
          : resume.education,
        experience: typeof resume.experience === 'string' 
          ? JSON.parse(resume.experience) 
          : resume.experience,
        skills: typeof resume.skills === 'string' 
          ? JSON.parse(resume.skills) 
          : resume.skills,
        projects: typeof resume.projects === 'string' 
          ? JSON.parse(resume.projects) 
          : resume.projects,
        certifications: typeof resume.certifications === 'string' 
          ? JSON.parse(resume.certifications) 
          : resume.certifications
      };

      // Generate HTML content
      const htmlContent = generateResumeHTML(resumeData, templateId);

      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Set content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true
      });

      await browser.close();

      // Update download count
      await resumeService.updateDownloadCount(resumeId);

      return pdfBuffer;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }
};

function generateResumeHTML(resume, templateId = 'modern') {
  const { personal_details, education, experience, skills, projects, certifications } = resume;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          font-size: 14px;
        }
        
        .resume {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
          margin-bottom: 30px;
        }
        
        .name {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        
        .contact-info {
          color: #666;
          font-size: 14px;
        }
        
        .contact-info span {
          margin: 0 10px;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .item {
          margin-bottom: 15px;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5px;
        }
        
        .item-title {
          font-weight: bold;
          font-size: 16px;
        }
        
        .item-subtitle {
          color: #2563eb;
          font-weight: 500;
        }
        
        .item-date {
          color: #666;
          font-size: 12px;
        }
        
        .item-location {
          color: #666;
          font-size: 12px;
        }
        
        .item-description {
          margin-top: 5px;
          white-space: pre-line;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        
        .skill-category h4 {
          font-weight: bold;
          margin-bottom: 5px;
          color: #2563eb;
        }
        
        .skill-list {
          color: #666;
        }
        
        .summary {
          font-style: italic;
          color: #555;
          text-align: justify;
        }
        
        @media print {
          body { print-color-adjust: exact; }
          .resume { margin: 0; padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="resume">
        <!-- Header -->
        <div class="header">
          <div class="name">${personal_details?.fullName || 'Your Name'}</div>
          <div class="contact-info">
            ${personal_details?.email ? `<span>📧 ${personal_details.email}</span>` : ''}
            ${personal_details?.phone ? `<span>📞 ${personal_details.phone}</span>` : ''}
            ${personal_details?.location ? `<span>📍 ${personal_details.location}</span>` : ''}
            ${personal_details?.linkedin ? `<span>🔗 ${personal_details.linkedin}</span>` : ''}
          </div>
        </div>

        <!-- Summary -->
        ${personal_details?.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${personal_details.summary}</div>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience?.length ? `
          <div class="section">
            <div class="section-title">Professional Experience</div>
            ${experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${exp.position}</div>
                    <div class="item-subtitle">${exp.company}</div>
                    ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                  </div>
                  <div class="item-date">
                    ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education?.length ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                    <div class="item-subtitle">${edu.institution}</div>
                    ${edu.gpa ? `<div class="item-location">GPA: ${edu.gpa}</div>` : ''}
                  </div>
                  <div class="item-date">
                    ${edu.startDate} - ${edu.endDate}
                  </div>
                </div>
                ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills && (skills.technical?.length || skills.languages?.length || skills.soft?.length) ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-grid">
              ${skills.technical?.length ? `
                <div class="skill-category">
                  <h4>Technical Skills</h4>
                  <div class="skill-list">${skills.technical.join(', ')}</div>
                </div>
              ` : ''}
              ${skills.languages?.length ? `
                <div class="skill-category">
                  <h4>Languages</h4>
                  <div class="skill-list">${skills.languages.join(', ')}</div>
                </div>
              ` : ''}
              ${skills.soft?.length ? `
                <div class="skill-category">
                  <h4>Soft Skills</h4>
                  <div class="skill-list">${skills.soft.join(', ')}</div>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Projects -->
        ${projects?.length ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(project => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${project.name}</div>
                    ${project.technologies ? `<div class="item-subtitle">Technologies: ${project.technologies}</div>` : ''}
                  </div>
                  ${project.startDate ? `
                    <div class="item-date">
                      ${project.startDate} - ${project.endDate || 'Present'}
                    </div>
                  ` : ''}
                </div>
                ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                ${project.url || project.github ? `
                  <div style="margin-top: 5px; color: #2563eb; font-size: 12px;">
                    ${project.url ? `🌐 Live Demo: ${project.url}` : ''}
                    ${project.url && project.github ? ' | ' : ''}
                    ${project.github ? `📂 GitHub: ${project.github}` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Certifications -->
        ${certifications?.length ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${certifications.map(cert => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${cert.name}</div>
                    <div class="item-subtitle">${cert.issuer}</div>
                    ${cert.credentialId ? `<div class="item-location">Credential ID: ${cert.credentialId}</div>` : ''}
                  </div>
                  <div class="item-date">
                    ${cert.date}${cert.expiryDate ? ` - ${cert.expiryDate}` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}
