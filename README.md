# 📄 Professional Resume Builder Platform

A comprehensive full-stack web application for creating, managing, and sharing professional resumes with advanced features and modern UI/UX.

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
│ ├── server.js # Server Entry Point
│ ├── package.json
│ └── Dockerfile
│
├── docker-compose.yml # Docker Compose Configuration
├── .env.example # Environment Variables Template
└── README.md # This File


## 🛠️ Tech Stack & Justification

### Frontend Technologies
- **React.js 18** - Modern UI library with hooks and functional components
- **React Router v6** - Client-side routing with protected routes
- **Axios** - HTTP client for API communication
- **CSS-in-JS** - Inline styles for component-scoped styling
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

1. **React.js**: Component-based architecture ensures maintainable and reusable UI code
2. **Node.js/Express**: JavaScript full-stack development reduces context switching
3. **PostgreSQL**: ACID compliance and relational structure perfect for user/resume data
4. **Docker**: Ensures consistent environments across development, testing, and production
5. **JWT Authentication**: Stateless authentication scales well and supports distributed systems

## ✨ Features & Latest Updates

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token storage
- **Protected routes** with automatic redirection
- **User registration & login** with input validation
- **Session persistence** across browser sessions

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
- **Public Resume Viewing** - Shareable resume links (Login required for security)
- **Professional PDF Export** - Black text optimization for printing
- **Mobile-responsive preview** - Optimized for all devices
- **Real-time preview** - See changes instantly

### 🔧 Developer Features
- **Test Routes** - Development routes bypassing authentication
- **Sample data generation** - Quick testing with realistic data
- **Error handling** - Comprehensive error states and user feedback
- **Loading states** - Professional loading indicators
- **Form validation** - Client-side and server-side validation

### 🎨 UI/UX Enhancements
- **Modern card-based design** - Clean and professional interface
- **Hover effects and animations** - Smooth user interactions
- **Responsive grid layouts** - Works on all screen sizes
- **Status indicators** - Clear feedback for all operations
- **Professional color scheme** - Consistent branding

## 🐳 Docker Setup & Installation

### Prerequisites
- Docker Desktop (Latest version)
- Docker Compose v2+
- Git

### Quick Start with Docker

1. **Clone the repository**
git clone <your-repo-url>
cd resume-builder


2. **Set up environment variables**
cp .env.example .env

Edit .env with your configuration

3. **Build and run with Docker Compose**
Development mode
docker-compose up --build

Production mode
docker-compose -f docker-compose.prod.yml up --build


4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Database: localhost:5432

### Manual Development Setup

#### Frontend Setup
cd frontend
npm install
npm start

Runs on http://localhost:3000


#### Backend Setup
cd backend
npm install
npm run dev

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
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ENV=development


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
CORS_ORIGIN=http://localhost:3000


## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Resume Management
- `GET /api/resumes/user/:userId` - Get user's resumes
- `POST /api/resumes/create` - Create new resume
- `GET /api/resumes/:id/view` - Get resume details (Public)
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/download-pdf` - Download PDF

### Resume Sections
- `POST /api/resumes/:id/personal-details` - Save personal details
- `POST /api/resumes/:id/education` - Save education entries
- `POST /api/resumes/:id/experience` - Save work experience
- `POST /api/resumes/:id/projects` - Save projects
- `POST /api/resumes/:id/skills` - Save skills

## 🧪 Testing & Development

### Available Test Routes
1. **Simple Builder** - `/test-resume`
   - Basic personal details form
   - Quick resume creation
   
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

## 🔒 Security Features

### Resume Viewing Security
- **Login Required**: Users must authenticate to view resumes for security
- **User Verification**: Only authenticated users can access resume content
- **Session Validation**: JWT tokens validate user sessions
- **Data Protection**: Personal information protected behind authentication

### Additional Security Measures
- Password hashing with bcrypt
- JWT token expiration
- CORS protection
- Input sanitization
- Protected routes
- Environment variable security

## 🚀 Deployment Guide

### Production Docker Deployment
Build production images
docker-compose -f docker-compose.prod.yml build

Deploy with production settings
docker-compose -f docker-compose.prod.yml up -d

View logs
docker-compose logs -f



### Environment-Specific Builds
- **Development**: Full development tools, hot reloading
- **Production**: Optimized builds, minimal images, security hardened

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
Change ports in docker-compose.yml
ports:
- "3001:3000" # Frontend
- "5002:5001" # Backend


2. **Database Connection Issues**
Reset database container
docker-compose down -v
docker-compose up --build


3. **CORS Errors**
- Verify REACT_APP_API_URL matches backend URL
- Check CORS_ORIGIN in backend environment

## 📊 Performance Optimizations

- **Lazy loading** for heavy components
- **Debounced form inputs** for better UX
- **Optimized Docker images** with multi-stage builds
- **Database indexing** for faster queries
- **Compressed assets** for faster loading

## 🔮 Future Enhancements

- [ ] Resume templates system
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Integration with job boards
- [ ] Mobile app development
- [ ] Resume scoring system
- [ ] Dark mode theme support

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


**Built with ❤️ using React, Node.js, and Docker**
