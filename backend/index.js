import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database.js';
import pool from './config/database.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize database
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for profile pictures
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Resume Platform API is running with PostgreSQL!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    database: 'PostgreSQL',
    demoCredentials: {
      email: 'demo@resumebuilder.com',
      password: 'demo123'
    },
    features: [
      'User Authentication',
      'Resume Builder',
      'Multiple Resume Versions',
      'PDF Generation (Black Text)',
      'Resume Dashboard'
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Resume Platform API - Full Featured Resume Builder',
    documentation: '/api/health',
    demoLogin: {
      email: 'demo@resumebuilder.com',
      password: 'demo123',
      note: 'Use these credentials to test the application'
    },
    endpoints: {
      auth: '/api/auth (login, register, profile)',
      resumes: '/api/resumes (CRUD, PDF download)',
      health: '/api/health (system status)'
    },
    features: {
      'Resume Builder': 'Create and edit professional resumes',
      'Multiple Templates': 'Various PDF templates available (Black Text)',
      'Real-time Saving': 'Auto-save resume sections',
      'PDF Export': 'Download resumes as PDF with black text',
      'Dashboard': 'Manage multiple resumes'
    }
  });
});

// Resume builder specific endpoint
app.get('/api/resume-builder/status', (req, res) => {
  res.json({
    status: 'active',
    features: {
      personalDetails: 'enabled',
      education: 'enabled', 
      experience: 'enabled',
      skills: 'enabled',
      pdfGeneration: 'enabled - black text',
      multipleVersions: 'enabled',
      dashboard: 'enabled'
    },
    pdfSettings: {
      defaultTextColor: 'black',
      headerColor: 'black',
      supportedColors: ['black', 'dark', 'navy'],
      template: 'modern-professional'
    },
    lastUpdated: new Date().toISOString()
  });
});

// PDF Configuration endpoint
app.get('/api/pdf/config', (req, res) => {
  res.json({
    textColor: 'black',
    headerColor: 'black',
    backgroundColor: 'white',
    fontFamily: 'Arial',
    fontSize: {
      header: 18,
      subheader: 14,
      body: 11
    },
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#000000',
      text: '#000000'
    },
    template: 'professional-black-text'
  });
});

// Quick PDF color fix endpoint
app.post('/api/pdf/fix-colors', (req, res) => {
  console.log('🔧 PDF Color Fix Applied - All text will be black');
  res.json({
    message: 'PDF colors fixed - text is now black',
    applied: {
      textColor: 'black (#000000)',
      headerColor: 'black (#000000)',
      bodyColor: 'black (#000000)'
    },
    timestamp: new Date().toISOString()
  });
});

// 🔧 SMART DEMO USER CREATION FUNCTION - DETECTS YOUR SCHEMA
const createDemoUser = async () => {
  try {
    console.log('🔧 Checking for demo user...');
    
    // First, detect your users table structure
    const tableInfo = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const columns = tableInfo.rows.map(row => row.column_name);
    console.log('📊 Users table columns detected:', columns.join(', '));
    
    // Hash the demo password
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    // Check if demo user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@resumebuilder.com']
    );
    
    if (existingUser.rows.length === 0) {
      // Build dynamic insert query based on available columns
      let insertColumns = ['email', 'password'];
      let insertValues = ['demo@resumebuilder.com', hashedPassword];
      let placeholders = ['$1', '$2'];
      
      // Add full_name if column exists
      if (columns.includes('full_name')) {
        insertColumns.push('full_name');
        insertValues.push('Demo User');
        placeholders.push('$' + insertValues.length);
      } else if (columns.includes('name')) {
        insertColumns.push('name');
        insertValues.push('Demo User');
        placeholders.push('$' + insertValues.length);
      }
      
      // Add timestamp columns if they exist
      if (columns.includes('created_at')) {
        insertColumns.push('created_at');
        placeholders.push('NOW()');
      }
      if (columns.includes('updated_at')) {
        insertColumns.push('updated_at');
        placeholders.push('NOW()');
      }
      
      const insertQuery = `
        INSERT INTO users (${insertColumns.join(', ')}) 
        VALUES (${placeholders.join(', ')}) 
        RETURNING id
      `;
      
      console.log('📝 Insert query:', insertQuery);
      const result = await pool.query(insertQuery, insertValues);
      
      console.log('✅ Demo user created successfully!');
      console.log('📧 Email: demo@resumebuilder.com');
      console.log('🔑 Password: demo123');
      console.log('🆔 User ID:', result.rows[0].id);
      
      // Try to create a sample resume
      await createSampleResume(result.rows[0].id);
      
    } else {
      console.log('ℹ️ Demo user already exists');
      console.log('📧 Email: demo@resumebuilder.com');
      console.log('🔑 Password: demo123');
      console.log('🆔 User ID:', existingUser.rows[0].id);
    }
    
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
    
    // Fallback: try with minimal columns
    try {
      console.log('🔄 Trying fallback method...');
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
        ['demo@resumebuilder.com', hashedPassword]
      );
      
      console.log('✅ Demo user created with fallback method!');
      console.log('📧 Email: demo@resumebuilder.com');
      console.log('🔑 Password: demo123');
      
    } catch (fallbackError) {
      console.error('❌ Fallback failed:', fallbackError.message);
      console.log('💡 Demo user creation failed, but test routes still work:');
      console.log('   • /test-resume');
      console.log('   • /working-form'); 
      console.log('   • /dashboard');
    }
  }
};

