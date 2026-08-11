import db from './db.js'

const addVolunteerToProject = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rowCount > 0; // Returns true if a new row was inserted, false if it already existed
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rowCount > 0; // Returns true if a row was deleted, false otherwise
};

const getVolunteersByProjectId = async (projectId) => {
    const query = `
        SELECT u.user_id, u.name AS volunteer_name, u.email AS volunteer_email
        FROM volunteer v
        JOIN users u ON v.user_id = u.user_id
        WHERE v.project_id = $1
        ORDER BY u.name;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getVolunteeredProjectsByUserId = async (userId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.project_date, o.name AS organization_name
        FROM volunteer v
        JOIN service_project sp ON v.project_id = sp.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY sp.project_date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isVolunteerForProject = async (userId, projectId) => {
    const query = `
        SELECT *
        FROM volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export {
    addVolunteerToProject,
    removeVolunteer,
    getVolunteersByProjectId,
    isVolunteerForProject,
    getVolunteeredProjectsByUserId
};