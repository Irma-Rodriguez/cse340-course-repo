-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

SELECT * FROM organization

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO service_projects
(organization_id, title, description, location, date)
VALUES
(1, 'Food Drive', 'Collect food for families', 'Bogota', '2026-05-20'),

(1, 'School Cleanup', 'Clean local school', 'Medellin', '2026-06-01'),

(2, 'Medical Camp', 'Free health services', 'Cali', '2026-06-10');

SELECT * FROM service_projects;
SELECT * FROM organization;

-- ========================================
-- Categories Table
-- ========================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project Categories (Many-to-Many)
-- ========================================

CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert Categories
-- ========================================

INSERT INTO categories (category_name)
VALUES
('Education'),
('Health'),
('Community Service');

-- ========================================
-- Associate Projects with Categories
-- ========================================

INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 3), -- Food Drive -> Community Service
(2, 1), -- School Cleanup -> Education
(3, 2); -- Medical Camp -> Health

SELECT * FROM project_categories;

-- ========================================
-- Roles Table
-- ========================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- ========================================
-- Insert Initial Roles
-- ========================================

INSERT INTO roles (role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

SELECT * FROM roles;

-- ========================================
-- Users Table
-- ========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Test User
-- ========================================

INSERT INTO users (name, email, password_hash, role_id)
VALUES
('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users 
WHERE email = 'test@example.com';

SELECT * FROM users;
SELECT * FROM roles;

UPDATE users
SET role_id = (
    SELECT role_id
    FROM roles
    WHERE role_name = 'admin'
)
WHERE email = 'admin@example.com';

SELECT u.user_id, u.email, r.role_name
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- ========================================
-- Volunteers (Users projects)
-- ========================================

CREATE TABLE project_volunteers (
    user_id INT NOT NULL,
    project_id INT NOT NULL,

    PRIMARY KEY (user_id, project_id),

    CONSTRAINT fk_volunteer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_volunteer_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE
);

SELECT * FROM project_volunteers;

SELECT table_name
FROM information_schema.tables
WHERE table_name = 'project_volunteers';