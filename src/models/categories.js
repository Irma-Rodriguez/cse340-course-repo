import pool from "./db.js";

export async function getAllCategories() {
    const query = `
        SELECT *
        FROM categories
        ORDER BY category_name;
    `;

    const result = await pool.query(query);
    return result.rows;
}
