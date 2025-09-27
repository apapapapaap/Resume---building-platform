# 📄 Professional Resume Builder Platform

A comprehensive full-stack web application for creating, managing, and sharing professional resumes with advanced features and modern UI/UX.

## 🚀 Quick Setup & Installation

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (local or remote)
- Git

### **📥 Installation Steps**

#### **1. Clone & Install**
Clone the repository
git clone https://github.com/apapapapaap/Resume---building-platform.git
cd Resume---building-platform

Install backend dependencies
cd backend
npm install
npm install nodemon --save-dev # For development

Install frontend dependencies
cd ../frontend
npm install

text

#### **2. Database Setup**
Create PostgreSQL database
createdb resume_builder

Or use your existing PostgreSQL setup
Update connection details in backend/.env
text

#### **3. Environment Configuration**
Backend: Create .env file in backend folder
cd backend
cp .env.example .env

Update with your database credentials:
DATABASE_URL=postgresql://your-username:your-password@localhost:5432/resume_builder
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001
text

#### **4. Start Development Servers**
Terminal 1: Start Backend
cd backend
npm run dev

Backend runs on http://localhost:5001
Terminal 2: Start Frontend
cd frontend
npm run dev

Frontend runs on http://localhost:3000


### **⚡ Alternative Quick Commands**

#### **If nodemon fails, use:**
cd backend
npm start

or
node index.js


#### **Docker Alternative:**
Run everything with Docker
docker-compose up --build


### **🎯 Quick Test**
1. **Backend**: Visit http://localhost:5001/api/health
2. **Frontend**: Visit http://localhost:3000  
3. **Demo Login**: `demo@resumebuilder.com` / `demo123`
4. **Test Routes**: `/test-resume`, `/working-form`, `/dashboard`

## 🚀 Live Demo & Quick Start

**Demo Login Credentials:**
- Email: `demo@resumebuilder.com`
- Password: `demo123`

**Test Routes (No Login Required):**
- `/test-resume` - Simple Resume Builder
- `/working-form` - Complete Resume Form
- `/dashboard` - Enhanced Dashboard

## 📁 Project Structure

resume-builder/
│
├── frontend/ # React.js Frontend Application
│ ├── src/
│ │ ├── components/ # Reusable UI Components
│ │ ├── pages/ # Route Components
│ │ ├── context/ # React Context (Auth)
│ │ ├── App.jsx # Main Application Component
│ │ └── index.js # Application Entry Point
│ ├── public/
│ ├── package.json
│ └── Dockerfile
│
├── backend/ # Node.js/Express.js Backend API
│ ├── routes/ # API Route Handlers
│ ├── models/ # Database Models
│ ├── middleware/ # Custom Middleware
│ ├── controllers/ # Business Logic
│ ├── config/ # Configuration Files
│ ├── index.js # Server Entry Point
│ ├── package.json
│ └── Dockerfile
│
├── docker-compose.yml # Docker Compose Configuration
├── .env.example # Environment Variables Template
└── README.md # This File



## 🛠️ Tech Stack & Justification

### Frontend Technologies
- **React.js 18** - Modern UI library with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing with protected routes
- **Axios** - HTTP client for API communication
- **TailwindCSS** - Utility-first CSS framework for styling
- **Context API** - State management for authentication

### Backend Technologies  
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Minimal web framework for REST APIs
- **PostgreSQL** - Relational database for structured data
- **bcryptjs** - Password hashing and security
- **jsonwebtoken** - JWT authentication implementation
- **PDFKit** - Server-side PDF generation
- **CORS** - Cross-origin resource sharing middleware

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization for consistent development/production environments
- **Multi-stage Docker builds** - Optimized production images
- **Environment-based configuration** - Flexible deployment across environments

### Why This Tech Stack?

1. **React.js + Vite**: Component-based architecture with fast development server ensures maintainable and efficient development
2. **Node.js/Express**: JavaScript full-stack development reduces context switching and enables code reuse
3. **PostgreSQL**: ACID compliance and relational structure perfect for user/resume data with complex relationships
4. **Docker**: Ensures consistent environments across development, testing, and production
5. **JWT Authentication**: Stateless authentication scales well and supports distributed systems
6. **TailwindCSS**: Utility-first approach enables rapid UI development with consistent design

## ✨ Features & Latest Updates

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token storage
- **Protected routes** with automatic redirection
- **User registration & login** with input validation
- **Session persistence** across browser sessions
- **Smart database schema detection** - Adapts to different database structures

### 📋 Resume Management
- **Complete Resume Builder** with all professional sections:
  - Personal Details (Name, Contact, Social Links)
  - Professional Summary
  - Work Experience (Multiple entries, current position tracking)
  - Education (Multiple degrees, GPA tracking, current status)
  - Projects (Technology stacks, URLs, descriptions)
  - Skills (Categorized by type, proficiency levels)

### 🎯 Enhanced Dashboard Features
- **User-specific resume management** - Each user sees only their resumes
- **Bulk operations** - Select and delete multiple resumes
- **Resume statistics** - Quick overview of resume sections
- **One-click actions** - View, Edit, Download, Delete
- **Real-time status updates** - Live feedback on operations

### 📄 Resume Viewing & Export
- **Professional PDF Export** - Black text optimization for printing
- **Mobile-responsive preview** - Optimized for all devices
- **Real-time preview** - See changes instantly
- **Shareable resume functionality**

### 🔧 Developer Features
- **Test Routes** - Development routes bypassing authentication for quick testing
- **Sample data generation** - Quick testing with realistic professional data
- **Comprehensive error handling** - User-friendly error states and feedback
- **Loading states** - Professional loading indicators throughout the app
- **Form validation** - Client-side and server-side validation
- **Auto-save functionality** - Prevents data loss

