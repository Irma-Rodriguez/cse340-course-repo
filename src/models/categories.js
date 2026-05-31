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

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (
            category_id,
            project_id
        )
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

export async function updateCategoryAssignments(projectId, categoryIds) {

    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export async function createCategory(categoryName) {
    const query = `
        INSERT INTO categories (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName]);
    return result.rows[0].category_id;
}

export async function updateCategory(categoryId, categoryName) {
    const query = `
        UPDATE categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
}