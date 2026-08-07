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

const assignCategoryToProject = async(projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
        `;

    // params: [categoryId, projectId]
    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    if (!Array.isArray(categoryIds)) {
        // if there's a single id, wrap it
        categoryIds = categoryIds ? [categoryIds] : [];
    }

    for (const cid of categoryIds) {
        // ensure value is an integer
        const parsed = parseInt(cid, 10);
        if (!isNaN(parsed)) {
            await assignCategoryToProject(projectId, parsed);
        }
    }
}

/**
 * Creates a new category in the database.
 * @param {string} name - The name of the category.
 */
const createCategory = async (name) => {
    const query = `
      INSERT INTO category (name)
      VALUES ($1)
      RETURNING category_id
    `;

    const queryParams = [name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create Category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new Category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
      UPDATE category
      SET name = $1
      WHERE category_id = $2;
    `;

    const queryParams = [name, categoryId];
    await db.query(query, queryParams);
};

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId, 
    getCategoryDetails,
    createCategory,
    updateCategory,
    assignCategoryToProject,
    updateCategoryAssignments
};  
