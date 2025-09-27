import express from 'express';
import pool from '../config/database.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

// 🚨 EMERGENCY USER CREATION ROUTE
router.post('/ensure-user', async (req, res) => {
    try {
        const { id, email, full_name } = req.body;
        
        console.log('👤 Ensuring user exists:', { id, email, full_name });
        
        // Check if user exists
        let user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        
        if (user.rows.length === 0) {
            // Create user if doesn't exist
            user = await pool.query(
                'INSERT INTO users (id, email, full_name, password) VALUES ($1, $2, $3, $4) RETURNING *',
                [id, email || 'test@example.com', full_name || 'Test User', 'password123']
            );
            console.log('✅ Created new user:', user.rows[0]);
        } else {
            console.log('✅ User already exists:', user.rows[0]);
        }
        
        res.json({ success: true, user: user.rows[0] });
    } catch (error) {
        console.error('❌ Error ensuring user exists:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🔍 ENHANCED: Get all resumes for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('📄 Fetching resumes for user:', userId);
        
        const result = await pool.query(
            'SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC',
            [userId]
        );
        
        console.log(`✅ Found ${result.rows.length} resumes for user ${userId}`);
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Error fetching resumes:', error);
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
});

// 🔍 ENHANCED: Create new resume
router.post('/create', async (req, res) => {
    try {
        const { user_id, title } = req.body;
        console.log('📝 Creating resume:', { user_id, title });
        
        if (!user_id) {
            console.error('❌ No user_id provided');
            return res.status(400).json({ error: 'user_id is required' });
        }
        
        // Check if user exists first
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            console.error('❌ User does not exist:', user_id);
            return res.status(400).json({ error: 'User does not exist' });
        }
        
        const result = await pool.query(
            'INSERT INTO resumes (user_id, title) VALUES ($1, $2) RETURNING *',
            [user_id, title || 'My Resume']
        );
        
        console.log('✅ Created resume:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error creating resume:', error);
        res.status(500).json({ error: 'Failed to create resume: ' + error.message });
    }
});

// Get complete resume data with projects
router.get('/:resumeId/complete', async (req, res) => {
    try {
        const { resumeId } = req.params;
        console.log('📊 Fetching complete resume data for:', resumeId);
        
        const [resume, personalDetails, education, experience, projects, skills] = await Promise.all([
            pool.query('SELECT * FROM resumes WHERE id = $1', [resumeId]),
            pool.query('SELECT * FROM personal_details WHERE resume_id = $1', [resumeId]),
            pool.query('SELECT * FROM education WHERE resume_id = $1 ORDER BY sort_order', [resumeId]),
            pool.query('SELECT * FROM experience WHERE resume_id = $1 ORDER BY sort_order', [resumeId]),
            pool.query('SELECT * FROM projects WHERE resume_id = $1 ORDER BY sort_order', [resumeId]).catch(() => ({rows: []})),
            pool.query('SELECT * FROM skills WHERE resume_id = $1 ORDER BY sort_order', [resumeId])
        ]);

        if (resume.rows.length === 0) {
            console.error('❌ Resume not found:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        const responseData = {
            resume: resume.rows[0],
            personalDetails: personalDetails.rows[0] || {},
            education: education.rows,
            experience: experience.rows,
            projects: projects.rows || [],
            skills: skills.rows
        };
        
        console.log('✅ Complete resume data fetched:', {
            resume: resume.rows[0].title,
            hasPersonal: !!personalDetails.rows[0],
            educationCount: education.rows.length,
            experienceCount: experience.rows.length,
            projectsCount: projects.rows?.length || 0,
            skillsCount: skills.rows.length
        });
        
        res.json(responseData);
    } catch (error) {
        console.error('❌ Error fetching resume data:', error);
        res.status(500).json({ error: 'Failed to fetch resume data: ' + error.message });
    }
});

// 📖 NEW: VIEW RESUME ROUTE - Get formatted resume data for display
router.get('/:resumeId/view', async (req, res) => {
    try {
        const { resumeId } = req.params;
        console.log('👁️ Fetching resume for view:', resumeId);
        
        const [resume, personalDetails, education, experience, projects, skills] = await Promise.all([
            pool.query('SELECT * FROM resumes WHERE id = $1', [resumeId]),
            pool.query('SELECT * FROM personal_details WHERE resume_id = $1', [resumeId]),
            pool.query('SELECT * FROM education WHERE resume_id = $1 ORDER BY sort_order', [resumeId]),
            pool.query('SELECT * FROM experience WHERE resume_id = $1 ORDER BY sort_order', [resumeId]),
            pool.query('SELECT * FROM projects WHERE resume_id = $1 ORDER BY sort_order', [resumeId]).catch(() => ({rows: []})),
            pool.query('SELECT * FROM skills WHERE resume_id = $1 ORDER BY sort_order', [resumeId])
        ]);

        if (resume.rows.length === 0) {
            console.error('❌ Resume not found for view:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        const resumeData = {
            resume: resume.rows[0],
            personalDetails: personalDetails.rows[0] || {},
            education: education.rows,
            experience: experience.rows,
            projects: projects.rows || [],
            skills: skills.rows
        };
        
        console.log('✅ Resume data fetched for view:', {
            title: resume.rows[0].title,
            sections: {
                personal: !!personalDetails.rows[0],
                education: education.rows.length,
                experience: experience.rows.length,
                projects: projects.rows?.length || 0,
                skills: skills.rows.length
            }
        });
        
        res.json(resumeData);
    } catch (error) {
        console.error('❌ Error fetching resume for view:', error);
        res.status(500).json({ error: 'Failed to fetch resume: ' + error.message });
    }
});

// 🔍 ENHANCED: Save personal details
router.post('/:resumeId/personal-details', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const { full_name, email, phone, address, linkedin_url, github_url, portfolio_url, professional_summary } = req.body;
        
        console.log('💾 Saving personal details for resume:', resumeId);
        console.log('📋 Personal details data:', { full_name, email, phone });

        // Check if resume exists
        const resumeCheck = await pool.query('SELECT id FROM resumes WHERE id = $1', [resumeId]);
        if (resumeCheck.rows.length === 0) {
            console.error('❌ Resume not found:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        const result = await pool.query(`
            INSERT INTO personal_details (resume_id, full_name, email, phone, address, linkedin_url, github_url, portfolio_url, professional_summary)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (resume_id) DO UPDATE SET
                full_name = $2, email = $3, phone = $4, address = $5,
                linkedin_url = $6, github_url = $7, portfolio_url = $8, professional_summary = $9,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [resumeId, full_name, email, phone, address, linkedin_url, github_url, portfolio_url, professional_summary]);

        // Update resume's updated_at timestamp
        await pool.query('UPDATE resumes SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [resumeId]);

        console.log('✅ Personal details saved successfully');
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error saving personal details:', error);
        res.status(500).json({ error: 'Failed to save personal details: ' + error.message });
    }
});

// 🔍 ENHANCED: Save education
router.post('/:resumeId/education', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const educationList = req.body;

        console.log('🎓 Saving education for resume:', resumeId);
        console.log('📚 Education entries:', educationList.length);

        if (!Array.isArray(educationList)) {
            console.error('❌ Education data is not an array');
            return res.status(400).json({ error: 'Education data must be an array' });
        }

        // Check if resume exists
        const resumeCheck = await pool.query('SELECT id FROM resumes WHERE id = $1', [resumeId]);
        if (resumeCheck.rows.length === 0) {
            console.error('❌ Resume not found:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Delete existing education
        await pool.query('DELETE FROM education WHERE resume_id = $1', [resumeId]);
        console.log('🗑️ Deleted existing education entries');

        // Insert new education entries
        for (let i = 0; i < educationList.length; i++) {
            const edu = educationList[i];
            await pool.query(`
                INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, current, grade_gpa, description, sort_order)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [resumeId, edu.institution, edu.degree, edu.field_of_study, edu.start_date || null, edu.end_date || null, edu.current || false, edu.grade_gpa, edu.description, i]);
        }

        // Update resume's updated_at timestamp
        await pool.query('UPDATE resumes SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [resumeId]);

        console.log(`✅ Education saved successfully: ${educationList.length} entries`);
        res.json({ message: 'Education saved successfully', count: educationList.length });
    } catch (error) {
        console.error('❌ Error saving education:', error);
        res.status(500).json({ error: 'Failed to save education: ' + error.message });
    }
});

// 🔍 ENHANCED: Save experience
router.post('/:resumeId/experience', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const experienceList = req.body;

        console.log('💼 Saving experience for resume:', resumeId);
        console.log('📝 Experience entries:', experienceList.length);

        if (!Array.isArray(experienceList)) {
            console.error('❌ Experience data is not an array');
            return res.status(400).json({ error: 'Experience data must be an array' });
        }

        // Check if resume exists
        const resumeCheck = await pool.query('SELECT id FROM resumes WHERE id = $1', [resumeId]);
        if (resumeCheck.rows.length === 0) {
            console.error('❌ Resume not found:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        await pool.query('DELETE FROM experience WHERE resume_id = $1', [resumeId]);
        console.log('🗑️ Deleted existing experience entries');

        for (let i = 0; i < experienceList.length; i++) {
            const exp = experienceList[i];
            await pool.query(`
                INSERT INTO experience (resume_id, company, position, location, start_date, end_date, current, description, sort_order)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [resumeId, exp.company, exp.position, exp.location, exp.start_date || null, exp.end_date || null, exp.current || false, exp.description, i]);
        }

        // Update resume's updated_at timestamp
        await pool.query('UPDATE resumes SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [resumeId]);

        console.log(`✅ Experience saved successfully: ${experienceList.length} entries`);
        res.json({ message: 'Experience saved successfully', count: experienceList.length });
    } catch (error) {
        console.error('❌ Error saving experience:', error);
        res.status(500).json({ error: 'Failed to save experience: ' + error.message });
    }
});

// 🚀 NEW: Save projects
router.post('/:resumeId/projects', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const projectsList = req.body;

        console.log('🚀 Saving projects for resume:', resumeId);
        console.log('📋 Project entries:', projectsList.length);

        if (!Array.isArray(projectsList)) {
            console.error('❌ Projects data is not an array');
            return res.status(400).json({ error: 'Projects data must be an array' });
        }

        // Check if resume exists
        const resumeCheck = await pool.query('SELECT id FROM resumes WHERE id = $1', [resumeId]);
        if (resumeCheck.rows.length === 0) {
            console.error('❌ Resume not found:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        // First, try to create projects table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                technologies TEXT,
                url VARCHAR(500),
                start_date DATE,
                end_date DATE,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Delete existing projects
        await pool.query('DELETE FROM projects WHERE resume_id = $1', [resumeId]);
        console.log('🗑️ Deleted existing project entries');

        // Insert new project entries
        for (let i = 0; i < projectsList.length; i++) {
            const project = projectsList[i];
            await pool.query(`
                INSERT INTO projects (resume_id, name, description, technologies, url, start_date, end_date, sort_order)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [resumeId, project.name, project.description, project.technologies, project.url, project.start_date || null, project.end_date || null, i]);
        }

        // Update resume's updated_at timestamp
        await pool.query('UPDATE resumes SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [resumeId]);

        console.log(`✅ Projects saved successfully: ${projectsList.length} entries`);
        res.json({ message: 'Projects saved successfully', count: projectsList.length });
    } catch (error) {
        console.error('❌ Error saving projects:', error);
        res.status(500).json({ error: 'Failed to save projects: ' + error.message });
    }
});

// 🔍 ENHANCED: Save skills
router.post('/:resumeId/skills', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const skillsList = req.body;

        console.log('🛠️ Saving skills for resume:', resumeId);
        console.log('⚡ Skills entries:', skillsList.length);

        if (!Array.isArray(skillsList)) {
            console.error('❌ Skills data is not an array');
            return res.status(400).json({ error: 'Skills data must be an array' });
        }

        // Check if resume exists
        const resumeCheck = await pool.query('SELECT id FROM resumes WHERE id = $1', [resumeId]);
        if (resumeCheck.rows.length === 0) {
            console.error('❌ Resume not found:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        await pool.query('DELETE FROM skills WHERE resume_id = $1', [resumeId]);
        console.log('🗑️ Deleted existing skills entries');

        for (let i = 0; i < skillsList.length; i++) {
            const skill = skillsList[i];
            await pool.query(`
                INSERT INTO skills (resume_id, category, skill_name, proficiency_level, sort_order)
                VALUES ($1, $2, $3, $4, $5)
            `, [resumeId, skill.category, skill.skill_name, skill.proficiency_level, i]);
        }

        // Update resume's updated_at timestamp
        await pool.query('UPDATE resumes SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [resumeId]);

        console.log(`✅ Skills saved successfully: ${skillsList.length} entries`);
        res.json({ message: 'Skills saved successfully', count: skillsList.length });
    } catch (error) {
        console.error('❌ Error saving skills:', error);
        res.status(500).json({ error: 'Failed to save skills: ' + error.message });
    }
});

// Update resume title
router.put('/:resumeId/title', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await pool.query(
            'UPDATE resumes SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [title, resumeId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating resume title:', error);
        res.status(500).json({ error: 'Failed to update resume title' });
    }
});

// 🎨 🔧 COMPLETELY FIXED PDF GENERATION - ALL BLACK TEXT
router.get('/:resumeId/download-pdf', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const textColor = req.query.textColor || 'black'; // 🔧 Support textColor parameter
        
        console.log('📥 Generating PDF for resume:', resumeId, 'with text color:', textColor);
        
        // Add delay to ensure data is saved
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const [resume, personalDetails, education, experience, projects, skills] = await Promise.all([
            pool.query('SELECT * FROM resumes WHERE id = $1', [resumeId]),
            pool.query('SELECT * FROM personal_details WHERE resume_id = $1', [resumeId]),
            pool.query('SELECT * FROM education WHERE resume_id = $1 ORDER BY sort_order', [resumeId]),
            pool.query('SELECT * FROM experience WHERE resume_id = $1 ORDER BY sort_order', [resumeId]),
            pool.query('SELECT * FROM projects WHERE resume_id = $1 ORDER BY sort_order', [resumeId]).catch(() => ({rows: []})),
            pool.query('SELECT * FROM skills WHERE resume_id = $1 ORDER BY sort_order', [resumeId])
        ]);

        if (resume.rows.length === 0) {
            console.error('❌ Resume not found for PDF:', resumeId);
            return res.status(404).json({ error: 'Resume not found' });
        }

        console.log('📄 PDF data summary:', {
            resume: resume.rows[0].title,
            hasPersonal: personalDetails.rows.length > 0,
            educationCount: education.rows.length,
            experienceCount: experience.rows.length,
            projectsCount: projects.rows?.length || 0,
            skillsCount: skills.rows.length
        });

        const doc = new PDFDocument({ 
            margin: 50,
            size: 'A4'
        });
        
        const filename = `${(resume.rows[0].title || 'resume').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // IMPORTANT: Pipe before starting to write content
        doc.pipe(res);

        const personal = personalDetails.rows[0] || {};
        let yPosition = 50;
        
        // 🔧 FIXED: Define BLACK colors only - NO MORE LIGHT BLUE
        const BLACK = '#000000';          // Pure Black
        const DARK_GRAY = '#2c2c2c';     // Very Dark Gray 
        const MEDIUM_GRAY = '#333333';   // Medium Gray
        const HEADER_BG = '#2c3e50';     // Dark header background (stays for visual appeal)
        
        console.log('🎨 Using BLACK text colors for PDF generation');
        
        // Header with dark background but white text on dark BG is fine
        doc.rect(0, 0, doc.page.width, 100).fill(HEADER_BG);
        
        doc.fillColor('white')  // White text on dark background is fine
           .fontSize(24)
           .font('Helvetica-Bold')
           .text(personal.full_name || 'Professional Resume', 50, 30);
        
        // Contact info - white on dark background
        const contactInfo = [];
        if (personal.email) contactInfo.push(personal.email);
        if (personal.phone) contactInfo.push(personal.phone);
        if (personal.address) contactInfo.push(personal.address);
        
        if (contactInfo.length > 0) {
            doc.fontSize(12)
               .font('Helvetica')
               .fillColor('white')  // White on dark background
               .text(contactInfo.join(' | '), 50, 65);
        }

        // Social links - white on dark background
        const socialLinks = [];
        if (personal.linkedin_url) socialLinks.push(`LinkedIn: ${personal.linkedin_url}`);
        if (personal.github_url) socialLinks.push(`GitHub: ${personal.github_url}`);
        if (personal.portfolio_url) socialLinks.push(`Portfolio: ${personal.portfolio_url}`);

        if (socialLinks.length > 0) {
            doc.fontSize(9)
               .fillColor('white')  // White on dark background
               .text(socialLinks.join(' | '), 50, 80);
        }

        yPosition = 120;
        
        // 🔧 CRITICAL FIX: ALL BODY TEXT IS NOW BLACK
        doc.fillColor(BLACK);  // Set to BLACK and keep it BLACK
        
        console.log('🔧 Body text color set to BLACK (#000000)');

        // Professional Summary - BLACK TEXT
        if (personal.professional_summary) {
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }
            
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .fillColor(BLACK)  // 🔧 BLACK header
               .text('PROFESSIONAL SUMMARY', 50, yPosition);
            
            doc.rect(50, yPosition + 20, 150, 3).fill(BLACK);  // 🔧 BLACK underline
            yPosition += 35;
            
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor(BLACK)  // 🔧 BLACK text
               .text(personal.professional_summary, 50, yPosition, { width: 500 });
            
            const summaryLines = Math.ceil(personal.professional_summary.length / 75);
            yPosition += summaryLines * 14 + 25;
        }

        // Experience Section - ALL BLACK TEXT
        if (experience.rows.length > 0) {
            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
                doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
            }
            
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .fillColor(BLACK)  // 🔧 BLACK header
               .text('PROFESSIONAL EXPERIENCE', 50, yPosition);
            
            doc.rect(50, yPosition + 20, 200, 3).fill(BLACK);  // 🔧 BLACK underline
            yPosition += 35;
            
            experience.rows.forEach((exp, index) => {
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                    doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
                }
                
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .fillColor(BLACK)  // 🔧 BLACK job title
                   .text(`${exp.position || 'Position'}`, 50, yPosition);
                
                doc.fontSize(12)
                   .font('Helvetica')
                   .fillColor(BLACK)  // 🔧 BLACK company name
                   .text(`${exp.company || 'Company'}`, 50, yPosition + 18);
                
                const dateText = `${exp.start_date || 'Start'} - ${exp.current ? 'Present' : (exp.end_date || 'End')}`;
                doc.fontSize(10)
                   .fillColor(BLACK)  // 🔧 BLACK date text
                   .text(`${exp.location || ''} | ${dateText}`, 350, yPosition + 5);
                
                yPosition += 40;
                
                if (exp.description) {
                    const bullets = exp.description.split('\n').filter(line => line.trim());
                    bullets.forEach(bullet => {
                        doc.fontSize(10)
                           .fillColor(BLACK)  // 🔧 BLACK bullet points
                           .text(`• ${bullet.trim()}`, 70, yPosition, { width: 480 });
                        yPosition += 14;
                    });
                }
                yPosition += 20;
            });
        }

        // Projects Section - ALL BLACK TEXT
        if (projects.rows && projects.rows.length > 0) {
            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
                doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
            }
            
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .fillColor(BLACK)  // 🔧 BLACK header
               .text('PROJECTS', 50, yPosition);
            
            doc.rect(50, yPosition + 20, 100, 3).fill(BLACK);  // 🔧 BLACK underline
            yPosition += 35;
            
            projects.rows.forEach((project) => {
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                    doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
                }
                
                doc.fontSize(13)
                   .font('Helvetica-Bold')
                   .fillColor(BLACK)  // 🔧 BLACK project name
                   .text(project.name || 'Project', 50, yPosition);
                
                if (project.technologies) {
                    doc.fontSize(10)
                       .font('Helvetica')
                       .fillColor(BLACK)  // 🔧 BLACK technologies
                       .text(`Technologies: ${project.technologies}`, 50, yPosition + 16);
                    yPosition += 16;
                }

                if (project.url) {
                    doc.fontSize(9)
                       .fillColor(BLACK)  // 🔧 BLACK URL
                       .text(`URL: ${project.url}`, 50, yPosition + 16);
                    yPosition += 16;
                }
                
                yPosition += 20;
                
                if (project.description) {
                    doc.fontSize(10)
                       .fillColor(BLACK)  // 🔧 BLACK description
                       .text(project.description, 70, yPosition, { width: 480 });
                    const descLines = Math.ceil(project.description.length / 80);
                    yPosition += descLines * 12 + 10;
                }
                yPosition += 15;
            });
        }

        // Education Section - ALL BLACK TEXT
        if (education.rows.length > 0) {
            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
                doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
            }
            
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .fillColor(BLACK)  // 🔧 BLACK header
               .text('EDUCATION', 50, yPosition);
            
            doc.rect(50, yPosition + 20, 100, 3).fill(BLACK);  // 🔧 BLACK underline
            yPosition += 35;
            
            education.rows.forEach((edu) => {
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                    doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
                }
                
                const degreeText = `${edu.degree || 'Degree'}${edu.field_of_study ? ' in ' + edu.field_of_study : ''}`;
                doc.fontSize(12)
                   .font('Helvetica-Bold')
                   .fillColor(BLACK)  // 🔧 BLACK degree
                   .text(degreeText, 50, yPosition);
                
                doc.fontSize(11)
                   .font('Helvetica')
                   .fillColor(BLACK)  // 🔧 BLACK institution
                   .text(edu.institution || 'Institution', 50, yPosition + 15);
                
                const eduDateText = `${edu.start_date || 'Start'} - ${edu.current ? 'Present' : (edu.end_date || 'End')}`;
                doc.fontSize(10)
                   .fillColor(BLACK)  // 🔧 BLACK dates
                   .text(eduDateText + (edu.grade_gpa ? ` | ${edu.grade_gpa}` : ''), 350, yPosition + 5);
                
                yPosition += 35;
                
                if (edu.description) {
                    doc.fontSize(10)
                       .fillColor(BLACK)  // 🔧 BLACK description
                       .text(edu.description, 70, yPosition, { width: 480 });
                    yPosition += Math.ceil(edu.description.length / 80) * 12 + 10;
                }
                yPosition += 15;
            });
        }

        // Skills Section - ALL BLACK TEXT
        if (skills.rows.length > 0) {
            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
                doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
            }
            
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .fillColor(BLACK)  // 🔧 BLACK header
               .text('SKILLS', 50, yPosition);
            
            doc.rect(50, yPosition + 20, 80, 3).fill(BLACK);  // 🔧 BLACK underline
            yPosition += 35;
            
            const skillsByCategory = skills.rows.reduce((acc, skill) => {
                const category = skill.category || 'Other';
                if (!acc[category]) acc[category] = [];
                acc[category].push(skill.skill_name);
                return acc;
            }, {});

            Object.entries(skillsByCategory).forEach(([category, skillNames]) => {
                if (yPosition > 720) {
                    doc.addPage();
                    yPosition = 50;
                    doc.fillColor(BLACK);  // 🔧 Ensure BLACK on new page
                }
                
                doc.fontSize(12)
                   .font('Helvetica-Bold')
                   .fillColor(BLACK)  // 🔧 BLACK category
                   .text(`${category}:`, 50, yPosition);
                
                doc.fontSize(11)
                   .font('Helvetica')
                   .fillColor(BLACK)  // 🔧 BLACK skills list
                   .text(skillNames.join(', '), 120, yPosition, { width: 420 });
                
                const skillsLines = Math.ceil(skillNames.join(', ').length / 60);
                yPosition += skillsLines * 14 + 15;
            });
        }

        // FIXED: Safe page numbering with BLACK text
        try {
            const totalPages = doc.bufferedPageRange().count;
            console.log('Total pages created:', totalPages);
            
            // Only add page numbers to pages that actually exist
            for (let i = 0; i < totalPages; i++) {
                doc.switchToPage(i);
                doc.fontSize(8)
                   .fillColor(DARK_GRAY)  // 🔧 BLACK page numbers
                   .text(`Page ${i + 1} of ${totalPages}`, 
                         doc.page.width - 100, 
                         doc.page.height - 30, 
                         { align: 'right' });
            }
        } catch (footerError) {
            console.log('Footer generation skipped due to:', footerError.message);
        }

        console.log('✅ PDF generated successfully with BLACK text');
        doc.end();
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        // Make sure to end the response properly
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
        }
    }
});