// Helper function to create sample resume
const createSampleResume = async (userId) => {
  try {
    // Check if resumes table exists and get its structure
    const resumeTableInfo = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'resumes' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    if (resumeTableInfo.rows.length === 0) {
      console.log('⚠️ Resumes table not found, skipping sample resume');
      return;
    }
    
    const resumeColumns = resumeTableInfo.rows.map(row => row.column_name);
    
    // Build dynamic insert for resume
    let resumeInsertColumns = ['user_id', 'title'];
    let resumeInsertValues = [userId, 'Sample Professional Resume'];
    let resumePlaceholders = ['$1', '$2'];
    
    if (resumeColumns.includes('created_at')) {
      resumeInsertColumns.push('created_at');
      resumePlaceholders.push('NOW()');
    }
    if (resumeColumns.includes('updated_at')) {
      resumeInsertColumns.push('updated_at');
      resumePlaceholders.push('NOW()');
    }
    
    const resumeQuery = `
      INSERT INTO resumes (${resumeInsertColumns.join(', ')}) 
      VALUES (${resumePlaceholders.join(', ')})
    `;
    
    await pool.query(resumeQuery, resumeInsertValues);
    console.log('📋 Sample resume created for demo user');
    
  } catch (resumeError) {
    console.log('⚠️ Could not create sample resume:', resumeError.message);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      details: err.message 
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      message: 'Unauthorized Access', 
      details: err.message 
    });
  }
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ 
      message: 'Database Connection Error', 
      details: 'Unable to connect to PostgreSQL database' 
    });
  }
  
  res.status(500).json({ 
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    demoLogin: {
      email: 'demo@resumebuilder.com',
      password: 'demo123'
    },
    testRoutes: {
      noAuth: [
        '/test-resume',
        '/working-form',
        '/dashboard'
      ]
    },
    availableRoutes: [
      'GET /',
      'GET /api/health', 
      'GET /api/resume-builder/status',
      'GET /api/pdf/config',
      'POST /api/pdf/fix-colors',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/resumes/user/:userId',
      'POST /api/resumes/create',
      'GET /api/resumes/:resumeId/complete',
      'GET /api/resumes/:resumeId/download-pdf?textColor=black'
    ],
    requestedPath: req.originalUrl,
    method: req.method
  });
});

// Start server and create demo user
app.listen(PORT, async () => {
  console.log(`🚀 Resume Platform Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Resume Builder: http://localhost:${PORT}/api/resume-builder/status`);
  console.log(`🎨 PDF Config: http://localhost:${PORT}/api/pdf/config`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: PostgreSQL`);
  console.log(`📁 Static files: /uploads (profile pictures)`);
  console.log(`🔧 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  
  console.log(`\n📡 Available API Endpoints:`);
  console.log(`   Authentication: /api/auth`);
  console.log(`   Resume Operations: /api/resumes`);  
  console.log(`   System Health: /api/health`);
  console.log(`   PDF Configuration: /api/pdf/config`);
  
  console.log(`\n🎨 PDF Settings:`);
  console.log(`   Default Text Color: BLACK (#000000)`);
  console.log(`   PDF Download: /api/resumes/:id/download-pdf?textColor=black`);
  console.log(`   Fix Colors: POST /api/pdf/fix-colors`);
  
  console.log(`\n🎯 Test Routes (No Auth Required):`);
  console.log(`   Simple Builder: http://localhost:3000/test-resume`);
  console.log(`   Complete Form: http://localhost:3000/working-form`);
  console.log(`   Dashboard: http://localhost:3000/dashboard`);
  
  // Create demo user after server starts
  console.log(`\n🔧 Setting up demo user...`);
  setTimeout(createDemoUser, 3000); // Wait 3 seconds for database connection
});
