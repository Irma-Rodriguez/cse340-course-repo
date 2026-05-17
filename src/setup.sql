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