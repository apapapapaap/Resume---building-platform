import puppeteer from 'puppeteer';
import { resumeService } from './resumeService.js';

export const pdfService = {
  async generateResumePDF(resumeId, userId) {
    // 1. Fetch resume data from DB
    const resume = await resumeService.findById(resumeId, userId);
    if (!resume) throw new Error('Resume not found');

    // 2. Prepare HTML (use your own template as needed)
    const html = `
      <html>
        <body>
          <h1>${resume.title}</h1>
          <p>${resume.personal_details ? JSON.parse(resume.personal_details).fullName : ''}</p>
          <!-- Add other details here -->
        </body>
      </html>
    `;

    // 3. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();
    return pdfBuffer;
  }
};
