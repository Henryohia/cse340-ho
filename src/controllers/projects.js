// Import any needed model functions
import { getAllOrganizations } from '../models/organizations.js';
import { 
    getAllProjects, 
    getProjectDetails, 
    getUpcomingProjects, 
    getProjectsByOrganizationId,
    createProject,
    updateProject 
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

import { body, validationResult } from "express-validator";

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .isLength({ max: 200 })
        .withMessage('Project location cannot exceed 200 characters'),
        body('project_date')
        .notEmpty()
        .withMessage('Date is required')
        .isLength({ max: 200 })
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .trim()
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
];


const NUMBER_OF_UPCOMING_PROJECTS =  5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const organizations = await getAllOrganizations();
    const title = "Upcoming Service Projects";
    res.render("projects", { title, projects, organizations });
};

// Create a new controller function named showProjectDetailsPage that calls the new getProjectDetails model function you just created.
// This function should extract the service project ID from the URL parameters.
// It should use the getProjectDetails model function you created to retrieve the service project with that ID from the database.
// It should then render a new view for the service project details page (project.ejs), passing in the service project data.
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Project Details';
    res.render("project", { title, projectDetails, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = "Add New Project";

    res.render("new-project", { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, project_date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, project_date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    // Format project_date for HTML date input (YYYY-MM-DD)
    if (projectDetails && projectDetails.project_date) {
        projectDetails.formattedDate = new Date(projectDetails.project_date).toISOString().slice(0,10);
    } else {
        projectDetails.formattedDate = '';
    }

    const title = "Edit Project";
    res.render("edit-project", { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((Error) => {
            req.flash("error", error.msg);  
        });

        // Redirect back to the new project form
        return res.redirect("/edit-project" + req.params.id);
    }
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;
    
    await updateProject(projectId, title, description, location, date, organizationId);

    // Set a success flsh message
    req.flash("success", "Project updated successfully!");

    res.redirect(`/project/${projectId}`);

}


// Export any controller functions
export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    projectValidation, 
    processNewProjectForm, 
    showEditProjectForm, 
    processEditProjectForm 
};