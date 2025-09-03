CREATE DATABASE Ascent;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TYPE job_status AS ENUM ('wishlist', 'applied', 'online_assessment', 'interview', 'offer', 'rejected');


-- Jobs Table (Dashboard = collection of jobs)
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    status job_status DEFAULT 'wishlist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    ALTER TABLE jobs ADD COLUMN order_index INTEGER DEFAULT 0;

    ALTER TYPE job_status RENAME VALUE 'online_assessment' TO 'onlineAssessment';
    ALTER TYPE job_status RENAME VALUE 'offer' TO 'selected';