// Delete resume
router.delete('/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        
        const result = await pool.query('DELETE FROM resumes WHERE id = $1 RETURNING *', [resumeId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        res.json({ message: 'Resume deleted successfully', deleted: result.rows[0] });
    } catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
});

// Enhanced duplicate resume with projects
router.post('/:resumeId/duplicate', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const { new_title } = req.body;
        
        const originalResume = await pool.query('SELECT * FROM resumes WHERE id = $1', [resumeId]);
        if (originalResume.rows.length === 0) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        const newResume = await pool.query(
            'INSERT INTO resumes (user_id, title) VALUES ($1, $2) RETURNING *',
            [originalResume.rows[0].user_id, new_title || `${originalResume.rows[0].title} (Copy)`]
        );
        
        const newResumeId = newResume.rows[0].id;
        
        // Copy all related data including projects
        await pool.query(`
            INSERT INTO personal_details (resume_id, full_name, email, phone, address, linkedin_url, github_url, portfolio_url, professional_summary)
            SELECT $1, full_name, email, phone, address, linkedin_url, github_url, portfolio_url, professional_summary
            FROM personal_details WHERE resume_id = $2
        `, [newResumeId, resumeId]);
        
        await pool.query(`
            INSERT INTO education (resume_id, institution, degree, field_of_study, start_date, end_date, current, grade_gpa, description, sort_order)
            SELECT $1, institution, degree, field_of_study, start_date, end_date, current, grade_gpa, description, sort_order
            FROM education WHERE resume_id = $2
        `, [newResumeId, resumeId]);
        
        await pool.query(`
            INSERT INTO experience (resume_id, company, position, location, start_date, end_date, current, description, sort_order)
            SELECT $1, company, position, location, start_date, end_date, current, description, sort_order
            FROM experience WHERE resume_id = $2
        `, [newResumeId, resumeId]);
        
        // Copy projects if table exists
        try {
            await pool.query(`
                INSERT INTO projects (resume_id, name, description, technologies, url, start_date, end_date, sort_order)
                SELECT $1, name, description, technologies, url, start_date, end_date, sort_order
                FROM projects WHERE resume_id = $2
            `, [newResumeId, resumeId]);
        } catch (error) {
            console.log('Projects table might not exist yet, skipping...');
        }
        
        await pool.query(`
            INSERT INTO skills (resume_id, category, skill_name, proficiency_level, sort_order)
            SELECT $1, category, skill_name, proficiency_level, sort_order
            FROM skills WHERE resume_id = $2
        `, [newResumeId, resumeId]);
        
        res.json(newResume.rows[0]);
    } catch (error) {
        console.error('Error duplicating resume:', error);
        res.status(500).json({ error: 'Failed to duplicate resume' });
    }
});

export default router;
