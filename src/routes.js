import express from "express";

import { showHomePage } from "./controllers/index.js";
import { 
    showNewOrganizationForm, 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm 
} from "./controllers/organization.js";

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm 
} from "./controllers/projects.js";

import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
 } from "./controllers/categories.js";

import { testErrorPage } from "./controllers/errors.js";
// import { showOrganizationDetailsPage } from "./controllers/organization.js";
// import {  } from "./controllers/projects.js";
import { getCategoriesByProjectId } from "./models/categories.js";
import { validationResult } from "express-validator";





const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/categories", showCategoriesPage);

//error-handling routes
router.get("/test=error", testErrorPage);

//Route for organization details page
router.get("/organization/:id", showOrganizationDetailsPage);

// Route for Category details page
router.get("/category/:id", showCategoryDetailsPage);
// router.get("/category/:id", showCategoryDetailsPage);

// Route for new organization page
router.get("/new-organization", showNewOrganizationForm);

// Route to handle new orgainzation form submission
router.post("/new-organization", organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get("/edit-organization/:id", showEditOrganizationForm);

router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);


// Route for new organization page
router.get("/new-project", showNewProjectForm);

// Route to handle new orgainzation form submission
router.post("/new-project", projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);

// Route to display the edit project form
router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);


// Route for new Category page
router.get("/new-category", showNewCategoryForm);

// Route to handle new category form submission
router.post("/new-category", projectValidation, processNewCategoryForm);

// Route to display the edit Category form
router.get("/edit-category/:id", showEditCategoryForm);

router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

export default router;