### 🎨 UI/UX Enhancements
- **Modern card-based design** - Clean and professional interface
- **Hover effects and animations** - Smooth user interactions
- **Responsive grid layouts** - Works seamlessly on all screen sizes
- **Status indicators** - Clear feedback for all operations
- **Professional color scheme** - Consistent branding throughout

## 🐳 Docker Setup & Installation

### Prerequisites
- Docker Desktop (Latest version)
- Docker Compose v2+
- Git

### Quick Start with Docker

1. **Clone the repository**
git clone https://github.com/apapapapaap/Resume---building-platform.git
cd Resume---building-platform



2. **Set up environment variables**
cp .env.example .env

Edit .env with your configuration


3. **Build and run with Docker Compose**
Development mode
docker-compose up --build

Production mode (if available)
docker-compose -f docker-compose.prod.yml up --build



4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Database: localhost:5432

### Manual Development Setup

#### Frontend Setup
cd frontend
npm install
npm run dev

Runs on http://localhost:3000


#### Backend Setup
cd backend
npm install
npm run dev # Uses nodemon for development

Or: npm start (uses node directly)
Runs on http://localhost:5001


#### Database Setup
Using Docker for PostgreSQL
docker run --name resume-db
-e POSTGRES_DB=resume_builder
-e POSTGRES_USER=admin
-e POSTGRES_PASSWORD=password123
-p 5432:5432
-d postgres:15



## 🔧 Environment Configuration

### Frontend Environment (.env)
VITE_API_URL=http://localhost:5001
VITE_ENV=development



### Backend Environment (.env)
Server Configuration
PORT=5001
NODE_ENV=development

Database Configuration
DATABASE_URL=postgresql://admin:password123@localhost:5432/resume_builder
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_builder
DB_USER=admin
DB_PASSWORD=password123

JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

CORS Configuration
FRONTEND_URL=http://localhost:3000



## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Resume Management
- `GET /api/resumes/user/:userId` - Get user's resumes
- `POST /api/resumes/create` - Create new resume
- `GET /api/resumes/:id/view` - Get resume details
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/download-pdf` - Download PDF with black text

### Resume Sections
- `POST /api/resumes/:id/personal-details` - Save personal details
- `POST /api/resumes/:id/education` - Save education entries
- `POST /api/resumes/:id/experience` - Save work experience
- `POST /api/resumes/:id/projects` - Save projects
- `POST /api/resumes/:id/skills` - Save skills

### System
- `GET /api/health` - System health check
- `GET /api/pdf/config` - PDF configuration settings

## 🧪 Testing & Development

### Available Test Routes
1. **Simple Builder** - `/test-resume`
   - Basic personal details form
   - Quick resume creation with sample data
   
2. **Complete Form** - `/working-form`
   - All resume sections
   - Multiple entries support
   - Advanced form validation

3. **Dashboard** - `/dashboard`
   - User-specific resume management
   - Bulk operations
   - Enhanced UI features

### Sample Data Generation
- Click "🎯 Fill Sample Data" in any form
- Automatically populates realistic professional data
- Perfect for testing and demonstrations
- Uses current user information when available

## 🔒 Security Features

### Data Protection
- **Password hashing** with bcrypt (salt rounds: 10)
- **JWT token expiration** and secure storage
- **CORS protection** with configurable origins
- **Input sanitization** and validation
- **Protected routes** requiring authentication
- **Environment variable security** for sensitive data

### Smart Database Handling
- **Schema detection** - Automatically adapts to different database structures
- **Error handling** - Graceful fallbacks for missing columns or tables
- **Connection pooling** - Efficient database connections
- **Transaction support** for data integrity

## 🚀 Deployment Guide

### Production Docker Deployment
Build production images
docker-compose -f docker-compose.prod.yml build

Deploy with production settings
docker-compose -f docker-compose.prod.yml up -d

View logs
docker-compose logs -f



### Environment-Specific Builds
- **Development**: Full development tools, hot reloading, source maps
- **Production**: Optimized builds, minimal images, security hardened

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Common Issues

1. **Nodemon Command Not Found**
cd backend
npm install nodemon --save-dev

Or use: npm start / node index.js

2. **Port Conflicts**
Change ports in docker-compose.yml or .env files
Frontend: PORT=3001
Backend: PORT=5002
text

3. **Database Connection Issues**
Reset database container
docker-compose down -v
docker-compose up --build


4. **CORS Errors**
- Verify VITE_API_URL matches backend URL
- Check FRONTEND_URL in backend environment
- Ensure both servers are running

5. **PDF Generation Issues**
- Check that all resume data is saved before downloading
- Verify PDFKit dependencies are installed
- Use the black text parameter: `?textColor=black`

## 📊 Performance Optimizations

- **Lazy loading** for heavy components and routes
- **Debounced form inputs** for better UX and reduced API calls
- **Optimized Docker images** with multi-stage builds
- **Database indexing** for faster queries
- **Compressed assets** for faster loading
- **Efficient state management** with React Context
- **Memoization** for expensive calculations

## 🔮 Future Enhancements

- [ ] Multiple resume templates system
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Integration with job boards and LinkedIn
- [ ] Mobile app development
- [ ] Resume scoring and optimization suggestions
- [ ] Dark mode theme support
- [ ] Multi-language support
- [ ] Advanced PDF customization options
- [ ] Resume sharing and feedback system

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


**Built with ❤️ using React, Node.js, PostgreSQL, and Docker**
