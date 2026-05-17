import pool from './db.js';

export async function getAllProjects() {

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

    const result = await pool.query(sql);

    return result.rows;
}