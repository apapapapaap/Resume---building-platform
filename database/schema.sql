-- Users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL DEFAULT 'My Resume',
    template_id INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT FALSE,
    public_url VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal details
CREATE TABLE IF NOT EXISTS personal_details (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    full_name VARCHAR(200),
    email VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    linkedin_url VARCHAR(300),
    github_url VARCHAR(300),
    portfolio_url VARCHAR(300),
    profile_picture_url VARCHAR(500),
    professional_summary TEXT
);

-- Education
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    institution VARCHAR(200),
    degree VARCHAR(150),
    field_of_study VARCHAR(150),
    start_date DATE,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    grade_gpa VARCHAR(50),
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Experience
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    company VARCHAR(200),
    position VARCHAR(150),
    location VARCHAR(100),
    start_date DATE,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    category VARCHAR(100),
    skill_name VARCHAR(100),
    proficiency_level VARCHAR(50),
    sort_order INTEGER DEFAULT 0
);
