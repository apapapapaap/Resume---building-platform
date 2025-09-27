import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';

export const resumeService = {
  async findByUserId(userId) {
    try {
      const sql = 'SELECT id, user_id, title, template_id, is_public, public_url, download_count, view_count, created_at, updated_at FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC';
      const result = await query(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error('Error finding resumes: ' + error.message);
    }
  },

  async findById(id, userId = null) {
    try {
      let sql = 'SELECT * FROM resumes WHERE id = $1';
      const params = [id];
      if (userId) {
        sql += ' AND user_id = $2';
        params.push(userId);
      }
      const result = await query(sql, params);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error finding resume: ' + error.message);
    }
  },

  async create(userId, resumeData) {
    try {
      const {
        title,
        personalDetails = {},
        education = [],
        experience = [],
        skills = {},
        projects = [],
        certifications = [],
        templateId = 'modern'
      } = resumeData;

      const publicUrl = uuidv4();

      const sql = 'INSERT INTO resumes (user_id, title, personal_details, education, experience, skills, projects, certifications, template_id, public_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

      const result = await query(sql, [
        userId,
        title,
        JSON.stringify(personalDetails),
        JSON.stringify(education),
        JSON.stringify(experience),
        JSON.stringify(skills),
        JSON.stringify(projects),
        JSON.stringify(certifications),
        templateId,
        publicUrl
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error('Error creating resume: ' + error.message);
    }
  },

  async update(id, userId, updateData) {
    try {
      const {
        title,
        personalDetails,
        education,
        experience,
        skills,
        projects,
        certifications,
        templateId,
        isPublic
      } = updateData;

      const sql = 'UPDATE resumes SET title = COALESCE($1, title), personal_details = COALESCE($2, personal_details), education = COALESCE($3, education), experience = COALESCE($4, experience), skills = COALESCE($5, skills), projects = COALESCE($6, projects), certifications = COALESCE($7, certifications), template_id = COALESCE($8, template_id), is_public = COALESCE($9, is_public), updated_at = CURRENT_TIMESTAMP WHERE id = $10 AND user_id = $11 RETURNING *';

      const result = await query(sql, [
        title,
        personalDetails ? JSON.stringify(personalDetails) : null,
        education ? JSON.stringify(education) : null,
        experience ? JSON.stringify(experience) : null,
        skills ? JSON.stringify(skills) : null,
        projects ? JSON.stringify(projects) : null,
        certifications ? JSON.stringify(certifications) : null,
        templateId,
        isPublic,
        id,
        userId
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating resume: ' + error.message);
    }
  },

  async delete(id, userId) {
    try {
      const sql = 'DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING *';
      const result = await query(sql, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error deleting resume: ' + error.message);
    }
  },

  updateDownloadCount: async function(resumeId) {
    try {
      const sql = 'UPDATE resumes SET download_count = COALESCE(download_count, 0) + 1 WHERE id = $1';
      await query(sql, [resumeId]);
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  },

  // New function to update profile photo path
  async updateResumePhoto(resumeId, userId, photoPath) {
    try {
      const sql = 'UPDATE resumes SET profile_photo = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *';
      const result = await query(sql, [photoPath, resumeId, userId]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating resume photo: ' + error.message);
    }
  }
};
