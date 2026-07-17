import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
      FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
}


const getCategoryById = async (id) => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM service_project sp
        JOIN project_category pc
            ON sp.project_id = pc.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const getCategoryDetails = async(id) => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};


export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId, getCategoryDetails }  
