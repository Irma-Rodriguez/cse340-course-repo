import db from "./db.js";

export async function getAllCategories() {
    const query = `
        SELECT *
        FROM categories
        ORDER BY category_name;
    `;

    const result = await db.query(query);
    return result.rows;
}

// Adding category by ID
export async function getCategoryById(categoryId) {
    const query = `
        SELECT
            category_id,
            category_name
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0];
}

// Obtaining all the projects from a category
export async function getProjectsByCategoryId(categoryId) {
    const query = `
        SELECT
            sp.project_id,
            sp.title
        FROM service_projects sp
        JOIN project_categories pc
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.title;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
}

// Obtaining all the projects from a category from a project
export async function getCategoriesByProjectId(projectId) {
    const query = `
        SELECT
            c.category_id,
            c.category_name
        FROM categories c
        JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
}