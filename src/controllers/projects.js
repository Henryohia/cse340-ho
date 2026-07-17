// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getProjectDetails } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };