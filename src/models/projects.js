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

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails
};