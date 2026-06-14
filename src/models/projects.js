import db from './db.js';

const getAllProjects = async () => {
    const sql = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.date;
    `;

    const result = await db.query(sql);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const sql = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.date >= CURRENT_DATE
        ORDER BY sp.date ASC
        LIMIT $1;
    `;

    const result = await db.query(sql, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const sql = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(sql, [id]);
    return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO service_projects (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_projects
        SET title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};

const addVolunteer = async (userId, projectId) => {
    const sql = `
        INSERT INTO project_volunteers
        (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    await db.query(sql, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const sql = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
        AND project_id = $2;
    `;

    await db.query(sql, [userId, projectId]);
};

const isVolunteer = async (userId, projectId) => {

    const sql = `
        SELECT *
        FROM project_volunteers
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result = await db.query(sql, [userId, projectId]);

    return result.rows.length > 0;
};

const getVolunteerProjects = async (userId) => {

    const sql = `
        SELECT
            sp.project_id,
            sp.title,
            sp.date,
            sp.location
        FROM project_volunteers pv

        JOIN service_projects sp
            ON pv.project_id = sp.project_id

        WHERE pv.user_id = $1

        ORDER BY sp.date;
    `;

    const result = await db.query(sql, [userId]);

    return result.rows;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isVolunteer,
    getVolunteerProjects
};