import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const userService = {
  // Find user by email
  async findByEmail(email) {
    try {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  },

  // Find user by ID
  async findById(id) {
    try {
      const result = await query('SELECT id, email, full_name, profile_picture_url, created_at FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  },

  // Create new user
  async create(userData) {
    try {
      const { email, password, fullName } = userData;
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const result = await query(
        'INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at',
        [email, hashedPassword, fullName]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('User with this email already exists');
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  // Update user
  async update(id, userData) {
    try {
      const { fullName, profilePictureUrl } = userData;
      const result = await query(
        'UPDATE users SET full_name = COALESCE($1, full_name), profile_picture_url = COALESCE($2, profile_picture_url) WHERE id = $3 RETURNING id, email, full_name, profile_picture_url',
        [fullName, profilePictureUrl, id]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Get user stats
  async getUserStats(userId) {
    try {
      const result = await query(`
        SELECT 
          COUNT(r.id) as total_resumes,
          COUNT(CASE WHEN r.is_public = true THEN 1 END) as public_resumes,
          COALESCE(SUM(r.download_count), 0) as total_downloads,
          COALESCE(SUM(r.view_count), 0) as total_views
        FROM users u
        LEFT JOIN resumes r ON u.id = r.user_id
        WHERE u.id = $1
        GROUP BY u.id
      `, [userId]);
      
      return result.rows[0] || {
        total_resumes: 0,
        public_resumes: 0,
        total_downloads: 0,
        total_views: 0
      };
    } catch (error) {
      throw new Error(`Error getting user stats: ${error.message}`);
    }
  }
};
